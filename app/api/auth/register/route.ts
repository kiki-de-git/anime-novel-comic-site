import { NextResponse } from "next/server";
import {
  clearLegacyUserSessionCookies,
  getAuthClientOrResponse,
} from "@/app/lib/user-auth";

export async function POST(request: Request) {
  const authClient = await getAuthClientOrResponse();

  if ("response" in authClient) {
    return authClient.response;
  }

  const { email, password, nickname } = (await request.json()) as {
    email?: string;
    password?: string;
    nickname?: string;
  };

  if (!email || !password) {
    return NextResponse.json({ message: "请填写邮箱和密码。" }, { status: 400 });
  }

  const { data, error } = await authClient.supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: nickname || email.split("@")[0],
      },
    },
  });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  if (!data.session) {
    return NextResponse.json({ needsConfirmation: true });
  }

  const response = NextResponse.json({ user: data.user });
  clearLegacyUserSessionCookies(response);

  return response;
}
