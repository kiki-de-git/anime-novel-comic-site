"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { WorkCard } from "@/app/components/WorkCard";
import { works, type Work } from "@/app/lib/mock-data";

const navItems = [
  { label: "小说", href: "#novels" },
  { label: "漫画", href: "#comics" },
  { label: "热门", href: "#popular" },
  { label: "新作", href: "#new" },
];

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
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-fuchsia-500">{eyebrow}</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950 sm:text-3xl">
            {title}
          </h2>
        </div>
        <div className="hidden h-px flex-1 bg-gradient-to-r from-pink-200 via-violet-200 to-transparent sm:block" />
      </div>
      {sectionWorks.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sectionWorks.map((work) => (
            <WorkCard key={work.slug} work={work} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-violet-200 bg-white/70 px-5 py-8 text-center text-slate-500">
          没有找到匹配的作品
        </div>
      )}
    </section>
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

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#ffe3f0,transparent_34%),radial-gradient(circle_at_top_right,#dbeafe,transparent_32%),linear-gradient(180deg,#fff7fb_0%,#f8fbff_48%,#ffffff_100%)] text-slate-900">
      <header className="sticky top-0 z-20 border-b border-white/80 bg-white/75 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8 xl:flex-row xl:items-center">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-pink-400 via-violet-400 to-sky-400 text-sm font-black text-white shadow-md shadow-pink-200">
                Y
              </span>
              <span className="text-xl font-black tracking-normal text-slate-950">
                YumeVerse
              </span>
            </Link>
          </div>
          <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-0.5 xl:hidden">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex-none rounded-lg bg-white/70 px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm shadow-pink-100/60 hover:bg-pink-50 hover:text-fuchsia-600"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center md:justify-end">
            <div className="hidden gap-1.5 xl:flex">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-pink-50 hover:text-fuchsia-600"
                >
                  {item.label}
                </a>
              ))}
            </div>
            <label className="relative block md:w-80">
              <span className="sr-only">搜索作品</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索作品标题"
                className="h-11 w-full rounded-lg border border-violet-100 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-fuchsia-300 focus:ring-4 focus:ring-pink-100"
              />
            </label>
          </div>
        </nav>
      </header>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-8 pt-7 sm:gap-8 sm:px-6 sm:pb-14 sm:pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-20 lg:pt-16">
        <div className="flex flex-col justify-center">
          <p className="mb-3 w-fit rounded bg-white/80 px-3 py-2 text-sm font-bold text-fuchsia-600 shadow-sm shadow-pink-100 sm:mb-4">
            原创轻小说 / 漫画展示站
          </p>
          <h1 className="max-w-3xl text-3xl font-black leading-tight tracking-normal text-slate-950 sm:text-6xl">
            在粉蓝色的故事宇宙里，翻开今天的新连载
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8">
            收集校园奇幻、都市怪谈、治愈冒险与热血漫画。第一版使用本地
            mock 数据，适合继续扩展登录、收藏、评论和后台管理。
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:mt-7 sm:flex-row">
            <a
              href="#popular"
              className="rounded-lg bg-slate-950 px-6 py-3 text-center text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-fuchsia-600"
            >
              浏览热门
            </a>
            <a
              href="#new"
              className="rounded-lg border border-violet-100 bg-white/80 px-6 py-3 text-center text-sm font-bold text-violet-700 shadow-sm shadow-pink-100 transition hover:-translate-y-0.5 hover:bg-violet-50"
            >
              查看新作
            </a>
          </div>
        </div>
        <div className="relative min-h-48 sm:min-h-72 lg:min-h-[460px]">
          <div className="absolute left-3 top-3 h-36 w-28 rotate-[-8deg] rounded-lg bg-gradient-to-br from-pink-300 via-fuchsia-300 to-violet-400 p-3 shadow-xl shadow-pink-200 sm:left-10 sm:top-8 sm:h-72 sm:w-52 sm:p-4">
            <div className="h-full rounded-lg border border-white/60 bg-white/20 p-3 sm:p-4">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/80">
                Novel
              </p>
              <p className="mt-12 text-base font-black leading-tight text-white sm:mt-24 sm:text-2xl">
                星灯图书馆
              </p>
            </div>
          </div>
          <div className="absolute right-3 top-0 h-40 w-32 rotate-[7deg] rounded-lg bg-gradient-to-br from-sky-300 via-violet-300 to-pink-300 p-3 shadow-xl shadow-sky-200 sm:right-14 sm:h-80 sm:w-56 sm:p-4">
            <div className="h-full rounded-lg border border-white/60 bg-white/20 p-3 sm:p-4">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/80">
                Comic
              </p>
              <p className="mt-14 text-base font-black leading-tight text-white sm:mt-28 sm:text-2xl">
                霓虹猫事务所
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 left-1/2 w-52 -translate-x-1/2 rounded-lg border border-white/80 bg-white/85 p-3 shadow-lg shadow-violet-100 sm:bottom-2 sm:w-60 sm:p-4">
            <p className="text-sm font-bold text-slate-950">今日更新</p>
            <p className="mt-1 text-sm text-slate-500">
              12 部作品待探索，搜索标题即可筛选卡片。
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-14 px-4 pb-20 sm:px-6 lg:px-8">
        <div id="popular" className="scroll-mt-28 space-y-14">
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
        <Section id="new" eyebrow="Fresh Releases" title="新作推荐" works={newWorks} />
      </div>
    </main>
  );
}
