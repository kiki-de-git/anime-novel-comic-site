import { AuthForm } from "@/app/components/AuthForm";
import { SiteHeader } from "@/app/components/SiteHeader";

export default function LoginPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <AuthForm />
      </div>
    </main>
  );
}
