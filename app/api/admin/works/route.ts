import { NextResponse } from "next/server";
import {
  deleteWork,
  getAllWorks,
  isSupabaseConfigured,
  saveWork,
  seedWorks,
} from "@/app/lib/work-data";
import { isAdminRequest } from "@/app/lib/admin-auth";
import type { Work } from "@/app/lib/mock-data";

function unauthorized() {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return unauthorized();
  }

  const works = await getAllWorks();

  return NextResponse.json({
    configured: isSupabaseConfigured(),
    works,
  });
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return unauthorized();
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { message: "Supabase is not configured." },
      { status: 503 },
    );
  }

  try {
    const work = (await request.json()) as Work;
    const savedWork = await saveWork(work);

    return NextResponse.json({ work: savedWork });
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Failed to save work.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!isAdminRequest(request)) {
    return unauthorized();
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { message: "Supabase is not configured." },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ message: "Missing slug." }, { status: 400 });
  }

  try {
    await deleteWork(slug);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to delete work.",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  if (!isAdminRequest(request)) {
    return unauthorized();
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { message: "Supabase is not configured." },
      { status: 503 },
    );
  }

  try {
    const works = await seedWorks();

    return NextResponse.json({ works });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to seed works.",
      },
      { status: 500 },
    );
  }
}
