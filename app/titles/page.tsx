import { PageHeading } from "@/app/components/PageHeading";
import { SiteHeader } from "@/app/components/SiteHeader";
import { TitlesBrowser } from "@/app/components/TitlesBrowser";
import { works } from "@/app/lib/mock-data";

export default function TitlesPage() {
  return (
    <main className="min-h-screen bg-[#07070a]">
      <SiteHeader />
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <PageHeading
          eyebrow="Titles"
          title="全部作品"
          description="浏览 YumeVerse 当前收录的原创小说与漫画，可按作品类型快速筛选。"
        />
        <TitlesBrowser works={works} />
      </div>
    </main>
  );
}
