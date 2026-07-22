"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import JSZip from "jszip";
import { CoverArt } from "@/app/components/CoverArt";
import type { Chapter, Work, WorkType } from "@/app/lib/mock-data";
import { works as seedWorks } from "@/app/lib/mock-data";

type EditableWork = Work;
type DataSource = "loading" | "supabase" | "local";
type TypeFilter = "all" | WorkType;

type ImportedNovel = {
  title: string;
  slug: string;
  author?: string;
  chapters: Chapter[];
  chapterText: string;
  novelBodyText: string;
};

type EpubManifestItem = {
  href: string;
  mediaType: string;
};

type WorksResponse = {
  configured: boolean;
  works: EditableWork[];
};

const storageKey = "wave-admin-works-v1";

const emptyWork: EditableWork = {
  slug: "new-wave-title",
  title: "新的 WAVE 作品",
  author: "WAVE 工作室",
  type: "comic",
  category: "原创企划",
  description: "这里填写作品简介，会显示在首页卡片和作品详情页。",
  tags: ["新作", "原创"],
  status: "草稿",
  updatedAt: new Date().toISOString().slice(0, 10),
  popularity: 1000,
  coverStyle: {
    from: "#ef4444",
    via: "#111827",
    to: "#38bdf8",
    mark: "WAVE",
  },
  section: "new",
  chapters: [
    {
      slug: "c1",
      title: "第 01 话：新的浪潮",
      imageCount: 5,
    },
  ],
};

function cloneWork(work: EditableWork): EditableWork {
  return JSON.parse(JSON.stringify(work)) as EditableWork;
}

function readLocalWorks() {
  if (typeof window === "undefined") {
    return seedWorks.map(cloneWork);
  }

  const stored = window.localStorage.getItem(storageKey);

  if (!stored) {
    return seedWorks.map(cloneWork);
  }

  try {
    const parsed = JSON.parse(stored) as EditableWork[];

    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : seedWorks.map(cloneWork);
  } catch {
    window.localStorage.removeItem(storageKey);
    return seedWorks.map(cloneWork);
  }
}

function chapterLines(chapters: Chapter[]) {
  return chapters.map((chapter) => `${chapter.slug}|${chapter.title}`).join("\n");
}

function novelBodyLines(chapters: Chapter[]) {
  return chapters
    .filter((chapter) => chapter.content?.length)
    .map((chapter) => `# ${chapter.slug}\n${(chapter.content ?? []).join("\n\n")}`)
    .join("\n\n---\n\n");
}

function parseNovelBodyLines(value: string) {
  return value
    .split(/\n\s*---\s*\n/g)
    .map((block) => block.trim())
    .filter(Boolean)
    .reduce<Record<string, string[]>>((bodyMap, block) => {
      const lines = block.split(/\r?\n/);
      const firstLine = lines.shift()?.trim() ?? "";
      const slug = firstLine.startsWith("#") ? firstLine.slice(1).trim() : "";
      const content = lines
        .join("\n")
        .split(/\n\s*\n/g)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);

      if (slug && content.length > 0) {
        bodyMap[slug] = content;
      }

      return bodyMap;
    }, {});
}

function parseChapterLines(
  value: string,
  type: WorkType,
  novelBodyText: string,
): Chapter[] {
  const bodyMap = parseNovelBodyLines(novelBodyText);
  const chapters = value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [rawSlug, rawTitle] = line.split("|");
      const slug = rawSlug?.trim() || `c${index + 1}`;
      const title = rawTitle?.trim() || `第 ${index + 1} 章`;

      if (type === "novel") {
        return {
          slug,
          title,
          content: bodyMap[slug] ?? ["这一章还没有填写正文。"],
        };
      }

      return {
        slug,
        title,
        imageCount: 5,
      };
    });

  return chapters.length > 0 ? chapters : cloneWork(emptyWork).chapters;
}

