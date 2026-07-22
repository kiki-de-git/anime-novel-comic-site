import {
  works as mockWorks,
  type Chapter,
  type CoverStyle,
  type Work,
  type WorkType,
} from "@/app/lib/mock-data";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/app/lib/supabase-server";

type WorkRow = {
  slug: string;
  title: string;
  author: string;
  type: WorkType;
  category: string;
  description: string;
  tags: string[];
  status: string;
  updated_at: string;
  popularity: number;
  cover_style: CoverStyle;
  section: Work["section"];
  chapters: Chapter[];
};

function rowToWork(row: WorkRow): Work {
  return {
    slug: row.slug,
    title: row.title,
    author: row.author,
    type: row.type,
    category: row.category,
    description: row.description,
    tags: row.tags,
    status: row.status,
    updatedAt: row.updated_at,
    popularity: row.popularity,
    coverStyle: row.cover_style,
    section: row.section,
    chapters: row.chapters,
  };
}

function workToRow(work: Work): WorkRow {
  return {
    slug: work.slug,
    title: work.title,
    author: work.author,
    type: work.type,
    category: work.category,
    description: work.description,
    tags: work.tags,
    status: work.status,
    updated_at: work.updatedAt,
    popularity: work.popularity,
    cover_style: work.coverStyle,
    section: work.section,
    chapters: work.chapters,
  };
}

function sortByUpdatedAt(sourceWorks: Work[]) {
  return [...sourceWorks].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export { isSupabaseConfigured };

export async function getAllWorks(): Promise<Work[]> {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return mockWorks;
  }

  const { data, error } = await supabase
    .from("wave_works")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Failed to load works from Supabase:", error.message);
    return mockWorks;
  }

  if (!data || data.length === 0) {
    return mockWorks;
  }

  return sortByUpdatedAt((data as WorkRow[]).map(rowToWork));
}

export async function getWorkBySlug(slug: string): Promise<Work | undefined> {
  const decodedSlug = decodeURIComponent(slug);
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return mockWorks.find(
      (work) => work.slug === decodedSlug || work.title === decodedSlug,
    );
  }

  const { data, error } = await supabase
    .from("wave_works")
    .select("*")
    .eq("slug", decodedSlug)
    .maybeSingle();

  if (error) {
    console.error("Failed to load work from Supabase:", error.message);
    return mockWorks.find(
      (work) => work.slug === decodedSlug || work.title === decodedSlug,
    );
  }

  if (data) {
    return rowToWork(data as WorkRow);
  }

  const { data: titleData, error: titleError } = await supabase
    .from("wave_works")
    .select("*")
    .eq("title", decodedSlug)
    .maybeSingle();

  if (titleError) {
    console.error("Failed to load work by title from Supabase:", titleError.message);
  }

  return titleData
    ? rowToWork(titleData as WorkRow)
    : mockWorks.find(
        (work) => work.slug === decodedSlug || work.title === decodedSlug,
      );
}

export async function saveWork(work: Work): Promise<Work> {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase
    .from("wave_works")
    .upsert(workToRow(work), { onConflict: "slug" })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return rowToWork(data as WorkRow);
}

export async function seedWorks(sourceWorks = mockWorks): Promise<Work[]> {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase
    .from("wave_works")
    .upsert(sourceWorks.map(workToRow), { onConflict: "slug" })
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return sortByUpdatedAt(((data ?? []) as WorkRow[]).map(rowToWork));
}

export async function deleteWork(slug: string): Promise<void> {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { error } = await supabase.from("wave_works").delete().eq("slug", slug);

  if (error) {
    throw new Error(error.message);
  }
}
