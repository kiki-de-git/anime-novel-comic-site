import type { Work } from "@/app/lib/mock-data";

type CoverArtProps = {
  work: Pick<Work, "title" | "coverFrom" | "coverVia" | "coverTo" | "coverMark">;
  compact?: boolean;
};

export function CoverArt({ work, compact = false }: CoverArtProps) {
  return (
    <div
      className={`relative isolate overflow-hidden rounded-lg shadow-sm ${
        compact ? "aspect-[4/5]" : "aspect-[3/4]"
      }`}
      style={{
        background: `linear-gradient(135deg, ${work.coverFrom}, ${work.coverVia} 48%, ${work.coverTo})`,
      }}
      aria-label={`${work.title} cover`}
    >
      <div className="absolute -left-8 top-8 h-28 w-28 rounded-full bg-white/30 blur-xl" />
      <div className="absolute bottom-4 right-3 h-24 w-24 rotate-12 rounded-lg border border-white/50 bg-white/20" />
      <div className="absolute inset-x-3 top-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.24em] text-white/80">
        <span>Yume</span>
        <span>{work.coverMark}</span>
      </div>
      <div className="absolute inset-x-4 bottom-5">
        <div className="mb-3 h-1 w-12 rounded-full bg-white/70" />
        <p className="text-xl font-black leading-tight text-white drop-shadow-sm">
          {work.title}
        </p>
      </div>
    </div>
  );
}
