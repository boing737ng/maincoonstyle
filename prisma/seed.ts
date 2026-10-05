import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const login = process.env.ADMIN_LOGIN;
  const password = process.env.ADMIN_PASSWORD;

  if (!login || !password) {
    throw new Error("ADMIN_LOGIN and ADMIN_PASSWORD must be set before seeding");
  }

  const existing = await prisma.adminUser.findUnique({ where: { login } });
  if (!existing) {
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.adminUser.create({ data: { login, passwordHash } });
    console.log(`Created admin user "${login}"`);
  } else {
    console.log(`Admin user "${login}" already exists`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
