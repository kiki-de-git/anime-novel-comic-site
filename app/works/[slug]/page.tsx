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
    <main className="min-h-screen bg-[#07070a] px-4 py-5 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex items-center justify-between gap-4">
          <Link href="/" className="text-sm font-black text-rose-600">
            返回首页
          </Link>
          <span className="border border-white/10 bg-white/10 px-3 py-2 text-sm font-black text-white">
            {work.type === "novel" ? "轻小说" : "漫画"}
          </span>
        </header>

        <section className="grid gap-6 border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:grid-cols-[300px_1fr]">
          <CoverArt work={work} />
          <div className="flex flex-col justify-center">
            <p className="w-fit bg-rose-500 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-white">
              {work.status}
            </p>
            <h1 className="mt-3 text-4xl font-black leading-tight tracking-normal text-slate-950 sm:text-5xl">
              {work.title}
            </h1>
            <p className="mt-3 text-base font-bold text-slate-500">
              作者：{work.author}
            </p>
            <div className="mt-4 grid grid-cols-3 border-y border-slate-200 py-3 text-center sm:max-w-md">
              <div>
                <p className="text-lg font-black text-slate-950">
                  {work.chapters.length}
                </p>
                <p className="text-xs font-bold text-slate-400">章节</p>
              </div>
              <div className="border-x border-slate-200">
                <p className="text-lg font-black text-slate-950">
                  {work.type === "novel" ? "文字" : "纵漫"}
                </p>
                <p className="text-xs font-bold text-slate-400">类型</p>
              </div>
              <div>
                <p className="text-lg font-black text-slate-950">今日</p>
                <p className="text-xs font-bold text-slate-400">更新</p>
              </div>
            </div>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
              {work.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {work.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-slate-100 px-3 py-2 text-sm font-black text-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href={getReadHref(work)}
                className="rounded bg-slate-950 px-6 py-3 text-center text-sm font-black text-white transition hover:bg-rose-600"
              >
                从第一章开始
              </Link>
              <Link
                href="/"
                className="rounded border border-slate-200 bg-white px-6 py-3 text-center text-sm font-black text-slate-700 transition hover:bg-slate-50"
              >
                继续探索
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-6 border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-rose-500">
                Chapters
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">章节列表</h2>
            </div>
            <span className="text-sm font-bold text-slate-500">
              {work.chapters.length} 章
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {work.chapters.map((chapter, index) => (
              <Link
                key={chapter.slug}
                href={getReadHref(work, chapter.slug)}
                className="border border-slate-200 bg-white px-4 py-4 transition hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-50"
              >
                <span className="text-xs font-black uppercase tracking-[0.18em] text-rose-500">
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
