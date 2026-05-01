const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  // Create Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@ethara.ai" },
    update: {},
    create: {
      email: "admin@ethara.ai",
      name: "Ethara Admin",
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log("Admin user created: admin@ethara.ai / admin123");

  // Create Sample Project
  const project = await prisma.project.create({
    data: {
      name: "Strategic AI Roadmap",
      description: "Defining the long-term vision for EtharaAI integration.",
      ownerId: admin.id,
    }
  });

  // Create Sample Tasks with Priorities
  await prisma.task.createMany({
    data: [
      {
        title: "Initial Market Analysis",
        description: "Analyze competitors in the AI space.",
        status: "done",
        priority: "high",
        projectId: project.id,
        assigneeId: admin.id
      },
      {
        title: "Infrastructure Scaling Plan",
        description: "Plan for global server deployment.",
        status: "in-progress",
        priority: "medium",
        projectId: project.id,
        assigneeId: admin.id
      },
      {
        title: "User Experience Audit",
        description: "Review current dashboard accessibility.",
        status: "todo",
        priority: "low",
        projectId: project.id,
        assigneeId: admin.id
      }
    ]
  });

  console.log("Sample project and tasks seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
