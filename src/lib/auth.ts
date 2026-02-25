import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

const ADMIN_COOKIE = "luxurea-admin";
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days

export async function hashPassword(pw: string) {
  return bcrypt.hash(pw, 12);
}

export async function verifyPassword(pw: string, hash: string) {
  return bcrypt.compare(pw, hash);
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const val = cookieStore.get(ADMIN_COOKIE)?.value;
  return val === "authenticated";
}

export async function verifyAdmin(email: string, password: string) {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) return false;
  return verifyPassword(password, admin.password);
}
