import { NextResponse } from "next/server";
import {
  createUserServerClient,
  isUserAuthConfigured,
} from "@/app/lib/user-auth";

export async function GET() {
  if (!isUserAuthConfigured()) {
    return NextResponse.json({ configured: false, user: null });
  }

  const supabase = await createUserServerClient();

  if (!supabase) {
    return NextResponse.json({ configured: false, user: null });
  }

  const { data, error } = await supabase.auth.getUser();
  const user = error ? null : data.user;

  return NextResponse.json({
    configured: true,
    user: user
      ? {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.display_name ?? user.email,
        }
      : null,
  });
}
