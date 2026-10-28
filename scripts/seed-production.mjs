import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

try {
  const login = process.env.ADMIN_LOGIN;
  const password = process.env.ADMIN_PASSWORD;

  if (!login || !password) {
    throw new Error("ADMIN_LOGIN and ADMIN_PASSWORD must be set");
  }

  const existing = await prisma.adminUser.findUnique({ where: { login } });

  if (!existing) {
    await prisma.adminUser.create({
      data: {
        login,
        passwordHash: await bcrypt.hash(password, 12),
      },
    });
    console.log(`Created admin user "${login}"`);
  } else {
    console.log(`Admin user "${login}" already exists`);
  }
} finally {
  await prisma.$disconnect();
}
