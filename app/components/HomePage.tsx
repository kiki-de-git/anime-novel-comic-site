"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CoverArt } from "@/app/components/CoverArt";
import { SiteHeader } from "@/app/components/SiteHeader";
import { WorkGrid } from "@/app/components/WorkGrid";
import { getLatestWorks, getReadHref, works, type Work } from "@/app/lib/mock-data";

function Section({
  id,
  eyebrow,
  title,
  works: sectionWorks,
}: {
  id: string;
  eyebrow: string;
  title: string;
  works: Work[];
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="mb-4 flex items-end justify-between border-b border-white/10 pb-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-rose-500">
            {eyebrow}
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-normal text-white">
            {title}
          </h2>
        </div>
        <span className="text-sm font-bold text-slate-400">
          {sectionWorks.length} 部
        </span>
      </div>
      <WorkGrid works={sectionWorks} />
    </section>
  );
}

function UpdateList({ items }: { items: Work[] }) {
  return (
    <aside className="border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-3">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-rose-500">
          Latest Updates
        </p>
        <h2 className="mt-1 text-xl font-black text-slate-950">今日更新</h2>
      </div>
      <div className="divide-y divide-slate-100">
        {items.map((work, index) => (
          <Link
            key={work.slug}
            href={getReadHref(work)}
            className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 px-4 py-3 transition hover:bg-rose-50"
          >
            <span className="text-lg font-black text-slate-300">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-black text-slate-950">
                {work.title}
              </span>
              <span className="mt-0.5 block text-xs font-semibold text-slate-500">
                最新章节 · {work.status}
              </span>
            </span>
            <span className="rounded bg-slate-950 px-2 py-1 text-xs font-black text-white">
              READ
            </span>
          </Link>
        ))}
      </div>
    </aside>
  );
}

export function HomePage() {
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();
  const filteredWorks = useMemo(() => {
    if (!normalizedQuery) {
      return works;
    }

    return works.filter((work) =>
      work.title.toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery]);

  const popularNovels = filteredWorks.filter(
    (work) => work.section === "popular-novel",
  );
  const popularComics = filteredWorks.filter(
    (work) => work.section === "popular-comic",
  );
  const newWorks = filteredWorks.filter((work) => work.section === "new");
  const featuredWork = works.find((work) => work.type === "comic") ?? works[0];
  const latestWorks = getLatestWorks().slice(0, 6);

  return (
    <main className="min-h-screen overflow-hidden bg-[#07070a] text-slate-950">
      <SiteHeader searchValue={query} onSearchChange={setQuery} />

      <section className="border-b border-white/10 bg-[#07070a]">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8 lg:py-8">
          <div className="grid gap-4 border border-slate-200 bg-[#111827] p-4 text-white sm:grid-cols-[220px_1fr] lg:p-5">
            <div className="max-w-48 sm:max-w-none">
              <CoverArt work={featuredWork} />
            </div>
            <div className="flex flex-col justify-center">
              <p className="mb-3 w-fit bg-rose-500 px-3 py-1 text-xs font-black uppercase tracking-[0.18em]">
                Featured Series
              </p>
              <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-normal sm:text-5xl">
                每天打开一话，进入新的漫画宇宙
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                收录原创轻小说与漫画作品，快速查看更新、进入章节、开始阅读。
                这是 YumeVerse 的原创漫画平台风第一版。
              </p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <Link
                  href={`/works/${featuredWork.slug}`}
                  className="rounded bg-white px-5 py-3 text-center text-sm font-black text-slate-950 transition hover:bg-rose-100"
                >
                  查看主推作品
                </Link>
                <Link
                  href={getReadHref(featuredWork)}
                  className="rounded border border-white/25 px-5 py-3 text-center text-sm font-black text-white transition hover:bg-white/10"
                >
                  立即阅读
                </Link>
              </div>
            </div>
          </div>
          <UpdateList items={latestWorks} />
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
        <div id="popular" className="scroll-mt-28 space-y-10">
          <Section
            id="novels"
            eyebrow="Popular Novels"
            title="热门小说"
            works={popularNovels}
          />
          <Section
            id="comics"
            eyebrow="Popular Comics"
            title="热门漫画"
            works={popularComics}
          />
        </div>
        <Section id="new" eyebrow="New Releases" title="新作推荐" works={newWorks} />
      </div>
    </main>
  );
}