function normalizeDraft(
  draft: EditableWork,
  chapterText: string,
  novelBodyText: string,
): EditableWork {
  const cleanSlug = draft.slug.trim();

  return {
    ...draft,
    slug: cleanSlug || "untitled-work",
    title: draft.title.trim() || "未命名作品",
    author: draft.author.trim() || "未知作者",
    category: draft.category.trim() || (draft.type === "novel" ? "小说" : "漫画"),
    tags: draft.tags.map((tag) => tag.trim()).filter(Boolean),
    popularity: Number(draft.popularity) || 0,
    chapters: parseChapterLines(chapterText, draft.type, novelBodyText),
  };
}

function createSlugFromFileName(fileName: string) {
  const baseName = fileName.replace(/\.[^.]+$/, "");
  const slug = baseName
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || `novel-${Date.now().toString().slice(-6)}`;
}

function splitParagraphs(value: string) {
  return value
    .replace(/\r\n/g, "\n")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

async function readTxtFile(file: File) {
  const buffer = await file.arrayBuffer();

  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  } catch {
    try {
      return new TextDecoder("gb18030").decode(buffer);
    } catch {
      return file.text();
    }
  }
}

function parseImportedNovel(fileName: string, rawText: string): ImportedNovel {
  const title = fileName.replace(/\.[^.]+$/, "").trim() || "未命名小说";
  const text = rawText.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").trim();
  const headingPattern =
    /^\s*(第[0-9零一二三四五六七八九十百千万]+[章节回话卷][^\n]{0,60}|Chapter\s+[0-9]+[^\n]{0,60}|序章|楔子|引子|番外[^\n]{0,60})\s*$/gim;
  const headings = Array.from(text.matchAll(headingPattern));
  const chapters =
    headings.length > 0
      ? headings.map((match, index) => {
          const start = (match.index ?? 0) + match[0].length;
          const end =
            index < headings.length - 1
              ? (headings[index + 1].index ?? text.length)
              : text.length;
          const content = splitParagraphs(text.slice(start, end));

          return {
            slug: `c${index + 1}`,
            title: match[1].trim(),
            content: content.length > 0 ? content : ["这一章还没有正文。"],
          };
        })
      : [
          {
            slug: "c1",
            title: "正文",
            content: splitParagraphs(text),
          },
        ];

  return {
    title,
    slug: createSlugFromFileName(fileName),
    chapters,
    chapterText: chapterLines(chapters),
    novelBodyText: novelBodyLines(chapters),
  };
}

function getDirName(path: string) {
  const index = path.lastIndexOf("/");
  return index >= 0 ? path.slice(0, index + 1) : "";
}

function normalizeZipPath(path: string) {
  const parts: string[] = [];

  for (const part of path.split("/")) {
    if (!part || part === ".") {
      continue;
    }

    if (part === "..") {
      parts.pop();
      continue;
    }

    parts.push(part);
  }

  return parts.join("/");
}

function safeDecodePath(path: string) {
  try {
    return decodeURIComponent(path);
  } catch {
    return path;
  }
}

function resolveEpubPath(baseDir: string, href: string) {
  return normalizeZipPath(`${baseDir}${safeDecodePath(href).split("#")[0]}`);
}

function getZipFile(zip: JSZip, path: string) {
  return zip.file(path) ?? zip.file(safeDecodePath(path));
}

async function readZipText(zip: JSZip, path: string) {
  const file = getZipFile(zip, path);

  if (!file) {
    throw new Error(`Missing EPUB file: ${path}`);
  }

  return file.async("string");
}

function getXmlText(xml: Document, localName: string) {
  return (
    Array.from(xml.getElementsByTagName("*"))
      .find((node) => node.localName.toLowerCase() === localName)
      ?.textContent?.trim() ?? ""
  );
}

function htmlToChapter(html: string, fallbackTitle: string) {
  const document = new DOMParser().parseFromString(html, "text/html");
  document
    .querySelectorAll("script, style, nav, header, footer")
    .forEach((node) => node.remove());

  const title =
    document.querySelector("h1, h2, h3, title")?.textContent?.trim() ||
    fallbackTitle;
  const content = splitParagraphs(document.body?.textContent ?? "");

  return {
    title,
    content,
  };
}

