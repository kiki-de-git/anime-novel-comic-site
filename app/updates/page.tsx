import { PageHeading } from "@/app/components/PageHeading";
import { SiteHeader } from "@/app/components/SiteHeader";
import { UpdateRows } from "@/app/components/UpdateRows";
import { getLatestWorks } from "@/app/lib/mock-data";
import { getAllWorks } from "@/app/lib/work-data";

export default async function UpdatesPage() {
  const works = await getAllWorks();
  const latestWorks = getLatestWorks(works);

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <PageHeading
          eyebrow="Updates"
          title="最新更新"
          description="按更新时间查看最近更新的作品章节，点击 Read 可以直接进入最新章节。"
        />
        <UpdateRows works={latestWorks} />
      </div>
    </main>
  );
}
