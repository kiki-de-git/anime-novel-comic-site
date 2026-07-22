import { Suspense } from "react";
import { PageHeading } from "@/app/components/PageHeading";
import { SiteHeader } from "@/app/components/SiteHeader";
import { TitlesBrowser } from "@/app/components/TitlesBrowser";
import { getAllWorksForListing } from "@/app/lib/work-data";

export default async function TitlesPage() {
  const works = await getAllWorksForListing();

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <PageHeading
          eyebrow="Titles"
          title="全部作品"
          description="浏览 WAVE 当前收录的原创小说与漫画，可以按作品类型快速筛选。"
        />
        <Suspense
          fallback={
            <div className="rounded border border-white/10 bg-white/10 px-5 py-8 text-slate-300">
              Loading titles...
            </div>
          }
        >
          <TitlesBrowser works={works} />
        </Suspense>
      </div>
    </main>
  );
}