async function parseEpubFile(file: File): Promise<ImportedNovel> {
  const zip = await JSZip.loadAsync(file);
  const containerXml = await readZipText(zip, "META-INF/container.xml");
  const container = new DOMParser().parseFromString(
    containerXml,
    "application/xml",
  );
  const rootFilePath =
    Array.from(container.getElementsByTagName("rootfile"))[0]?.getAttribute(
      "full-path",
    ) ?? "";

  if (!rootFilePath) {
    throw new Error("EPUB rootfile not found");
  }

  const opfText = await readZipText(zip, rootFilePath);
  const opf = new DOMParser().parseFromString(opfText, "application/xml");
  const baseDir = getDirName(rootFilePath);
  const title = getXmlText(opf, "title") || file.name.replace(/\.[^.]+$/, "");
  const author = getXmlText(opf, "creator");
  const manifest = new Map<string, EpubManifestItem>();

  Array.from(opf.getElementsByTagName("item")).forEach((item) => {
    const id = item.getAttribute("id");
    const href = item.getAttribute("href");
    const mediaType = item.getAttribute("media-type") ?? "";

    if (id && href) {
      manifest.set(id, { href, mediaType });
    }
  });

  const spineIds = Array.from(opf.getElementsByTagName("itemref"))
    .map((item) => item.getAttribute("idref"))
    .filter((idref): idref is string => Boolean(idref));

  const chapters: Chapter[] = [];

  for (const idref of spineIds) {
    const item = manifest.get(idref);

    if (
      !item ||
      (!item.mediaType.includes("html") && !item.href.match(/\.x?html?$/i))
    ) {
      continue;
    }

    const htmlPath = resolveEpubPath(baseDir, item.href);
    const html = await readZipText(zip, htmlPath);
    const parsed = htmlToChapter(html, `第 ${chapters.length + 1} 章`);

    if (parsed.content.length === 0) {
      continue;
    }

    chapters.push({
      slug: `c${chapters.length + 1}`,
      title: parsed.title,
      content: parsed.content,
    });
  }

  if (chapters.length === 0) {
    throw new Error("No readable EPUB chapters");
  }

  return {
    title,
    author,
    slug: createSlugFromFileName(file.name),
    chapters,
    chapterText: chapterLines(chapters),
    novelBodyText: novelBodyLines(chapters),
  };
}

async function coverFileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getCategoryCounts(works: EditableWork[], type: WorkType) {
  return works
    .filter((work) => work.type === type)
    .reduce<Record<string, number>>((counts, work) => {
      counts[work.category] = (counts[work.category] ?? 0) + 1;
      return counts;
    }, {});
}

