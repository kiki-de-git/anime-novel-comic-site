import Link from "next/link";
import { CoverArt } from "@/app/components/CoverArt";
import { getReadHref, type Work } from "@/app/lib/mock-data";

type WorkCardProps = {
  work: Work;
};

export function WorkCard({ work }: WorkCardProps) {
  return (
    <article className="group overflow-hidden rounded-lg border border-white/70 bg-white/85 shadow-sm shadow-pink-100/80 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-100">
      <Link href={`/works/${work.slug}`} className="block p-3">
        <CoverArt work={work} compact />
      </Link>
      <div className="space-y-3 px-4 pb-4">
        <div>
          <div className="mb-2 flex items-center justify-between gap-3 text-xs text-slate-500">
            <span>{work.type === "novel" ? "轻小说" : "漫画"}</span>
            <span className="rounded bg-pink-50 px-2 py-1 text-pink-600">
              {work.status}
            </span>
          </div>
          <Link href={`/works/${work.slug}`}>
            <h3 className="line-clamp-1 text-base font-bold text-slate-950 transition group-hover:text-fuchsia-600">
              {work.title}
            </h3>
          </Link>
          <p className="mt-1 text-sm text-slate-500">{work.author}</p>
        </div>
        <p className="line-clamp-2 min-h-10 text-sm leading-5 text-slate-600">
          {work.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {work.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded bg-violet-50 px-2 py-1 text-xs text-violet-600"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Link
            href={`/works/${work.slug}`}
            className="flex-1 rounded-lg border border-violet-100 px-3 py-2 text-center text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
          >
            详情
          </Link>
          <Link
            href={getReadHref(work)}
            className="flex-1 rounded-lg bg-slate-950 px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-fuchsia-600"
          >
            阅读
          </Link>
        </div>
      </div>
    </article>
  );
}
