"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { WorkGrid } from "@/app/components/WorkGrid";
import type { Work, WorkType } from "@/app/lib/mock-data";

type Filter = "all" | WorkType;

type TitlesBrowserProps = {
  works: Work[];
};

const filters: Array<{ label: string; value: Filter }> = [
  { label: "全部", value: "all" },
  { label: "小说", value: "novel" },
  { label: "漫画", value: "comic" },
];

export function TitlesBrowser({ works }: TitlesBrowserProps) {
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState<Filter>("all");
  const keyword = (searchParams.get("search") ?? "").trim().toLowerCase();

  const filteredWorks = useMemo(() => {
    const typedWorks =
      filter === "all" ? works : works.filter((work) => work.type === filter);

    if (!keyword) {
      return typedWorks;
    }

    return typedWorks.filter(
      (work) =>
        work.title.toLowerCase().includes(keyword) ||
        work.author.toLowerCase().includes(keyword) ||
        work.tags.some((tag) => tag.toLowerCase().includes(keyword)),
    );
  }, [filter, keyword, works]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setFilter(item.value)}
            className={`rounded px-4 py-2 text-sm font-black transition ${
              filter === item.value
                ? "bg-rose-500 text-white"
                : "border border-white/10 bg-white/10 text-white hover:bg-white/15"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      {keyword ? (
        <p className="text-sm font-bold text-slate-400">
          搜索结果：<span className="text-white">{searchParams.get("search")}</span>
        </p>
      ) : null}
      <WorkGrid works={filteredWorks} />
    </div>
  );
}
