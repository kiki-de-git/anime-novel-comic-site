import { AdminDashboard } from "@/app/components/AdminDashboard";
import { AdminLogin } from "@/app/components/AdminLogin";
import { PageHeading } from "@/app/components/PageHeading";
import { SiteHeader } from "@/app/components/SiteHeader";
import { isAdminAuthenticated } from "@/app/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const isAuthenticated = await isAdminAuthenticated();

  return (
    <main className="min-h-screen bg-[#07070a]">
      <SiteHeader />
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <PageHeading
          eyebrow="Admin"
          title="后台管理"
          description="管理作品信息、章节内容、TXT 小说导入和封面图片。"
        />
        {isAuthenticated ? <AdminDashboard /> : <AdminLogin />}
      </div>
    </main>
  );
}
