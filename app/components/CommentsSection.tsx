"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type Comment = {
  id: string;
  userName: string;
  content: string;
  createdAt: string;
};

type CurrentUser = {
  id: string;
  email?: string;
  name?: string;
};

export function CommentsSection({ workSlug }: { workSlug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadComments() {
      try {
        const [commentsResponse, meResponse] = await Promise.all([
          fetch(`/api/comments?workSlug=${encodeURIComponent(workSlug)}`),
          fetch("/api/auth/me"),
        ]);
        const commentsResult = (await commentsResponse.json()) as {
          comments?: Comment[];
        };
        const meResult = (await meResponse.json()) as {
          user?: CurrentUser | null;
        };

        if (!isMounted) {
          return;
        }

        setComments(commentsResult.comments ?? []);
        setCurrentUser(meResult.user ?? null);
      } catch {
        if (isMounted) {
          setMessage("评论加载失败。");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadComments();

    return () => {
      isMounted = false;
    };
  }, [workSlug]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!content.trim()) {
      setMessage("请先填写评论内容。");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workSlug, content }),
      });
      const result = (await response.json()) as {
        comment?: Comment;
        message?: string;
      };

      if (!response.ok || !result.comment) {
        setMessage(result.message ?? "评论发布失败。");
        return;
      }

      setComments((current) => [result.comment as Comment, ...current]);
      setContent("");
      setMessage("评论已发布。");
    } catch {
      setMessage("评论发布失败，请稍后再试。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mt-6 border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-rose-500">
            Comments
          </p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">读者评论</h2>
        </div>
        <span className="text-sm font-bold text-slate-500">
          {comments.length} 条
        </span>
      </div>

      {currentUser ? (
        <form onSubmit={handleSubmit} className="mb-5 space-y-3">
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={4}
            placeholder="写下你的想法..."
            className="w-full rounded border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-950 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-rose-600 disabled:opacity-60"
          >
            {isSubmitting ? "发布中..." : "发布评论"}
          </button>
        </form>
      ) : (
        <div className="mb-5 rounded border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm font-bold text-slate-600">
          登录后可以发表评论。
          <Link href="/login" className="ml-2 text-rose-600 hover:text-rose-500">
            去登录/注册
          </Link>
        </div>
      )}

      {message ? (
        <p className="mb-4 rounded bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700">
          {message}
        </p>
      ) : null}

      {isLoading ? (
        <p className="text-sm font-bold text-slate-400">评论加载中...</p>
      ) : comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => (
            <article
              key={comment.id}
              className="rounded border border-slate-200 bg-white px-4 py-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-black text-slate-950">{comment.userName}</p>
                <time className="text-xs font-bold text-slate-400">
                  {new Date(comment.createdAt).toLocaleString("zh-CN")}
                </time>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                {comment.content}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <p className="rounded border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm font-bold text-slate-400">
          还没有评论，来坐第一排吧。
        </p>
      )}
    </section>
  );
}
