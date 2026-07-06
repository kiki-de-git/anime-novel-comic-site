import Link from "next/link";
import { CoverArt } from "@/app/components/CoverArt";
import { getReadHref, type Work } from "@/app/lib/mock-data";

type WorkCardProps = {
  work: Work;
};

export function WorkCard({ work }: WorkCardProps) {
  return (
    <article className="group overflow-hidden bg-[#141414] transition hover:-translate-y-0.5">
      <Link href={`/works/${work.slug}`} className="block">
        <CoverArt work={work} compact />
      </Link>
      <div className="space-y-2 px-0 pt-3">
        <div>
          <div className="mb-1 flex items-center justify-between gap-2 text-[11px] font-black uppercase text-slate-500">
            <span>{work.type === "novel" ? "Novel" : "Manga"}</span>
            <span className="bg-rose-500 px-1.5 py-1 text-white">
              {work.status}
            </span>
          </div>
          <Link href={`/works/${work.slug}`}>
            <h3 className="line-clamp-2 min-h-12 text-xl font-black leading-6 text-white transition group-hover:text-rose-300">
              {work.title}
            </h3>
          </Link>
          <p className="mt-1 truncate text-sm font-bold text-slate-400">
            {work.author}
          </p>
        </div>
        <p className="line-clamp-2 min-h-10 text-sm leading-5 text-slate-400">
          {work.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {work.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-white/10 px-1.5 py-1 text-[11px] font-bold text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Link
            href={`/works/${work.slug}`}
            className="flex-1 rounded border border-white/10 px-2 py-2 text-center text-xs font-black text-white transition hover:bg-white/10"
          >
            详情
          </Link>
          <Link
            href={getReadHref(work)}
            className="flex-1 rounded bg-slate-950 px-2 py-2 text-center text-xs font-black text-white transition hover:bg-rose-600"
          >
            阅读
          </Link>
        </div>
      </div>
    </article>
  );
}
