import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getChapter,
  getChapterNeighbors,
  getReadHref,
  getWork,
  works,
} from "@/app/lib/mock-data";

type ComicReaderProps = {
  params: Promise<{ slug: string; chapter: string }>;
};

export function generateStaticParams() {
  return works
    .filter((work) => work.type === "comic")
    .flatMap((work) =>
      work.chapters.map((chapter) => ({
        slug: work.slug,
        chapter: chapter.slug,
      })),
    );
}

export default async function ComicReaderPage({ params }: ComicReaderProps) {
  const { slug, chapter: chapterSlug } = await params;
  const work = getWork(slug);

  if (!work || work.type !== "comic") {
    notFound();
  }

  const chapter = getChapter(work, chapterSlug);

  if (!chapter || !chapter.imageCount) {
    notFound();
  }

  const { previous, next } = getChapterNeighbors(work, chapterSlug);
  const pages = Array.from({ length: chapter.imageCount }, (_, index) => index + 1);

  return (
    <main className="min-h-screen bg-[#07070a] px-3 py-4 text-white sm:px-6 lg:px-8">
      <article className="mx-auto max-w-4xl">
        <header className="mb-4 border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link href={`/works/${work.slug}`} className="text-sm font-black text-rose-300">
              返回详情
            </Link>
            <Link href="/" className="text-sm font-bold text-white/70 hover:text-white">
              首页
            </Link>
          </div>
          <p className="mt-4 text-xs font-black uppercase tracking-[0.22em] text-rose-300">
            {work.title}
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-normal text-white sm:text-3xl">
            {chapter.title}
          </h1>
        </header>

        <div className="space-y-3">
          {pages.map((page) => (
            <div
              key={page}
              className="relative mx-auto aspect-[3/4] max-w-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-rose-300 via-violet-400 to-sky-300 p-2 shadow-2xl shadow-black/60 sm:p-3"
            >
              <div className="grid h-full grid-rows-[1fr_0.8fr_1fr] gap-2 border border-white/45 bg-white p-2 text-slate-950 sm:gap-3 sm:p-3">
                <div className="grid grid-cols-[1.2fr_0.8fr] gap-2 sm:gap-3">
                  <div className="relative overflow-hidden rounded border-2 border-slate-900 bg-gradient-to-br from-pink-100 to-white">
                    <div className="absolute left-4 top-4 rounded-full border-2 border-slate-900 bg-white px-3 py-1 text-xs font-black">
                      今天也要冲！
                    </div>
                    <div className="absolute bottom-4 left-5 h-20 w-14 rounded-full border-4 border-slate-900 bg-violet-200 sm:h-28 sm:w-20" />
                    <div className="absolute bottom-4 left-10 h-12 w-20 rounded-t-full border-4 border-slate-900 bg-pink-200 sm:left-14 sm:h-16 sm:w-28" />
                    <div className="absolute right-5 top-10 h-px w-20 rotate-[-18deg] bg-slate-900" />
                    <div className="absolute right-5 top-16 h-px w-24 rotate-[-10deg] bg-slate-900" />
                    <div className="absolute right-8 top-22 h-px w-16 rotate-[8deg] bg-slate-900" />
                  </div>
                  <div className="relative overflow-hidden rounded border-2 border-slate-900 bg-sky-100">
                    <div className="absolute inset-x-3 top-5 rounded-full border-2 border-slate-900 bg-white px-2 py-1 text-center text-xs font-bold">
                      咦？
                    </div>
                    <div className="absolute bottom-4 left-1/2 h-20 w-16 -translate-x-1/2 rounded-t-full border-4 border-slate-900 bg-white" />
                    <div className="absolute bottom-14 left-1/2 h-12 w-12 -translate-x-1/2 rounded-full border-4 border-slate-900 bg-pink-200" />
                  </div>
                </div>
                <div className="relative overflow-hidden rounded border-2 border-slate-900 bg-gradient-to-r from-violet-100 via-white to-pink-100">
                    <div className="absolute left-5 top-4 text-4xl font-black italic text-rose-500 drop-shadow-sm sm:text-6xl">
                    SHINE!
                  </div>
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(105deg,transparent_0_12px,rgba(15,23,42,0.16)_13px_14px)]" />
                  <div className="absolute bottom-4 right-5 rounded border-2 border-slate-900 bg-white px-3 py-2 text-xs font-black">
                    星光展开
                  </div>
                </div>
                <div className="grid grid-cols-[0.85fr_1.15fr] gap-2 sm:gap-3">
                  <div className="relative overflow-hidden rounded border-2 border-slate-900 bg-pink-50">
                    <div className="absolute left-4 top-4 h-14 w-14 rounded-full border-4 border-slate-900 bg-violet-200 sm:h-20 sm:w-20" />
                    <div className="absolute bottom-4 left-5 right-5 h-12 rounded-t-full border-4 border-slate-900 bg-sky-200 sm:h-20" />
                    <div className="absolute right-3 top-4 rounded-full border-2 border-slate-900 bg-white px-2 py-1 text-xs font-bold">
                      等等我
                    </div>
                  </div>
                  <div className="relative overflow-hidden rounded border-2 border-slate-900 bg-slate-950 text-white">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_35%,rgba(244,114,182,0.65),transparent_24%),radial-gradient(circle_at_70%_65%,rgba(56,189,248,0.55),transparent_28%)]" />
                    <div className="absolute left-4 top-4 text-xs font-bold uppercase tracking-[0.24em] text-white/75">
                      Manga Page
                    </div>
                    <div className="absolute bottom-4 left-4 text-3xl font-black text-white sm:text-5xl">
                      P.{page}
                    </div>
                    <div className="absolute bottom-5 right-4 text-sm font-bold text-white/80">
                      {work.coverStyle.mark}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <nav className="mt-5 grid gap-3 sm:grid-cols-3">
          {previous ? (
            <Link
              href={getReadHref(work, previous.slug)}
              className="rounded border border-white/15 bg-white/10 px-4 py-3 text-center text-sm font-black text-white transition hover:bg-white/15"
            >
              上一章
            </Link>
          ) : (
            <span className="rounded border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-black text-white/30">
              上一章
            </span>
          )}
          <Link
            href={`/works/${work.slug}`}
            className="rounded bg-white px-4 py-3 text-center text-sm font-black text-slate-950 transition hover:bg-rose-100"
          >
            章节目录
          </Link>
          {next ? (
            <Link
              href={getReadHref(work, next.slug)}
              className="rounded border border-white/15 bg-white/10 px-4 py-3 text-center text-sm font-black text-white transition hover:bg-white/15"
            >
              下一章
            </Link>
          ) : (
            <span className="rounded border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-black text-white/30">
              下一章
            </span>
          )}
        </nav>
      </article>
    </main>
  );
}
