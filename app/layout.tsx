import type { Metadata } from "next";
import { DesktopPet } from "@/app/components/DesktopPet";
import "./globals.css";

export const metadata: Metadata = {
  title: "WAVE | 轻小说漫画展示站",
  description: "原创二次元风格轻小说与漫画展示站第一版。",
  icons: {
    icon: "/pet/oc.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        {children}
        <DesktopPet />
      </body>
    </html>
  );
}
