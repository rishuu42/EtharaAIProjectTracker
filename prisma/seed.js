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

  console.log("Admin user created/updated: admin@ethara.ai / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
