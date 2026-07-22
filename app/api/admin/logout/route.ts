import { NextResponse } from "next/server";
import { adminSessionCookieName } from "@/app/lib/admin-auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });

  response.cookies.delete(adminSessionCookieName);

  return response;
}
