import "server-only";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function verifyAdminCredentials(login: string, password: string) {
  const admin = await prisma.adminUser.findUnique({ where: { login } });
  if (!admin) return null;
  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) return null;
  return admin;
}

export async function ensureAdminUser(login: string, password: string) {
  const existing = await prisma.adminUser.findUnique({ where: { login } });
  if (existing) return existing;
  const passwordHash = await bcrypt.hash(password, 10);
  return prisma.adminUser.create({ data: { login, passwordHash } });
}