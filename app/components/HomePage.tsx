"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CoverArt } from "@/app/components/CoverArt";
import { SiteHeader } from "@/app/components/SiteHeader";
import { WorkGrid } from "@/app/components/WorkGrid";
import {
  formatPopularity,
  getLatestWorks,
  works as fallbackWorks,
  type Work,
} from "@/app/lib/mock-data";

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
      <WorkGrid works={sectionWorks} variant="platform" />
    </section>
  );
}
function UpdateStripCard({ work }: { work: Work }) {
  return (
    <Link href={`/works/${work.slug}`} className="group block min-w-0">
      <div className="relative overflow-hidden rounded-md">
        <CoverArt work={work} compact showTitleOverlay={false} />
        <span className="absolute left-0 top-0 rounded-br bg-rose-500 px-2 py-1 text-[11px] font-black text-white">
          最新24小时
        </span>
      </div>
      <h3 className="mt-2 line-clamp-2 min-h-12 text-lg font-black leading-6 text-white group-hover:text-rose-300">
        {work.title}
      </h3>
      <p className="text-sm font-bold text-slate-400">
        #{work.chapters.length.toString().padStart(3, "0")}{" "}
        {formatPopularity(work.popularity)}
      </p>
    </Link>
  );
}

function FeaturedBanner({ work }: { work: Work }) {
  const hasImage = Boolean(work.coverStyle.image);
  const visualStyle = hasImage
    ? { backgroundImage: `url("${work.coverStyle.image}")` }
    : {
        backgroundImage: `linear-gradient(135deg, ${work.coverStyle.from}, ${work.coverStyle.via} 46%, ${work.coverStyle.to})`,
      };

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-black/45 shadow-2xl shadow-black/45">
      <div className="grid min-h-[310px] md:grid-cols-[37%_63%] lg:min-h-[390px]">
        <Link
          href={`/works/${work.slug}`}
          className="relative z-10 flex flex-col justify-center bg-black/72 px-7 py-8 text-white md:px-9 lg:px-12"
        >
          <span className="mb-5 w-fit rounded-br-xl rounded-tl-xl bg-rose-500 px-4 py-2 text-sm font-black">
            人气最高
          </span>
          <h1 className="text-3xl font-black leading-tight sm:text-4xl">
            {work.title}
          </h1>
          <p className="mt-2 text-lg font-bold text-slate-200">{work.author}</p>
          <p className="mt-8 text-xl font-black">
            #{work.chapters.length.toString().padStart(3, "0")}{" "}
            <span className="text-slate-300">{formatPopularity(work.popularity)}</span>
          </p>
        </Link>

        <Link
          href={`/works/${work.slug}`}
          className="relative min-h-[280px] overflow-hidden bg-cover bg-center md:min-h-full"
          style={visualStyle}
          aria-label={`查看 ${work.title} 详情`}
        >
          {!hasImage ? (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_30%,rgba(255,255,255,0.45),transparent_22%),linear-gradient(90deg,rgba(0,0,0,0.28),transparent_45%)]" />
              <div className="absolute bottom-5 left-8 right-8 text-[3.2rem] font-black uppercase leading-none text-white/85 drop-shadow-2xl sm:text-[4.8rem] lg:text-[6rem]">
                {work.coverStyle.mark}
              </div>
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/10" />
          )}
          <span className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/25 text-lg font-black text-white backdrop-blur">
            ⌕
          </span>
        </Link>
      </div>
    </section>
  );
}

function getFeaturedWork(sourceWorks: Work[]) {
  const sortedNovels = sourceWorks
    .filter((work) => work.type === "novel")
    .sort((a, b) => b.popularity - a.popularity);
  const sortedWorks = [...sourceWorks].sort((a, b) => b.popularity - a.popularity);

  return sortedNovels[0] ?? sortedWorks[0];
}

export function HomePage({ initialWorks }: { initialWorks: Work[] }) {
  const [query, setQuery] = useState("");
  const allWorks = initialWorks.length > 0 ? initialWorks : fallbackWorks;
  const featuredWork = getFeaturedWork(allWorks);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredWorks = useMemo(() => {
    if (!normalizedQuery) {
      return allWorks;
    }

    return allWorks.filter((work) =>
      work.title.toLowerCase().includes(normalizedQuery),
    );
  }, [allWorks, normalizedQuery]);

  const listWorks =
    normalizedQuery || !featuredWork
      ? filteredWorks
      : filteredWorks.filter((work) => work.slug !== featuredWork.slug);
  const popularNovels = listWorks.filter(
    (work) => work.section === "popular-novel",
  );
  const popularComics = listWorks.filter(
    (work) => work.section === "popular-comic",
  );
  const newWorks = listWorks.filter((work) => work.section === "new");
  const latestWorks = getLatestWorks(allWorks);
  const latestStripWorks = featuredWork
    ? latestWorks.filter((work) => work.slug !== featuredWork.slug)
    : latestWorks;

  return (
    <main className="min-h-screen overflow-hidden bg-[#1f1f1f] text-slate-950">
      <SiteHeader searchValue={query} onSearchChange={setQuery} />

      <section className="relative overflow-hidden border-b border-white/10 bg-[#1f1f1f]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('/wave-hero-background.jpg')" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/45" aria-hidden="true" />

        <div className="relative mx-auto max-w-[1840px] px-4 py-7 sm:px-6 lg:px-10">
          {featuredWork ? <FeaturedBanner work={featuredWork} /> : null}

          <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {latestStripWorks.slice(0, 5).map((work) => (
              <UpdateStripCard key={work.slug} work={work} />
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1840px] space-y-10 px-4 py-8 sm:px-6 lg:px-10">
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
