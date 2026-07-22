import { PageHeading } from "@/app/components/PageHeading";
import { SiteHeader } from "@/app/components/SiteHeader";
import { WorkGrid } from "@/app/components/WorkGrid";
import { getAllWorksForListing } from "@/app/lib/work-data";

export default async function NovelsPage() {
  const works = await getAllWorksForListing();
  const novels = works.filter((work) => work.type === "novel");

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <PageHeading
          eyebrow="Novels"
          title="小说"
          description="只显示轻小说类作品，包含校园、奇幻、都市、科幻等原创系列。"
        />
        <WorkGrid works={novels} />
      </div>
    </main>
  );
}
