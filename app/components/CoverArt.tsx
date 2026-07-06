import type { Work } from "@/app/lib/mock-data";

type CoverArtProps = {
  work: Pick<Work, "title" | "coverStyle">;
  compact?: boolean;
};

export function CoverArt({ work, compact = false }: CoverArtProps) {
  return (
    <div
      className={`relative isolate overflow-hidden border border-slate-900/10 shadow-sm ${
        compact ? "aspect-[2/3]" : "aspect-[3/4]"
      }`}
      style={{
        background: `linear-gradient(135deg, ${work.coverStyle.from}, ${work.coverStyle.via} 48%, ${work.coverStyle.to})`,
      }}
      aria-label={`${work.title} cover`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(255,255,255,0.26)_0_22%,transparent_22%_100%)]" />
      <div className="absolute -left-8 top-8 h-28 w-28 rounded-full bg-white/25 blur-xl" />
      <div className="absolute bottom-4 right-3 h-24 w-24 rotate-12 border border-white/55 bg-white/20" />
      <div className="absolute inset-x-3 top-3 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-white/85">
        <span>YV</span>
        <span>{work.coverStyle.mark}</span>
      </div>
      <div className="absolute inset-x-4 bottom-5">
        <div className="mb-3 h-1 w-10 bg-white/80" />
        <p className="text-xl font-black leading-tight tracking-normal text-white drop-shadow-sm">
          {work.title}
        </p>
      </div>
    </div>
  );
}
