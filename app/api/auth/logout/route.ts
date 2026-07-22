import { NextResponse } from "next/server";
import {
  clearLegacyUserSessionCookies,
  getAuthClientOrResponse,
} from "@/app/lib/user-auth";

export async function POST() {
  const authClient = await getAuthClientOrResponse();

  if (!("response" in authClient)) {
    await authClient.supabase.auth.signOut();
  }

  const response = NextResponse.json({ ok: true });
  clearLegacyUserSessionCookies(response);

  return response;
}
