import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CoverArt } from "@/app/components/CoverArt";
import { getReadHref, getWork, works } from "@/app/lib/mock-data";

type WorkPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return works.map((work) => ({
    slug: work.slug,
  }));
}

export async function generateMetadata({
  params,
}: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const work = getWork(slug);

  if (!work) {
    return {
      title: "作品不存在 | YumeVerse",
    };
  }

  return {
    title: `${work.title} | YumeVerse`,
    description: work.description,
  };
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { slug } = await params;
  const work = getWork(slug);

  if (!work) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fff7fb_0%,#eef7ff_52%,#ffffff_100%)] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex items-center justify-between gap-4">
          <Link href="/" className="text-sm font-bold text-fuchsia-600">
            返回首页
          </Link>
          <span className="rounded bg-white/80 px-3 py-2 text-sm font-semibold text-slate-500 shadow-sm">
            {work.type === "novel" ? "轻小说" : "漫画"}
          </span>
        </header>

        <section className="grid gap-8 rounded-lg border border-white/80 bg-white/80 p-4 shadow-xl shadow-pink-100/60 backdrop-blur sm:p-6 lg:grid-cols-[320px_1fr]">
          <CoverArt work={work} />
          <div className="flex flex-col justify-center">
            <p className="text-sm font-bold text-fuchsia-500">{work.status}</p>
            <h1 className="mt-2 text-4xl font-black leading-tight tracking-normal text-slate-950 sm:text-5xl">
              {work.title}
            </h1>
            <p className="mt-3 text-base font-semibold text-slate-500">
              作者：{work.author}
            </p>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
              {work.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {work.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-600"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href={getReadHref(work)}
                className="rounded-lg bg-slate-950 px-6 py-3 text-center text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-fuchsia-600"
              >
                从第一章开始
              </Link>
              <Link
                href="/"
                className="rounded-lg border border-violet-100 bg-white px-6 py-3 text-center text-sm font-bold text-violet-700 transition hover:bg-violet-50"
              >
                继续探索
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-white/80 bg-white/80 p-4 shadow-sm shadow-violet-100 sm:p-6">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-fuchsia-500">Chapters</p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">章节列表</h2>
            </div>
            <span className="text-sm text-slate-500">{work.chapters.length} 章</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {work.chapters.map((chapter, index) => (
              <Link
                key={chapter.slug}
                href={getReadHref(work, chapter.slug)}
                className="rounded-lg border border-violet-100 bg-white px-4 py-4 shadow-sm transition hover:-translate-y-0.5 hover:border-fuchsia-200 hover:shadow-md hover:shadow-pink-100"
              >
                <span className="text-xs font-bold text-fuchsia-500">
                  Chapter {index + 1}
                </span>
                <p className="mt-1 font-bold text-slate-900">{chapter.title}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
