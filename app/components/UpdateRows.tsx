import Link from "next/link";
import { CoverArt } from "@/app/components/CoverArt";
import {
  getLatestChapter,
  getReadHref,
  type Work,
} from "@/app/lib/mock-data";

type UpdateRowsProps = {
  works: Work[];
};

export function UpdateRows({ works }: UpdateRowsProps) {
  return (
    <div className="divide-y divide-white/10 border border-white/10 bg-white/[0.04]">
      {works.map((work) => {
        const chapter = getLatestChapter(work);

        return (
          <div
            key={work.slug}
            className="grid gap-4 p-4 sm:grid-cols-[88px_1fr_auto] sm:items-center"
          >
            <Link href={`/works/${work.slug}`} className="w-24 sm:w-auto">
              <CoverArt work={work} compact />
            </Link>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-rose-400">
                {work.type} · {work.category}
              </p>
              <Link href={`/works/${work.slug}`}>
                <h2 className="mt-1 text-xl font-black text-white hover:text-rose-300">
                  {work.title}
                </h2>
              </Link>
              <p className="mt-1 font-bold text-slate-300">{chapter?.title}</p>
              <p className="mt-1 text-sm text-slate-500">Updated {work.updatedAt}</p>
            </div>
            <Link
              href={getReadHref(work, chapter?.slug)}
              className="rounded bg-white px-5 py-3 text-center text-sm font-black text-slate-950 transition hover:bg-rose-100"
            >
              Read
            </Link>
          </div>
        );
      })}
    </div>
  );
}