export function AdminDashboard() {
  const [initialState] = useState(() => {
    const initialWorks = readLocalWorks();
    const initialWork = initialWorks[0] ?? cloneWork(emptyWork);

    return {
      works: initialWorks,
      selectedSlug: initialWork.slug,
      draft: cloneWork(initialWork),
      chapterText: chapterLines(initialWork.chapters),
      novelBodyText: novelBodyLines(initialWork.chapters),
    };
  });
  const [adminWorks, setAdminWorks] = useState<EditableWork[]>(
    initialState.works,
  );
  const [selectedSlug, setSelectedSlug] = useState(initialState.selectedSlug);
  const [draft, setDraft] = useState<EditableWork>(initialState.draft);
  const [chapterText, setChapterText] = useState(initialState.chapterText);
  const [novelBodyText, setNovelBodyText] = useState(
    initialState.novelBodyText,
  );
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dataSource, setDataSource] = useState<DataSource>("loading");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadWorks() {
      try {
        const response = await fetch("/api/admin/works", { cache: "no-store" });
        const result = (await response.json()) as WorksResponse;

        if (!isMounted) {
          return;
        }

        if (response.ok && result.configured) {
          const nextWorks =
            result.works.length > 0 ? result.works : seedWorks.map(cloneWork);
          const firstWork = nextWorks[0] ?? cloneWork(emptyWork);

          setAdminWorks(nextWorks);
          setSelectedSlug(firstWork.slug);
          setDraft(cloneWork(firstWork));
          setChapterText(chapterLines(firstWork.chapters));
          setNovelBodyText(novelBodyLines(firstWork.chapters));
          setDataSource("supabase");
          setMessage("已连接 Supabase，保存后会写入线上数据库。");
          return;
        }

        setDataSource("local");
        setMessage("Supabase 未连接成功，当前只会保存到这个浏览器。");
      } catch {
        if (!isMounted) {
          return;
        }

        setDataSource("local");
        setMessage("无法连接后台接口，当前只会保存到这个浏览器。");
      }
    }

    void loadWorks();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(
    () => ({
      total: adminWorks.length,
      novels: adminWorks.filter((work) => work.type === "novel").length,
      comics: adminWorks.filter((work) => work.type === "comic").length,
      newWorks: adminWorks.filter((work) => work.section === "new").length,
    }),
    [adminWorks],
  );

  const novelCategories = useMemo(
    () => getCategoryCounts(adminWorks, "novel"),
    [adminWorks],
  );
  const comicCategories = useMemo(
    () => getCategoryCounts(adminWorks, "comic"),
    [adminWorks],
  );

  const filteredWorks = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return adminWorks.filter((work) => {
      const matchesType = typeFilter === "all" || work.type === typeFilter;
      const matchesCategory =
        categoryFilter === "all" || work.category === categoryFilter;
      const matchesKeyword =
        !keyword ||
        work.title.toLowerCase().includes(keyword) ||
        work.author.toLowerCase().includes(keyword) ||
        work.slug.toLowerCase().includes(keyword) ||
        work.category.toLowerCase().includes(keyword);

      return matchesType && matchesCategory && matchesKeyword;
    });
  }, [adminWorks, categoryFilter, query, typeFilter]);

  function persistLocal(nextWorks: EditableWork[]) {
    setAdminWorks(nextWorks);
    window.localStorage.setItem(storageKey, JSON.stringify(nextWorks));
  }

  function setSelectedWork(work: EditableWork) {
    setSelectedSlug(work.slug);
    setDraft(cloneWork(work));
    setChapterText(chapterLines(work.chapters));
    setNovelBodyText(novelBodyLines(work.chapters));
  }

  function updateDraft<K extends keyof EditableWork>(
    key: K,
    value: EditableWork[K],
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function createWork() {
    const nextWork = {
      ...cloneWork(emptyWork),
      slug: `new-wave-title-${Date.now().toString().slice(-5)}`,
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    setSelectedWork(nextWork);
    setMessage("已创建新作品，填写后点击保存。");
  }

  async function saveDraft() {
    const savedWork = normalizeDraft(draft, chapterText, novelBodyText);
    const exists = adminWorks.some((work) => work.slug === selectedSlug);
    const nextWorks = exists
      ? adminWorks.map((work) => (work.slug === selectedSlug ? savedWork : work))
      : [savedWork, ...adminWorks];

    setIsSaving(true);

    try {
      if (dataSource === "supabase") {
        const response = await fetch("/api/admin/works", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(savedWork),
        });

        if (!response.ok) {
          throw new Error("保存到 Supabase 失败。");
        }

        if (selectedSlug !== savedWork.slug) {
          await fetch(`/api/admin/works?slug=${encodeURIComponent(selectedSlug)}`, {
            method: "DELETE",
          });
        }
      } else {
        window.localStorage.setItem(storageKey, JSON.stringify(nextWorks));
      }

      setAdminWorks(nextWorks);
      setSelectedSlug(savedWork.slug);
      setDraft(cloneWork(savedWork));
      setChapterText(chapterLines(savedWork.chapters));
      setNovelBodyText(novelBodyLines(savedWork.chapters));
      setMessage(dataSource === "supabase" ? "已保存到 Supabase。" : "已保存到本地浏览器。");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "保存失败，请重试。");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteDraft() {
    const nextWorks = adminWorks.filter((work) => work.slug !== selectedSlug);
    const fallback = nextWorks[0] ?? cloneWork(emptyWork);

    setIsSaving(true);

    try {
      if (dataSource === "supabase") {
        const response = await fetch(
          `/api/admin/works?slug=${encodeURIComponent(selectedSlug)}`,
          { method: "DELETE" },
        );

        if (!response.ok) {
          throw new Error("从 Supabase 删除失败。");
        }
      } else {
        window.localStorage.setItem(storageKey, JSON.stringify(nextWorks));
      }

      setAdminWorks(nextWorks.length > 0 ? nextWorks : [fallback]);
      setSelectedWork(fallback);
      setMessage("作品已删除。");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "删除失败，请重试。");
    } finally {
      setIsSaving(false);
    }
  }

  async function seedSupabaseData() {
    if (dataSource !== "supabase") {
      setMessage("Supabase 还没有连接成功，不能初始化线上数据。");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/admin/works", { method: "PUT" });

      if (!response.ok) {
        throw new Error("导入示例作品到 Supabase 失败。");
      }

      const result = (await response.json()) as { works: EditableWork[] };
      const nextWorks =
        result.works.length > 0 ? result.works : seedWorks.map(cloneWork);
      const firstWork = nextWorks[0] ?? cloneWork(emptyWork);

      setAdminWorks(nextWorks);
      setSelectedWork(firstWork);
      setMessage("已把示例作品导入 Supabase。");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "导入失败，请重试。");
    } finally {
      setIsSaving(false);
    }
  }

  function resetLocalData() {
    if (dataSource === "supabase") {
      setMessage("当前使用 Supabase，不能用本地重置覆盖线上数据。");
      return;
    }

    const resetWorks = seedWorks.map(cloneWork);
    persistLocal(resetWorks);
    setSelectedWork(resetWorks[0]);
    setMessage("本地数据已恢复为示例作品。");
  }

  async function importNovelFile(file: File | undefined) {
    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith(".txt")) {
      setMessage("请上传 TXT 格式的小说文件。");
      return;
    }

    setIsSaving(true);
    setMessage("正在读取并拆分小说章节...");

    try {
      const text = await readTxtFile(file);
      const importedNovel = parseImportedNovel(file.name, text);
      const nextDraft: EditableWork = {
        ...draft,
        slug: importedNovel.slug,
        title: importedNovel.title,
        type: "novel",
        category: draft.category || "导入小说",
        description:
          draft.description || `从 TXT 文件《${importedNovel.title}》导入的小说。`,
        tags: draft.tags.length > 0 ? draft.tags : ["小说", "导入"],
        status: "连载中",
        updatedAt: new Date().toISOString().slice(0, 10),
        section: "new",
        chapters: importedNovel.chapters,
      };

      setSelectedWork(nextDraft);
      setChapterText(importedNovel.chapterText);
      setNovelBodyText(importedNovel.novelBodyText);
      setMessage(
        `已导入《${importedNovel.title}》，识别到 ${importedNovel.chapters.length} 章。检查后点击保存。`,
      );
    } catch {
      setMessage("导入失败，请确认 TXT 文件可以正常打开。");
    } finally {
      setIsSaving(false);
    }
  }

  async function importEpubFile(file: File | undefined) {
    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith(".epub")) {
      setMessage("请上传 EPUB 格式的小说文件。");
      return;
    }

    setIsSaving(true);
    setMessage("正在读取 EPUB，并按目录拆分章节...");

    try {
      const importedNovel = await parseEpubFile(file);
      const nextDraft: EditableWork = {
        ...draft,
        slug: importedNovel.slug,
        title: importedNovel.title,
        author: importedNovel.author || draft.author,
        type: "novel",
        category: draft.category || "导入小说",
        description:
          draft.description ||
          `从 EPUB 文件《${importedNovel.title}》导入的小说。`,
        tags: draft.tags.length > 0 ? draft.tags : ["小说", "EPUB导入"],
        status: "连载中",
        updatedAt: new Date().toISOString().slice(0, 10),
        section: "new",
        chapters: importedNovel.chapters,
      };

      setSelectedWork(nextDraft);
      setChapterText(importedNovel.chapterText);
      setNovelBodyText(importedNovel.novelBodyText);
      setMessage(
        `已导入《${importedNovel.title}》，识别到 ${importedNovel.chapters.length} 章。请检查后点击保存。`,
      );
    } catch {
      setMessage(
        "EPUB 导入失败。这个文件可能加密、目录格式特殊，或章节不是常见 XHTML 格式。",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function uploadCoverFile(file: File | undefined) {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage("请上传 JPG、PNG 或 WebP 图片。");
      return;
    }

    setIsSaving(true);
    setMessage("正在上传封面...");

    try {
      const image = await coverFileToDataUrl(file);
      setDraft((current) => ({
        ...current,
        coverStyle: {
          ...current.coverStyle,
          image,
        },
      }));
      setMessage("封面已放入表单，点击保存后写入数据。");
    } catch {
      setMessage("封面处理失败，请换一张图片再试。");
    } finally {
      setIsSaving(false);
    }
  }

  function clearCoverImage() {
    setDraft((current) => {
      const nextCover = { ...current.coverStyle };
      delete nextCover.image;

      return {
        ...current,
        coverStyle: nextCover,
      };
    });
    setMessage("已移除当前封面，保存后生效。");
  }

  async function logoutAdmin() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-4">
        <StatCard label="作品总数" value={stats.total} />
        <StatCard label="小说" value={stats.novels} />
        <StatCard label="漫画" value={stats.comics} />
        <StatCard label="新作" value={stats.newWorks} />
      </div>

      <div className="rounded border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold leading-6 text-slate-100">
        数据来源：
        {dataSource === "loading"
          ? "检查中"
          : dataSource === "supabase"
            ? "Supabase"
            : "本地浏览器"}
        。{message}
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="border border-white/10 bg-black/40">
          <div className="space-y-3 border-b border-white/10 p-4">
            <button
              type="button"
              onClick={createWork}
              className="w-full rounded bg-rose-500 px-4 py-3 text-sm font-black text-white transition hover:bg-rose-400"
            >
              新建作品
            </button>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索标题 / 作者 / slug / 分类"
              className="h-10 w-full rounded border border-white/10 bg-white px-3 text-sm font-semibold text-slate-900 outline-none"
            />
            <div className="grid grid-cols-3 gap-2">
              {(["all", "novel", "comic"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setTypeFilter(type);
                    setCategoryFilter("all");
                  }}
                  className={`rounded px-3 py-2 text-xs font-black ${
                    typeFilter === type
                      ? "bg-white text-slate-950"
                      : "bg-white/10 text-white"
                  }`}
                >
                  {type === "all" ? "全部" : type === "novel" ? "小说" : "漫画"}
                </button>
              ))}
            </div>
            <CategoryFilters
              title="小说分类"
              categories={novelCategories}
              activeCategory={categoryFilter}
              onSelect={(category) => {
                setTypeFilter("novel");
                setCategoryFilter(category);
              }}
            />
            <CategoryFilters
              title="漫画分类"
              categories={comicCategories}
              activeCategory={categoryFilter}
              onSelect={(category) => {
                setTypeFilter("comic");
                setCategoryFilter(category);
              }}
            />
          </div>

          <div className="max-h-[640px] overflow-y-auto">
            {filteredWorks.map((work) => (
              <button
                key={work.slug}
                type="button"
                onClick={() => setSelectedWork(work)}
                className={`grid w-full grid-cols-[64px_1fr] gap-3 border-b border-white/10 p-3 text-left transition hover:bg-white/10 ${
                  selectedSlug === work.slug ? "bg-rose-500/15" : ""
                }`}
              >
                <CoverArt work={work} compact />
                <span className="min-w-0">
                  <span className="block truncate font-black text-white">
                    {work.title}
                  </span>
                  <span className="mt-1 block truncate text-xs font-bold text-slate-400">
                    {work.type === "novel" ? "小说" : "漫画"} / {work.category}
                  </span>
                  <span className="mt-1 block truncate text-xs text-slate-500">
                    /works/{work.slug}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </aside>

        <section className="border border-white/10 bg-black/50 p-4 sm:p-5">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-rose-400">
                管理员操作
              </p>
              <h2 className="mt-1 text-2xl font-black text-white">作品编辑</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={logoutAdmin}
                className="rounded border border-white/10 px-4 py-2 text-sm font-black text-white transition hover:bg-white/10"
              >
                退出登录
              </button>
              <Link
                href={`/works/${draft.slug}`}
                className="rounded border border-white/10 px-4 py-2 text-sm font-black text-white transition hover:bg-white/10"
              >
                前台预览
              </Link>
              <button
                type="button"
                onClick={resetLocalData}
                className="rounded border border-white/10 px-4 py-2 text-sm font-black text-white transition hover:bg-white/10"
              >
                重置本地数据
              </button>
              <button
                type="button"
                onClick={seedSupabaseData}
                disabled={isSaving || dataSource !== "supabase"}
                className="rounded border border-emerald-400/40 px-4 py-2 text-sm font-black text-emerald-100 transition hover:bg-emerald-400/10 disabled:opacity-50"
              >
                初始化示例数据
              </button>
              <button
                type="button"
                onClick={deleteDraft}
                disabled={isSaving}
                className="rounded border border-rose-400/50 px-4 py-2 text-sm font-black text-rose-200 transition hover:bg-rose-500/20 disabled:opacity-50"
              >
                删除作品
              </button>
              <button
                type="button"
                onClick={saveDraft}
                disabled={isSaving}
                className="rounded bg-white px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-rose-100 disabled:opacity-50"
              >
                {isSaving ? "处理中..." : "保存作品"}
              </button>
            </div>
          </div>

          <div className="mb-5 grid gap-3 rounded border border-sky-400/30 bg-sky-400/10 p-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-200">
                整本小说导入
              </p>
              <p className="mt-1 text-sm font-bold leading-6 text-sky-50">
                支持 TXT 和常见 EPUB。导入后会自动识别章节，并填入章节列表和小说正文。
              </p>
            </div>
            <label className="inline-flex cursor-pointer items-center justify-center rounded bg-white px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-sky-100">
              选择 TXT 文件
              <input
                type="file"
                accept=".txt,text/plain"
                className="sr-only"
                disabled={isSaving}
                onChange={(event) => {
                  void importNovelFile(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
            </label>
            <label className="inline-flex cursor-pointer items-center justify-center rounded border border-white/30 bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800">
              选择 EPUB 文件
              <input
                type="file"
                accept=".epub,application/epub+zip"
                className="sr-only"
                disabled={isSaving}
                onChange={(event) => {
                  void importEpubFile(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
            </label>
          </div>

          <div className="grid gap-5 xl:grid-cols-[1fr_220px]">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="作品标题">
                <input
                  value={draft.title}
                  onChange={(event) => updateDraft("title", event.target.value)}
                  className="admin-input"
                />
              </Field>
              <Field label="作品 slug">
                <input
                  value={draft.slug}
                  onChange={(event) => updateDraft("slug", event.target.value)}
                  className="admin-input"
                />
              </Field>
              <Field label="作者">
                <input
                  value={draft.author}
                  onChange={(event) => updateDraft("author", event.target.value)}
                  className="admin-input"
                />
              </Field>
              <Field label="作品类型">
                <select
                  value={draft.type}
                  onChange={(event) =>
                    updateDraft("type", event.target.value as WorkType)
                  }
                  className="admin-input"
                >
                  <option value="comic">漫画</option>
                  <option value="novel">小说</option>
                </select>
              </Field>
              <Field label="分类">
                <input
                  value={draft.category}
                  onChange={(event) => updateDraft("category", event.target.value)}
                  className="admin-input"
                />
              </Field>
              <Field label="连载状态">
                <input
                  value={draft.status}
                  onChange={(event) => updateDraft("status", event.target.value)}
                  className="admin-input"
                />
              </Field>
              <Field label="更新时间">
                <input
                  type="date"
                  value={draft.updatedAt}
                  onChange={(event) => updateDraft("updatedAt", event.target.value)}
                  className="admin-input"
                />
              </Field>
              <Field label="人气值">
                <input
                  type="number"
                  value={draft.popularity}
                  onChange={(event) =>
                    updateDraft("popularity", Number(event.target.value))
                  }
                  className="admin-input"
                />
              </Field>
              <Field label="首页分区">
                <select
                  value={draft.section}
                  onChange={(event) =>
                    updateDraft(
                      "section",
                      event.target.value as EditableWork["section"],
                    )
                  }
                  className="admin-input"
                >
                  <option value="popular-novel">热门小说</option>
                  <option value="popular-comic">热门漫画</option>
                  <option value="new">新作推荐</option>
                </select>
              </Field>
              <Field label="标签">
                <input
                  value={draft.tags.join(", ")}
                  onChange={(event) =>
                    updateDraft(
                      "tags",
                      event.target.value.split(",").map((tag) => tag.trim()),
                    )
                  }
                  className="admin-input"
                />
              </Field>
              <Field label="作品简介" wide>
                <textarea
                  value={draft.description}
                  onChange={(event) =>
                    updateDraft("description", event.target.value)
                  }
                  rows={4}
                  className="admin-input resize-none"
                />
              </Field>
              <Field label="章节列表：slug|章节名" wide>
                <textarea
                  value={chapterText}
                  onChange={(event) => setChapterText(event.target.value)}
                  rows={5}
                  className="admin-input resize-none font-mono text-xs"
                />
              </Field>
              {draft.type === "novel" ? (
                <Field label="小说正文：用 # 章节 slug 分段" wide>
                  <textarea
                    value={novelBodyText}
                    onChange={(event) => setNovelBodyText(event.target.value)}
                    rows={10}
                    placeholder={"# c1\n这里写第一章正文。\n\n---\n\n# c2\n这里写第二章正文。"}
                    className="admin-input resize-none font-mono text-xs leading-6"
                  />
                </Field>
              ) : null}
              <Field label="封面起始色">
                <input
                  value={draft.coverStyle.from}
                  onChange={(event) =>
                    updateDraft("coverStyle", {
                      ...draft.coverStyle,
                      from: event.target.value,
                    })
                  }
                  className="admin-input"
                />
              </Field>
              <Field label="封面过渡色">
                <input
                  value={draft.coverStyle.via}
                  onChange={(event) =>
                    updateDraft("coverStyle", {
                      ...draft.coverStyle,
                      via: event.target.value,
                    })
                  }
                  className="admin-input"
                />
              </Field>
              <Field label="封面结束色">
                <input
                  value={draft.coverStyle.to}
                  onChange={(event) =>
                    updateDraft("coverStyle", {
                      ...draft.coverStyle,
                      to: event.target.value,
                    })
                  }
                  className="admin-input"
                />
              </Field>
              <Field label="封面文字">
                <input
                  value={draft.coverStyle.mark}
                  onChange={(event) =>
                    updateDraft("coverStyle", {
                      ...draft.coverStyle,
                      mark: event.target.value,
                    })
                  }
                  className="admin-input"
                />
              </Field>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                封面预览
              </p>
              <CoverArt work={draft} />
              <label className="flex cursor-pointer items-center justify-center rounded bg-white px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-rose-100">
                上传封面图片
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  disabled={isSaving}
                  onChange={(event) => {
                    void uploadCoverFile(event.target.files?.[0]);
                    event.target.value = "";
                  }}
                />
              </label>
              {draft.coverStyle.image ? (
                <button
                  type="button"
                  onClick={clearCoverImage}
                  className="w-full rounded border border-white/10 px-4 py-2 text-sm font-black text-white transition hover:bg-white/10"
                >
                  移除当前封面
                </button>
              ) : null}
              <p className="text-sm leading-6 text-slate-400">
                封面可以手动上传图片；不上传时会使用当前颜色生成占位封面。
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function CategoryFilters({
  title,
  categories,
  activeCategory,
  onSelect,
}: {
  title: string;
  categories: Record<string, number>;
  activeCategory: string;
  onSelect: (category: string) => void;
}) {
  const entries = Object.entries(categories);

  if (entries.length === 0) {
    return null;
  }

  return (
    <div>
      <p className="mb-2 text-xs font-black text-slate-400">{title}</p>
      <div className="flex flex-wrap gap-2">
        {entries.map(([category, count]) => (
          <button
            key={category}
            type="button"
            onClick={() => onSelect(activeCategory === category ? "all" : category)}
            className={`rounded px-2 py-1 text-xs font-bold ${
              activeCategory === category
                ? "bg-rose-500 text-white"
                : "bg-white/10 text-slate-200 hover:bg-white/15"
            }`}
          >
            {category} {count}
          </button>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-white/10 bg-white/10 p-4">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black text-white">{value}</p>
    </div>
  );
}

function Field({
  label,
  wide = false,
  children,
}: {
  label: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">
        {label}
      </span>
      {children}
    </label>
  );
}
