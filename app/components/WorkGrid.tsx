import { WorkCard } from "@/app/components/WorkCard";
import type { Work } from "@/app/lib/mock-data";

type WorkGridProps = {
  works: Work[];
  emptyText?: string;
  variant?: "default" | "platform";
};

export function WorkGrid({
  works,
  emptyText = "没有找到相关作品，试试换个关键词吧。",
  variant = "default",
}: WorkGridProps) {
  if (works.length === 0) {
    return (
      <div className="rounded border border-dashed border-white/20 bg-white/10 px-5 py-10 text-center text-slate-300">
        {emptyText}
      </div>
    );
  }

  return (
    <div
      className={
        variant === "platform"
          ? "grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-5"
          : "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
      }
    >
      {works.map((work) => (
        <WorkCard key={work.slug} work={work} variant={variant} />
      ))}
    </div>
  );
}
