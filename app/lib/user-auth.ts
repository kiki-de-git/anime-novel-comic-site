import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const userAccessCookieName = "wave_user_access_token";
export const userRefreshCookieName = "wave_user_refresh_token";

type UserAuthClientResult =
  | { supabase: SupabaseClient }
  | { response: NextResponse };

function getSupabaseAuthConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    return null;
  }

  return { supabaseUrl, anonKey };
}

export function isUserAuthConfigured() {
  return Boolean(getSupabaseAuthConfig());
}

export async function createUserServerClient() {
  const config = getSupabaseAuthConfig();

  if (!config) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(config.supabaseUrl, config.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });
}

export function clearLegacyUserSessionCookies(response: NextResponse) {
  response.cookies.delete(userAccessCookieName);
  response.cookies.delete(userRefreshCookieName);
}

export async function getCurrentUserFromCookies(): Promise<User | null> {
  const supabase = await createUserServerClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return data.user;
}

export async function getUserFromRequest(): Promise<User | null> {
  return getCurrentUserFromCookies();
}

export async function getAuthClientOrResponse(): Promise<UserAuthClientResult> {
  const supabase = await createUserServerClient();

  if (!supabase) {
    return {
      response: NextResponse.json(
        { message: "Supabase Auth is not configured." },
        { status: 503 },
      ),
    };
  }

  return { supabase };
}
