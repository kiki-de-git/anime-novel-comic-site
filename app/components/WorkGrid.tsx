import { WorkCard } from "@/app/components/WorkCard";
import type { Work } from "@/app/lib/mock-data";

type WorkGridProps = {
  works: Work[];
  emptyText?: string;
};

export function WorkGrid({
  works,
  emptyText = "没有找到相关作品，试试换个关键词吧。",
}: WorkGridProps) {
  if (works.length === 0) {
    return (
      <div className="rounded border border-dashed border-white/20 bg-white/10 px-5 py-10 text-center text-slate-300">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {works.map((work) => (
        <WorkCard key={work.slug} work={work} />
      ))}
    </div>
  );
}
