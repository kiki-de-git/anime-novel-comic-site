import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YumeVerse | 轻小说漫画展示站",
  description: "原创二次元风格轻小说与漫画展示站第一版",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
