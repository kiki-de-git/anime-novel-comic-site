export type WorkType = "novel" | "comic";

export type Chapter = {
  slug: string;
  title: string;
  content?: string[];
  imageCount?: number;
};

export type Work = {
  slug: string;
  type: WorkType;
  title: string;
  author: string;
  description: string;
  tags: string[];
  section: "popular-novel" | "popular-comic" | "new";
  status: string;
  coverFrom: string;
  coverVia: string;
  coverTo: string;
  coverMark: string;
  chapters: Chapter[];
};

const novelParagraphs = (name: string, motif: string): string[] => [
  `午夜的城市像被浅蓝色墨水轻轻晕开，${name}沿着天台边缘奔跑，耳机里传来断续的社团频道讯号。`,
  `风把便利店的收据卷上天空，收据背面却浮现出一串没有人见过的坐标。${motif}在那一刻亮起，像是某种只属于青春的暗号。`,
  `她知道今晚不会再普通。校门、旧书店、最后一班电车，全都在等待一个能够把故事继续写下去的人。`,
  `于是她合上笔记本，把害怕塞进口袋。下一页，就从推开那扇发光的门开始。`,
];

const comicChapters = (prefix: string): Chapter[] => [
  { slug: "c1", title: `${prefix} 01：初见的光`, imageCount: 5 },
  { slug: "c2", title: `${prefix} 02：雨后的社团室`, imageCount: 6 },
  { slug: "c3", title: `${prefix} 03：星轨作战`, imageCount: 5 },
];

const novelChapters = (hero: string, motif: string): Chapter[] => [
  {
    slug: "c1",
    title: "第一章：晚风与未寄出的信",
    content: novelParagraphs(hero, motif),
  },
  {
    slug: "c2",
    title: "第二章：旧书店的蓝色门铃",
    content: novelParagraphs(hero, "门铃"),
  },
  {
    slug: "c3",
    title: "第三章：夏日祭前夜",
    content: novelParagraphs(hero, "烟火"),
  },
];

