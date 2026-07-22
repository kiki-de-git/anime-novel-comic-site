import Link from "next/link";
import { CoverArt } from "@/app/components/CoverArt";
import { PageHeading } from "@/app/components/PageHeading";
import { SiteHeader } from "@/app/components/SiteHeader";
import {
  formatPopularity,
  getRankingWorks,
  getReadHref,
} from "@/app/lib/mock-data";
import { getAllWorksForListing } from "@/app/lib/work-data";

export default async function RankingPage() {
  const works = await getAllWorksForListing();
  const rankingWorks = getRankingWorks(works);

  return (
    <main className="min-h-screen bg-transparent">
      <SiteHeader />
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <PageHeading
          eyebrow="Ranking"
          title="排行榜"
          description="根据 mock 数据中的 popularity 人气值排序，展示当前最受欢迎的作品。"
        />
        <div className="space-y-3">
          {rankingWorks.map((work, index) => (
            <div
              key={work.slug}
              className="grid gap-4 border border-white/10 bg-white/[0.04] p-4 sm:grid-cols-[4rem_92px_1fr_auto] sm:items-center"
            >
              <div className="text-4xl font-black text-rose-500">
                #{index + 1}
              </div>
              <Link href={`/works/${work.slug}`} className="w-24 sm:w-auto">
                <CoverArt work={work} compact />
              </Link>
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                  {work.type} · {work.category}
                </p>
                <Link href={`/works/${work.slug}`}>
                  <h2 className="mt-1 text-2xl font-black text-white hover:text-rose-300">
                    {work.title}
                  </h2>
                </Link>
                <p className="mt-1 text-sm font-bold text-slate-400">
                  Popularity {formatPopularity(work.popularity)}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={getReadHref(work)}
                  className="rounded bg-white px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-rose-100"
                >
                  Read
                </Link>
                <Link
                  href={`/works/${work.slug}`}
                  className="rounded border border-white/10 px-4 py-2 text-sm font-black text-white transition hover:bg-white/10"
                >
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
