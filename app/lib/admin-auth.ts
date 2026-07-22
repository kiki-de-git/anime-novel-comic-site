import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const adminSessionCookieName = "wave_admin_session";

function getAdminPassword() {
  const password = process.env.ADMIN_PASSWORD?.trim();

  return password || null;
}

function createAdminToken() {
  const password = getAdminPassword();
  if (!password) return "";

  return createHmac("sha256", password)
    .update("wave-admin-session")
    .digest("hex");
}

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export function verifyAdminPassword(password: string) {
  const adminPassword = getAdminPassword();

  return Boolean(adminPassword && safeCompare(password, adminPassword));
}

export function createAdminSessionValue() {
  return createAdminToken();
}

export function isAdminSessionValue(value?: string) {
  const expectedToken = createAdminToken();

  return Boolean(value && expectedToken && safeCompare(value, expectedToken));
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminSessionCookieName)?.value;

  return isAdminSessionValue(token);
}

export function isAdminRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookies = cookieHeader
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);
  const sessionCookie = cookies.find((item) =>
    item.startsWith(`${adminSessionCookieName}=`),
  );
  const token = sessionCookie?.slice(adminSessionCookieName.length + 1);

  return isAdminSessionValue(token);
}
