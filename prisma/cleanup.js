const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning up duplicate projects...");
  
  // Get all projects
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'asc' }
  });

  const seen = new Set();
  const toDelete = [];

  for (const project of projects) {
    if (seen.has(project.name)) {
      toDelete.push(project.id);
    } else {
      seen.add(project.name);
    }
  }

  if (toDelete.length > 0) {
    // Delete tasks and members first to avoid foreign key issues
    await prisma.task.deleteMany({
      where: { projectId: { in: toDelete } }
    });
    await prisma.projectMember.deleteMany({
      where: { projectId: { in: toDelete } }
    });
    // Delete projects
    const deleted = await prisma.project.deleteMany({
      where: { id: { in: toDelete } }
    });
    console.log(`Deleted ${deleted.count} duplicate projects.`);
  } else {
    console.log("No duplicate projects found.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