export const works: Work[] = [
  {
    slug: "starlit-library",
    type: "novel",
    title: "星灯图书馆",
    author: "鹿川眠",
    description:
      "转学生在废弃图书馆里发现会改写现实的星灯，和问题社团一起修补城市记忆。",
    tags: ["校园", "奇幻", "治愈"],
    section: "popular-novel",
    status: "连载中",
    coverFrom: "#ff8ab3",
    coverVia: "#bda4ff",
    coverTo: "#87d8ff",
    coverMark: "STAR",
    chapters: novelChapters("林夕", "星灯"),
  },
  {
    slug: "mint-rain-summoner",
    type: "novel",
    title: "薄荷雨召唤师",
    author: "青井澄",
    description:
      "能听见雨声愿望的少女，被卷入一场关于天气、友情和失约魔法的冒险。",
    tags: ["魔法", "冒险", "友情"],
    section: "popular-novel",
    status: "连载中",
    coverFrom: "#78e0d2",
    coverVia: "#9eb5ff",
    coverTo: "#f8a7d8",
    coverMark: "RAIN",
    chapters: novelChapters("七濑", "薄荷雨"),
  },
  {
    slug: "moonrail-cafe",
    type: "novel",
    title: "月轨咖啡馆",
    author: "浅羽灯",
    description:
      "每逢满月才营业的咖啡馆，收留迷路的客人，也交换他们尚未说出口的秘密。",
    tags: ["都市", "温柔", "单元剧"],
    section: "popular-novel",
    status: "已完结",
    coverFrom: "#9aa7ff",
    coverVia: "#ffc1e3",
    coverTo: "#fff0a6",
    coverMark: "MOON",
    chapters: novelChapters("遥", "月轨"),
  },
  {
    slug: "soda-sea-diary",
    type: "novel",
    title: "汽水海日记",
    author: "白岛司",
    description:
      "海边小镇的暑假、会说话的漂流瓶，以及一支决定参加烟火大会的临时乐队。",
    tags: ["青春", "夏日", "乐队"],
    section: "popular-novel",
    status: "连载中",
    coverFrom: "#58c7ff",
    coverVia: "#ffc6df",
    coverTo: "#fff5b8",
    coverMark: "SEA",
    chapters: novelChapters("小春", "漂流瓶"),
  },
  {
    slug: "neon-cat-agency",
    type: "comic",
    title: "霓虹猫事务所",
    author: "千鸟町",
    description:
      "夜晚营业的怪奇事务所，专接人类和小妖怪之间那些不好意思说出口的委托。",
    tags: ["轻喜剧", "怪奇", "都市"],
    section: "popular-comic",
    status: "周更",
    coverFrom: "#ff7aa8",
    coverVia: "#7d7cff",
    coverTo: "#70f1d6",
    coverMark: "CAT",
    chapters: comicChapters("第"),
  },
  {
    slug: "cloud-bloom-studio",
    type: "comic",
    title: "云花制作组",
    author: "三原铃",
    description:
      "四名新人创作者合租一间阁楼工作室，从零开始做出属于自己的动画短片。",
    tags: ["创作", "群像", "励志"],
    section: "popular-comic",
    status: "连载中",
    coverFrom: "#b28cff",
    coverVia: "#ffadd7",
    coverTo: "#a4edff",
    coverMark: "ART",
    chapters: comicChapters("第"),
  },
  {
    slug: "sakura-byte",
    type: "comic",
    title: "樱花 Byte",
    author: "星野栞",
    description:
      "程序社少女发现校园服务器里藏着一个会吐槽的像素精灵，社团日常从此失控。",
    tags: ["校园", "科幻", "喜剧"],
    section: "popular-comic",
    status: "双周更",
    coverFrom: "#ff9fc6",
    coverVia: "#9db2ff",
    coverTo: "#c5ffdd",
    coverMark: "BYTE",
    chapters: comicChapters("第"),
  },
  {
    slug: "aurora-delivery",
    type: "comic",
    title: "极光速递",
    author: "北见岬",
    description:
      "穿越云层的速递员，把遗失的心意送往每一座被极光照亮的岛屿。",
    tags: ["幻想", "旅行", "治愈"],
    section: "popular-comic",
    status: "连载中",
    coverFrom: "#64d7ff",
    coverVia: "#bca4ff",
    coverTo: "#ffbdd8",
    coverMark: "AIR",
    chapters: comicChapters("第"),
  },
  {
    slug: "after-school-orbit",
    type: "novel",
    title: "放学后轨道",
    author: "远野晴",
    description:
      "天文部捡到一台能接收未来三分钟讯息的收音机，平凡放学路变成小小宇宙任务。",
    tags: ["新作", "校园", "科幻"],
    section: "new",
    status: "新连载",
    coverFrom: "#7aa8ff",
    coverVia: "#ff9ed0",
    coverTo: "#fff2a8",
    coverMark: "ORBIT",
    chapters: novelChapters("望月", "收音机"),
  },
  {
    slug: "ribbon-alchemist",
    type: "novel",
    title: "缎带炼金术",
    author: "花森由纪",
    description:
      "少女用缎带封存情绪，再把它们炼成能帮助别人的小小奇迹。",
    tags: ["新作", "奇幻", "少女"],
    section: "new",
    status: "新连载",
    coverFrom: "#ff86ba",
    coverVia: "#ffd27d",
    coverTo: "#93d8ff",
    coverMark: "RIBBON",
    chapters: novelChapters("明莉", "缎带"),
  },
  {
    slug: "palette-knights",
    type: "comic",
    title: "调色盘骑士团",
    author: "水濑圆",
    description:
      "失去颜色的王国里，四位见习骑士用画笔和勇气找回季节。",
    tags: ["新作", "冒险", "彩色幻想"],
    section: "new",
    status: "新连载",
    coverFrom: "#90e7ff",
    coverVia: "#ffa6cc",
    coverTo: "#c6ff9e",
    coverMark: "COLOR",
    chapters: comicChapters("第"),
  },
  {
    slug: "dream-server",
    type: "comic",
    title: "梦境服务器",
    author: "栗山遥",
    description:
      "当梦境可以被组队探索，最弱小队决定挑战无人通关的第零层。",
    tags: ["新作", "游戏", "热血"],
    section: "new",
    status: "新连载",
    coverFrom: "#a989ff",
    coverVia: "#75ddff",
    coverTo: "#ffb8df",
    coverMark: "DREAM",
    chapters: comicChapters("第"),
  },
];

export function getWork(slug: string) {
  return works.find((work) => work.slug === slug);
}

export function getChapter(work: Work, chapterSlug: string) {
  return work.chapters.find((chapter) => chapter.slug === chapterSlug);
}

export function getChapterNeighbors(work: Work, chapterSlug: string) {
  const index = work.chapters.findIndex((chapter) => chapter.slug === chapterSlug);

  return {
    previous: index > 0 ? work.chapters[index - 1] : undefined,
    next:
      index >= 0 && index < work.chapters.length - 1
        ? work.chapters[index + 1]
        : undefined,
  };
}

export function getReadHref(work: Work, chapterSlug = work.chapters[0]?.slug) {
  return `/read/${work.type}/${work.slug}/${chapterSlug}`;
}
