import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/app/lib/supabase-server";
import { getUserFromRequest } from "@/app/lib/user-auth";

type CommentRow = {
  id: string;
  work_slug: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
};

function rowToComment(row: CommentRow) {
  return {
    id: row.id,
    userName: row.user_name,
    content: row.content,
    createdAt: row.created_at,
  };
}

export async function GET(request: Request) {
  const supabase = getSupabaseAdmin();
  const { searchParams } = new URL(request.url);
  const workSlug = searchParams.get("workSlug");

  if (!workSlug || !supabase) {
    return NextResponse.json({ comments: [] });
  }

  const { data, error } = await supabase
    .from("wave_comments")
    .select("*")
    .eq("work_slug", workSlug)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ comments: [], message: error.message });
  }

  return NextResponse.json({
    comments: ((data ?? []) as CommentRow[]).map(rowToComment),
  });
}

export async function POST(request: Request) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json(
      { message: "Supabase is not configured." },
      { status: 503 },
    );
  }

  const user = await getUserFromRequest();

  if (!user) {
    return NextResponse.json(
      { message: "请先登录后再发表评论。" },
      { status: 401 },
    );
  }

  const { workSlug, content } = (await request.json()) as {
    workSlug?: string;
    content?: string;
  };
  const cleanContent = content?.trim();

  if (!workSlug || !cleanContent) {
    return NextResponse.json(
      { message: "评论内容不能为空。" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("wave_comments")
    .insert({
      work_slug: workSlug,
      user_id: user.id,
      user_name: user.user_metadata?.display_name ?? user.email ?? "读者",
      content: cleanContent.slice(0, 1000),
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ comment: rowToComment(data as CommentRow) });
}
