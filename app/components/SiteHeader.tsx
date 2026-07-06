"use client";

import Link from "next/link";

const navItems = [
  { label: "Updates", href: "/updates" },
  { label: "Titles", href: "/titles" },
  { label: "Ranking", href: "/ranking" },
  { label: "New", href: "/new" },
  { label: "Novels", href: "/novels" },
  { label: "Comics", href: "/comics" },
  { label: "Search", href: "/titles" },
];

type SiteHeaderProps = {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
};

export function SiteHeader({ searchValue, onSearchChange }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#07070a]/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8 xl:flex-row xl:items-center">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded bg-rose-500 text-sm font-black text-white shadow-sm">
              Y
            </span>
            <span>
              <span className="block text-lg font-black leading-none tracking-normal text-white">
                YumeVerse
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                Manga Works
              </span>
            </span>
          </Link>
        </div>
        <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-0.5 xl:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              className="flex-none rounded border border-white/10 bg-white/10 px-3 py-2 text-sm font-black text-white hover:border-rose-400 hover:bg-rose-500 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center md:justify-end">
          <div className="hidden gap-1 xl:flex">
            {navItems.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                className="rounded px-3 py-2 text-sm font-black text-white hover:bg-white/10 hover:text-rose-300"
              >
                {item.label}
              </Link>
            ))}
          </div>
          {onSearchChange ? (
            <label className="relative block md:w-80">
              <span className="sr-only">Search titles</span>
              <input
                value={searchValue ?? ""}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search titles"
                className="h-10 w-full rounded border border-white/10 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-500/30"
              />
            </label>
          ) : null}
        </div>
      </nav>
    </header>
  );
}
