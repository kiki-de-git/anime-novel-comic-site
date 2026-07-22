export type WorkType = "novel" | "comic";

export type Chapter = {
  slug: string;
  title: string;
  content?: string[];
  imageCount?: number;
};

export type CoverStyle = {
  from: string;
  via: string;
  to: string;
  mark: string;
  image?: string;
};

export type Work = {
  slug: string;
  title: string;
  author: string;
  type: WorkType;
  category: string;
  description: string;
  tags: string[];
  status: string;
  updatedAt: string;
  popularity: number;
  coverStyle: CoverStyle;
  section: "popular-novel" | "popular-comic" | "new";
  chapters: Chapter[];
};

const novelParagraphs = (name: string, motif: string): string[] => [
  `午夜的城市像被浅蓝色墨水轻轻晕开，${name}沿着天台边缘奔跑，耳机里传来断续的社团频道讯号。`,
  `风把便利店的收据卷上天空，收据背面却浮现出一串没有人见过的坐标。${motif}在那一刻亮起，像是某种只属于青春的暗号。`,
  `她知道今晚不会再普通。校门、旧书店、最后一班电车，全都在等待一个能够把故事继续写下去的人。`,
  `于是她合上笔记本，把害怕塞进口袋。下一页，就从推开那扇发光的门开始。`,
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

const comicChapters = (): Chapter[] => [
  { slug: "c1", title: "第 01 话：初见的光", imageCount: 5 },
  { slug: "c2", title: "第 02 话：雨后的社团室", imageCount: 6 },
  { slug: "c3", title: "第 03 话：星轨作战", imageCount: 5 },
];

const cover = (from: string, via: string, to: string, mark: string): CoverStyle => ({
  from,
  via,
  to,
  mark,
});

export const works: Work[] = [
  {
    slug: "starlit-library",
    title: "星灯图书馆",
    author: "鹿川眠",
    type: "novel",
    category: "校园奇幻",
    description: "转学生在废弃图书馆里发现会改写现实的星灯，和问题社团一起修补城市记忆。",
    tags: ["校园", "奇幻", "治愈"],
    status: "连载中",
    updatedAt: "2026-07-06",
    popularity: 94300,
    coverStyle: cover("#ff8ab3", "#bda4ff", "#87d8ff", "STAR"),
    section: "popular-novel",
    chapters: novelChapters("林夕", "星灯"),
  },
  {
    slug: "mint-rain-summoner",
    title: "薄荷雨召唤师",
    author: "青井澄",
    type: "novel",
    category: "魔法冒险",
    description: "能听见雨声愿望的少女，被卷入一场关于天气、友情和失约魔法的冒险。",
    tags: ["魔法", "冒险", "友情"],
    status: "连载中",
    updatedAt: "2026-07-05",
    popularity: 81200,
    coverStyle: cover("#78e0d2", "#9eb5ff", "#f8a7d8", "RAIN"),
    section: "popular-novel",
    chapters: novelChapters("七濑", "薄荷雨"),
  },
  {
    slug: "moonrail-cafe",
    title: "月轨咖啡馆",
    author: "浅羽灯",
    type: "novel",
    category: "都市幻想",
    description: "每逢满月才营业的咖啡馆，收留迷路的客人，也交换他们尚未说出口的秘密。",
    tags: ["都市", "温柔", "单元剧"],
    status: "已完结",
    updatedAt: "2026-06-30",
    popularity: 75600,
    coverStyle: cover("#9aa7ff", "#ffc1e3", "#fff0a6", "MOON"),
    section: "popular-novel",
    chapters: novelChapters("遥", "月轨"),
  },
  {
    slug: "soda-sea-diary",
    title: "汽水海日记",
    author: "白岛司",
    type: "novel",
    category: "青春日常",
    description: "海边小镇的暑假、会说话的漂流瓶，以及一支决定参加烟火大会的临时乐队。",
    tags: ["青春", "夏日", "乐队"],
    status: "连载中",
    updatedAt: "2026-07-04",
    popularity: 68900,
    coverStyle: cover("#58c7ff", "#ffc6df", "#fff5b8", "SEA"),
    section: "popular-novel",
    chapters: novelChapters("小春", "漂流瓶"),
  },
  {
    slug: "neon-cat-agency",
    title: "霓虹猫事务所",
    author: "千鸟町",
    type: "comic",
    category: "都市怪奇",
    description: "夜晚营业的怪奇事务所，专接人类和小妖怪之间那些不好意思说出口的委托。",
    tags: ["轻喜剧", "怪奇", "都市"],
    status: "周更",
    updatedAt: "2026-07-06",
    popularity: 120500,
    coverStyle: cover("#ff7aa8", "#7d7cff", "#70f1d6", "CAT"),
    section: "popular-comic",
    chapters: comicChapters(),
  },
  {
    slug: "cloud-bloom-studio",
    title: "云花制作组",
    author: "三原铃",
    type: "comic",
    category: "创作群像",
    description: "四名新人创作者合租一间阁楼工作室，从零开始做出属于自己的动画短片。",
    tags: ["创作", "群像", "励志"],
    status: "连载中",
    updatedAt: "2026-07-05",
    popularity: 101800,
    coverStyle: cover("#b28cff", "#ffadd7", "#a4edff", "ART"),
    section: "popular-comic",
    chapters: comicChapters(),
  },
  {
    slug: "sakura-byte",
    title: "樱花 Byte",
    author: "星野栞",
    type: "comic",
    category: "校园科幻",
    description: "程序社少女发现校园服务器里藏着一个会吐槽的像素精灵，社团日常从此失控。",
    tags: ["校园", "科幻", "喜剧"],
    status: "双周更",
    updatedAt: "2026-07-03",
    popularity: 87500,
    coverStyle: cover("#ff9fc6", "#9db2ff", "#c5ffdd", "BYTE"),
    section: "popular-comic",
    chapters: comicChapters(),
  },
  {
    slug: "aurora-delivery",
    title: "极光速递",
    author: "北见岬",
    type: "comic",
    category: "幻想旅行",
    description: "穿越云层的速递员，把遗失的心意送往每一座被极光照亮的岛屿。",
    tags: ["幻想", "旅行", "治愈"],
    status: "连载中",
    updatedAt: "2026-07-02",
    popularity: 83400,
    coverStyle: cover("#64d7ff", "#bca4ff", "#ffbdd8", "AIR"),
    section: "popular-comic",
    chapters: comicChapters(),
  },
  {
    slug: "after-school-orbit",
    title: "放学后轨道",
    author: "远野晴",
    type: "novel",
    category: "校园科幻",
    description: "天文部捡到一台能接收未来三分钟讯息的收音机，平凡放学路变成小小宇宙任务。",
    tags: ["新作", "校园", "科幻"],
    status: "新连载",
    updatedAt: "2026-07-06",
    popularity: 60200,
    coverStyle: cover("#7aa8ff", "#ff9ed0", "#fff2a8", "ORBIT"),
    section: "new",
    chapters: novelChapters("望月", "收音机"),
  },
  {
    slug: "ribbon-alchemist",
    title: "缎带炼金术",
    author: "花森由纪",
    type: "novel",
    category: "少女奇幻",
    description: "少女用缎带封存情绪，再把它们炼成能帮助别人的小小奇迹。",
    tags: ["新作", "奇幻", "少女"],
    status: "新连载",
    updatedAt: "2026-07-05",
    popularity: 53100,
    coverStyle: cover("#ff86ba", "#ffd27d", "#93d8ff", "RIBBON"),
    section: "new",
    chapters: novelChapters("明莉", "缎带"),
  },
  {
    slug: "palette-knights",
    title: "调色盘骑士团",
    author: "水濑圆",
    type: "comic",
    category: "彩色幻想",
    description: "失去颜色的王国里，四位见习骑士用画笔和勇气找回季节。",
    tags: ["新作", "冒险", "彩色幻想"],
    status: "新连载",
    updatedAt: "2026-07-04",
    popularity: 65400,
    coverStyle: cover("#90e7ff", "#ffa6cc", "#c6ff9e", "COLOR"),
    section: "new",
    chapters: comicChapters(),
  },
  {
    slug: "dream-server",
    title: "梦境服务器",
    author: "栗山遥",
    type: "comic",
    category: "游戏冒险",
    description: "当梦境可以被组队探索，最弱小队决定挑战无人通关的第零层。",
    tags: ["新作", "游戏", "热血"],
    status: "新连载",
    updatedAt: "2026-07-03",
    popularity: 71400,
    coverStyle: cover("#a989ff", "#75ddff", "#ffb8df", "DREAM"),
    section: "new",
    chapters: comicChapters(),
  },
  {
    slug: "black-sugar-planet",
    title: "黑糖行星",
    author: "雨宫凛",
    type: "novel",
    category: "太空日常",
    description: "被流放到甜品小行星的见习船长，意外经营起银河最热闹的深夜食堂。",
    tags: ["太空", "美食", "日常"],
    status: "连载中",
    updatedAt: "2026-07-02",
    popularity: 48900,
    coverStyle: cover("#3b2f4a", "#ff8a9a", "#ffd56b", "SUGAR"),
    section: "new",
    chapters: novelChapters("未央", "黑糖星尘"),
  },
  {
    slug: "glass-wind-post",
    title: "玻璃风邮局",
    author: "早川零",
    type: "novel",
    category: "治愈幻想",
    description: "只投递未说出口心意的邮局，在风暴季节收到一封寄给未来自己的信。",
    tags: ["治愈", "书信", "幻想"],
    status: "连载中",
    updatedAt: "2026-06-29",
    popularity: 45200,
    coverStyle: cover("#87d8ff", "#c9f0ff", "#ffb3d1", "POST"),
    section: "popular-novel",
    chapters: novelChapters("澄花", "玻璃风"),
  },
  {
    slug: "silver-fox-terminal",
    title: "银狐终点站",
    author: "久城透",
    type: "novel",
    category: "都市悬疑",
    description: "末班电车停在不存在的站台，少年和银狐售票员开始追查失踪乘客的记忆。",
    tags: ["悬疑", "都市", "夜车"],
    status: "月更",
    updatedAt: "2026-06-27",
    popularity: 79200,
    coverStyle: cover("#cbd5e1", "#7c3aed", "#0f172a", "FOX"),
    section: "popular-novel",
    chapters: novelChapters("槙野", "银狐车票"),
  },
  {
    slug: "crystal-drum-line",
    title: "水晶鼓线",
    author: "南条音",
    type: "novel",
    category: "音乐青春",
    description: "濒临解散的打击乐社，用一场雨中的街头演出重新找回节奏。",
    tags: ["音乐", "青春", "社团"],
    status: "连载中",
    updatedAt: "2026-06-25",
    popularity: 38600,
    coverStyle: cover("#06b6d4", "#8b5cf6", "#f472b6", "DRUM"),
    section: "popular-novel",
    chapters: novelChapters("律", "水晶鼓点"),
  },
  {
    slug: "meteor-ink-school",
    title: "流星墨学院",
    author: "唐泽杏",
    type: "comic",
    category: "学院热血",
    description: "用墨水召唤星座武器的学院里，吊车尾新生挑战最难毕业考。",
    tags: ["学院", "热血", "星座"],
    status: "周更",
    updatedAt: "2026-07-06",
    popularity: 118900,
    coverStyle: cover("#111827", "#2563eb", "#f43f5e", "INK"),
    section: "popular-comic",
    chapters: comicChapters(),
  },
  {
    slug: "toast-hero-club",
    title: "吐司英雄部",
    author: "小坂芽",
    type: "comic",
    category: "校园喜剧",
    description: "自称守护早餐和平的奇怪社团，每天都在用离谱方法拯救迟到学生。",
    tags: ["校园", "喜剧", "社团"],
    status: "连载中",
    updatedAt: "2026-07-01",
    popularity: 72100,
    coverStyle: cover("#f59e0b", "#fb7185", "#38bdf8", "TOAST"),
    section: "popular-comic",
    chapters: comicChapters(),
  },
  {
    slug: "mirror-lake-rangers",
    title: "镜湖巡守队",
    author: "峰岸澪",
    type: "comic",
    category: "奇幻冒险",
    description: "湖面倒映另一个世界，少年巡守队必须在黄昏前修补两边的裂缝。",
    tags: ["冒险", "幻想", "队伍"],
    status: "连载中",
    updatedAt: "2026-06-28",
    popularity: 96700,
    coverStyle: cover("#0ea5e9", "#22c55e", "#a78bfa", "LAKE"),
    section: "popular-comic",
    chapters: comicChapters(),
  },
  {
    slug: "peach-signal-999",
    title: "桃色信号 999",
    author: "椎名遥",
    type: "comic",
    category: "恋爱科幻",
    description: "全城恋爱信号突然失灵，通信社少女和冷面工程师开始抢修心动频率。",
    tags: ["恋爱", "科幻", "都市"],
    status: "双周更",
    updatedAt: "2026-06-26",
    popularity: 63700,
    coverStyle: cover("#fb7185", "#f0abfc", "#60a5fa", "999"),
    section: "popular-comic",
    chapters: comicChapters(),
  },
  {
    slug: "lantern-wolf-market",
    title: "灯狼夜市",
    author: "古森绫",
    type: "comic",
    category: "东方幻想",
    description: "只在月蚀夜开张的夜市里，戴灯笼的狼少年出售被遗忘的愿望。",
    tags: ["夜市", "幻想", "妖怪"],
    status: "新连载",
    updatedAt: "2026-07-06",
    popularity: 90500,
    coverStyle: cover("#1f2937", "#dc2626", "#facc15", "WOLF"),
    section: "new",
    chapters: comicChapters(),
  },
  {
    slug: "paper-plane-tower",
    title: "纸飞机高塔",
    author: "西园航",
    type: "novel",
    category: "成长冒险",
    description: "少年把一千架纸飞机送上废塔顶端，只为让失联的朋友看见回家的航线。",
    tags: ["成长", "冒险", "友情"],
    status: "新连载",
    updatedAt: "2026-07-01",
    popularity: 33800,
    coverStyle: cover("#fde68a", "#93c5fd", "#f9a8d4", "PLANE"),
    section: "new",
    chapters: novelChapters("航太", "纸飞机"),
  },
  {
    slug: "violet-engine-room",
    title: "紫罗兰机房",
    author: "片桐蓝",
    type: "novel",
    category: "近未来",
    description: "城市核心机房里开出紫罗兰，维护员少女发现它们正在记录人类梦境。",
    tags: ["未来", "AI", "梦境"],
    status: "新连载",
    updatedAt: "2026-07-03",
    popularity: 55800,
    coverStyle: cover("#4c1d95", "#7dd3fc", "#f0abfc", "CORE"),
    section: "new",
    chapters: novelChapters("蓝", "紫罗兰"),
  },
  {
    slug: "sunset-bento-team",
    title: "夕烧便当队",
    author: "森下米",
    type: "comic",
    category: "美食日常",
    description: "三名料理社成员每天放学后制作特别便当，悄悄解决同学们的小烦恼。",
    tags: ["美食", "日常", "校园"],
    status: "新连载",
    updatedAt: "2026-07-02",
    popularity: 42600,
    coverStyle: cover("#fb923c", "#fef08a", "#f9a8d4", "BENTO"),
    section: "new",
    chapters: comicChapters(),
  },
];

export function getWork(slug: string) {
  return works.find((work) => work.slug === slug);
}

export function getChapter(work: Work, chapterSlug: string) {
  return work.chapters.find((chapter) => chapter.slug === chapterSlug);
}

export function getLatestChapter(work: Work) {
  return work.chapters[work.chapters.length - 1] ?? work.chapters[0];
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

export function getLatestWorks(sourceWorks = works) {
  return [...sourceWorks].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export function getRankingWorks(sourceWorks = works) {
  return [...sourceWorks].sort((a, b) => b.popularity - a.popularity);
}

export function getNewWorks(sourceWorks = works) {
  return getLatestWorks(sourceWorks)
    .filter((work) => work.section === "new")
    .slice(0, 12);
}

export function formatPopularity(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 100000 ? 0 : 1)}K`;
  }

  return String(value);
}
