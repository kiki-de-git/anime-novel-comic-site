"use client";

import { useMemo, useState } from "react";
import { WorkGrid } from "@/app/components/WorkGrid";
import type { Work, WorkType } from "@/app/lib/mock-data";

type Filter = "all" | WorkType;

type TitlesBrowserProps = {
  works: Work[];
};

const filters: Array<{ label: string; value: Filter }> = [
  { label: "All", value: "all" },
  { label: "Novels", value: "novel" },
  { label: "Comics", value: "comic" },
];

export function TitlesBrowser({ works }: TitlesBrowserProps) {
  const [filter, setFilter] = useState<Filter>("all");

  const filteredWorks = useMemo(() => {
    if (filter === "all") {
      return works;
    }

    return works.filter((work) => work.type === filter);
  }, [filter, works]);

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
      <WorkGrid works={filteredWorks} />
    </div>
  );
}
