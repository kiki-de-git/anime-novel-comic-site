import { PageHeading } from "@/app/components/PageHeading";
import { SiteHeader } from "@/app/components/SiteHeader";
import { WorkGrid } from "@/app/components/WorkGrid";
import { works } from "@/app/lib/mock-data";

export default function ComicsPage() {
  const comics = works.filter((work) => work.type === "comic");

  return (
    <main className="min-h-screen bg-[#07070a]">
      <SiteHeader />
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <PageHeading
          eyebrow="Comics"
          title="漫画"
          description="只显示漫画类作品，保持纵向阅读和原创 CSS 分镜占位体验。"
        />
        <WorkGrid works={comics} />
      </div>
    </main>
  );
}
