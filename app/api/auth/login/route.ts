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

  const { email, password } = (await request.json()) as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return NextResponse.json({ message: "请填写邮箱和密码。" }, { status: 400 });
  }

  const { data, error } = await authClient.supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    return NextResponse.json(
      { message: error?.message ?? "登录失败。" },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ user: data.user });
  clearLegacyUserSessionCookies(response);

  return response;
}
