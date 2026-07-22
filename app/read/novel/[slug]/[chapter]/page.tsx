import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getChapter,
  getChapterNeighbors,
  getReadHref,
} from "@/app/lib/mock-data";
import { getAllWorks, getWorkBySlug } from "@/app/lib/work-data";

type NovelReaderProps = {
  params: Promise<{ slug: string; chapter: string }>;
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const works = await getAllWorks();

  return works
    .filter((work) => work.type === "novel")
    .flatMap((work) =>
      work.chapters.map((chapter) => ({
        slug: work.slug,
        chapter: chapter.slug,
      })),
    );
}

export default async function NovelReaderPage({ params }: NovelReaderProps) {
  const { slug, chapter: chapterSlug } = await params;
  const work = await getWorkBySlug(slug);

  if (!work || work.type !== "novel") {
    notFound();
  }

  const chapter = getChapter(work, chapterSlug);

  if (!chapter || !chapter.content) {
    notFound();
  }

  const { previous, next } = getChapterNeighbors(work, chapterSlug);

  return (
    <main className="min-h-screen bg-[#07070a] px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link href={`/works/${work.slug}`} className="text-sm font-black text-rose-600">
            返回详情
          </Link>
          <Link href="/" className="text-sm font-bold text-slate-300 hover:text-rose-300">
            首页
          </Link>
        </header>

        <section className="border border-slate-200 bg-white px-5 py-8 shadow-sm sm:px-8 sm:py-10">
          <p className="text-center text-xs font-black uppercase tracking-[0.22em] text-rose-500">
            {work.title}
          </p>
          <h1 className="mt-3 text-center text-3xl font-black leading-tight tracking-normal text-slate-950 sm:text-4xl">
            {chapter.title}
          </h1>
          <div className="mt-8 space-y-6 text-lg leading-9 text-slate-700">
            {chapter.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <nav className="mt-6 grid gap-3 sm:grid-cols-3">
          {previous ? (
            <Link
              href={getReadHref(work, previous.slug)}
              className="rounded border border-slate-200 bg-white px-4 py-3 text-center text-sm font-black text-slate-700 transition hover:bg-slate-50"
            >
              上一章
            </Link>
          ) : (
            <span className="rounded border border-slate-100 bg-white/70 px-4 py-3 text-center text-sm font-black text-slate-300">
              上一章
            </span>
          )}
          <Link
            href={`/works/${work.slug}`}
            className="rounded bg-slate-950 px-4 py-3 text-center text-sm font-black text-white transition hover:bg-rose-600"
          >
            章节目录
          </Link>
          {next ? (
            <Link
              href={getReadHref(work, next.slug)}
              className="rounded border border-slate-200 bg-white px-4 py-3 text-center text-sm font-black text-slate-700 transition hover:bg-slate-50"
            >
              下一章
            </Link>
          ) : (
            <span className="rounded border border-slate-100 bg-white/70 px-4 py-3 text-center text-sm font-black text-slate-300">
              下一章
            </span>
          )}
        </nav>
      </article>
    </main>
  );
}
