import { PageHeading } from "@/app/components/PageHeading";
import { SiteHeader } from "@/app/components/SiteHeader";
import { WorkGrid } from "@/app/components/WorkGrid";
import { getNewWorks } from "@/app/lib/mock-data";

export default function NewPage() {
  const newWorks = getNewWorks();

  return (
    <main className="min-h-screen bg-[#07070a]">
      <SiteHeader />
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <PageHeading
          eyebrow="New"
          title="新作"
          description="按新连载与更新时间整理的原创作品，适合快速发现刚上线的系列。"
        />
        <WorkGrid works={newWorks} />
      </div>
    </main>
  );
}
