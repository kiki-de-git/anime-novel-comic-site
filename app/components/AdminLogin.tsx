"use client";

import { FormEvent, useState } from "react";

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        setMessage("密码不正确，请重新输入。");
        return;
      }

      window.location.reload();
    } catch {
      setMessage("登录失败，请稍后再试。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-md border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/30">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-rose-400">
        管理员登录
      </p>
      <h2 className="mt-2 text-2xl font-black text-white">进入后台管理</h2>
      <p className="mt-3 text-sm leading-6 text-slate-400">
        请输入管理员密码。只有登录后才能管理作品、导入小说和上传封面。
      </p>
      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="管理员密码"
          className="h-11 w-full rounded border border-white/10 bg-white px-3 text-sm font-semibold text-slate-950 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/30"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full rounded bg-rose-500 text-sm font-black text-white transition hover:bg-rose-400 disabled:opacity-60"
        >
          {isSubmitting ? "登录中..." : "登录"}
        </button>
      </form>
      {message ? (
        <p className="mt-3 rounded bg-rose-500/10 px-3 py-2 text-sm font-bold text-rose-100">
          {message}
        </p>
      ) : null}
    </section>
  );
}
