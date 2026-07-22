"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const navItems = [
  { label: "更新", href: "/updates" },
  { label: "排名", href: "/ranking" },
  { label: "新作", href: "/new" },
  { label: "小说分类", href: "/novels" },
  { label: "漫画分类", href: "/comics" },
  { label: "全部作品", href: "/titles" },
  { label: "登录/注册", href: "/login" },
];

type SiteHeaderProps = {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
};

export function SiteHeader({ searchValue, onSearchChange }: SiteHeaderProps) {
  const router = useRouter();
  const [localSearch, setLocalSearch] = useState("");
  const value = onSearchChange ? (searchValue ?? "") : localSearch;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const keyword = value.trim();
    router.push(keyword ? `/titles?search=${encodeURIComponent(keyword)}` : "/titles");
  }

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#1f1f1f]">
      <nav className="mx-auto flex max-w-[1840px] flex-col gap-3 px-4 py-3 sm:px-6 lg:px-10 xl:flex-row xl:items-center">
        <div className="flex items-center justify-between gap-4 xl:flex-none">
          <Link
            href="/"
            className="inline-block transition-transform duration-300 ease-out hover:scale-105"
            aria-label="WAVE 首页"
          >
            <Image
              src="/wave-logo.png"
              alt="WAVE"
              width={180}
              height={120}
              priority
              className="h-12 w-auto object-contain sm:h-14"
            />
          </Link>
        </div>

        <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-0.5 xl:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              className="flex-none rounded border border-white/10 bg-white/10 px-3 py-2 text-sm font-black text-white hover:border-rose-400 hover:bg-rose-500"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden gap-6 xl:ml-6 xl:flex xl:flex-none">
          {navItems.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              className="text-base font-black text-white transition hover:text-rose-300 2xl:text-lg"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 md:w-80 xl:ml-auto">
          <label className="relative block min-w-0 flex-1">
            <span className="sr-only">搜索作品</span>
            <input
              value={value}
              onChange={(event) => {
                if (onSearchChange) {
                  onSearchChange(event.target.value);
                } else {
                  setLocalSearch(event.target.value);
                }
              }}
              placeholder="搜索作品"
              className="h-10 w-full rounded border border-white/10 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-500/30"
            />
          </label>
          <button
            type="submit"
            className="h-10 rounded bg-rose-500 px-4 text-sm font-black text-white transition hover:bg-rose-400"
          >
            搜索
          </button>
        </form>
      </nav>
    </header>
  );
}
