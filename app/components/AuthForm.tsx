"use client";

import { FormEvent, useState } from "react";
import { createUserBrowserClient } from "@/app/lib/supabase-browser";

type AuthMode = "login" | "register";

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const supabase = createUserBrowserClient();

    if (!supabase) {
      setMessage("Supabase 登录配置还没有填写完整。");
      setIsSubmitting(false);
      return;
    }

    try {
      const result =
        mode === "login"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  display_name: nickname || email.split("@")[0],
                },
              },
            });

      if (result.error) {
        setMessage(result.error.message);
        return;
      }

      if (mode === "register" && !result.data.session) {
        setMessage("注册成功，请先去邮箱完成验证，然后再登录。");
        setMode("login");
        return;
      }

      window.location.assign("/");
    } catch {
      setMessage("网络异常，请稍后再试。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-md border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/30">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-rose-400">
        用户账号
      </p>
      <h1 className="mt-2 text-3xl font-black text-white">
        {mode === "login" ? "登录 WAVE" : "注册 WAVE"}
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-400">
        登录后可以发表评论。后续还可以继续扩展收藏、书架和阅读记录。
      </p>

      <div className="mt-5 grid grid-cols-2 gap-2 rounded bg-white/10 p-1">
        {(["login", "register"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setMode(item);
              setMessage("");
            }}
            className={`h-10 rounded text-sm font-black transition ${
              mode === item
                ? "bg-white text-slate-950"
                : "text-slate-300 hover:text-white"
            }`}
          >
            {item === "login" ? "登录" : "注册"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        {mode === "register" ? (
          <input
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            placeholder="昵称"
            className="h-11 w-full rounded border border-white/10 bg-white px-3 text-sm font-semibold text-slate-950 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/30"
          />
        ) : null}
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="邮箱"
          className="h-11 w-full rounded border border-white/10 bg-white px-3 text-sm font-semibold text-slate-950 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/30"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="密码，至少 6 位"
          minLength={6}
          className="h-11 w-full rounded border border-white/10 bg-white px-3 text-sm font-semibold text-slate-950 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/30"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full rounded bg-rose-500 text-sm font-black text-white transition hover:bg-rose-400 disabled:opacity-60"
        >
          {isSubmitting ? "处理中..." : mode === "login" ? "登录" : "注册"}
        </button>
      </form>

      {message ? (
        <p className="mt-3 rounded bg-white/10 px-3 py-2 text-sm font-bold text-slate-100">
          {message}
        </p>
      ) : null}
    </section>
  );
}
