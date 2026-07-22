"use client";

import Image from "next/image";
import {
  FormEvent,
  MouseEvent,
  PointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type PetExpression = "idle" | "calm" | "smal" | "suprise";

type PetAsset = {
  key: PetExpression;
  label: string;
  src: string;
};

type PetMessage = {
  text: string;
  expression?: PetExpression;
};

type MenuPosition = {
  x: number;
  y: number;
};

const petAssets: PetAsset[] = [
  { key: "idle", label: "普通", src: "/pet/idle.png" },
  { key: "calm", label: "冷静", src: "/pet/calm.png" },
  { key: "smal", label: "微笑", src: "/pet/smal.png" },
  { key: "suprise", label: "惊讶", src: "/pet/suprise.png" },
];

const idleLines: PetMessage[][] = [
  [
    { text: "欢迎回到 WAVE。", expression: "smal" },
    { text: "今天也要读一点喜欢的故事吗？", expression: "idle" },
  ],
  [
    { text: "我会在这里陪你看小说和漫画。", expression: "calm" },
    { text: "右键我，可以打开小菜单。", expression: "idle" },
  ],
  [
    { text: "发现新作的时候，记得也叫上我。", expression: "suprise" },
    { text: "我很会围观。", expression: "smal" },
  ],
];

const expressionByKeyword: Array<{ keyword: string; expression: PetExpression }> = [
  { keyword: "惊", expression: "suprise" },
  { keyword: "吓", expression: "suprise" },
  { keyword: "笑", expression: "smal" },
  { keyword: "开心", expression: "smal" },
  { keyword: "冷静", expression: "calm" },
  { keyword: "安静", expression: "calm" },
];

function getDefaultPosition() {
  if (typeof window === "undefined") {
    return { x: 24, y: 24 };
  }

  return {
    x: Math.max(16, window.innerWidth - 220),
    y: Math.max(16, window.innerHeight - 340),
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function DesktopPet() {
  const [position, setPosition] = useState(getDefaultPosition);
  const [expression, setExpression] = useState<PetExpression>("idle");
  const [messages, setMessages] = useState<PetMessage[]>([]);
  const [messageIndex, setMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [completedAt, setCompletedAt] = useState(0);
  const [isBubbleVisible, setIsBubbleVisible] = useState(false);
  const [isBubbleFading, setIsBubbleFading] = useState(false);
  const [input, setInput] = useState("");
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const hasNextMessage = messageIndex < messages.length - 1;
  const currentMessage = messages[messageIndex];

  const currentAsset = useMemo(
    () => petAssets.find((asset) => asset.key === expression) ?? petAssets[0],
    [expression],
  );

  const speak = useCallback((nextMessages: PetMessage[]) => {
    if (nextMessages.length === 0) {
      return;
    }

    setMessages(nextMessages);
    setMessageIndex(0);
    setDisplayedText("");
    setIsTyping(true);
    setCompletedAt(0);
    setIsBubbleVisible(true);
    setIsBubbleFading(false);
    setMenuPosition(null);
    setIsMinimized(false);

    if (nextMessages[0].expression) {
      setExpression(nextMessages[0].expression);
    }
  }, []);

  const goToNextMessage = useCallback(() => {
    if (hasNextMessage) {
      const nextIndex = messageIndex + 1;
      setMessageIndex(nextIndex);
      setDisplayedText("");
      setIsTyping(true);
      setCompletedAt(0);

      if (messages[nextIndex]?.expression) {
        setExpression(messages[nextIndex].expression);
      }
    } else {
      setIsBubbleFading(true);
      window.setTimeout(() => {
        setIsBubbleVisible(false);
        setMessages([]);
        setDisplayedText("");
        setIsBubbleFading(false);
      }, 260);
    }
  }, [hasNextMessage, messageIndex, messages]);

  function finishCurrentMessage() {
    if (!currentMessage) {
      return;
    }

    setDisplayedText(currentMessage.text);
    setIsTyping(false);
    setCompletedAt(Date.now());
  }

  function handleBubbleClick() {
    if (!currentMessage) {
      return;
    }

    if (isTyping) {
      finishCurrentMessage();
      return;
    }

    if (Date.now() - completedAt < 500) {
      return;
    }

    goToNextMessage();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = input.trim();

    if (!text) {
      speak([{ text: "先写点想让我说的话吧。", expression: "calm" }]);
      return;
    }

    const matchedExpression =
      expressionByKeyword.find((item) => text.includes(item.keyword))?.expression ??
      "idle";

    speak([{ text, expression: matchedExpression }]);
    setInput("");
  }

  function handleContextMenu(event: MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    setMenuPosition({ x: event.clientX, y: event.clientY });
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) {
      return;
    }

    const target = event.target as HTMLElement;

    if (target.closest("button") || target.closest("input")) {
      return;
    }

    setIsDragging(true);
    dragOffset.current = {
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!isDragging) {
      return;
    }

    const nextX = clamp(event.clientX - dragOffset.current.x, 8, window.innerWidth - 170);
    const nextY = clamp(event.clientY - dragOffset.current.y, 8, window.innerHeight - 260);
    setPosition({ x: nextX, y: nextY });
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    setIsDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function cycleExpression() {
    const currentIndex = petAssets.findIndex((asset) => asset.key === expression);
    const nextAsset = petAssets[(currentIndex + 1) % petAssets.length];
    setExpression(nextAsset.key);
    speak([{ text: `现在是${nextAsset.label}表情。`, expression: nextAsset.key }]);
  }

  function resetPosition() {
    setPosition(getDefaultPosition());
    speak([{ text: "我回到右下角啦。", expression: "smal" }]);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      speak([{ text: "我在这里。右键我可以打开菜单。", expression: "smal" }]);
    }, 900);

    return () => window.clearTimeout(timer);
  }, [speak]);

  useEffect(() => {
    if (!currentMessage || !isTyping) {
      return;
    }

    const timer = window.setTimeout(() => {
      const nextText = currentMessage.text.slice(0, displayedText.length + 1);

      setDisplayedText(nextText);

      if (nextText.length >= currentMessage.text.length) {
        setIsTyping(false);
        setCompletedAt(Date.now());
      }
    }, 42);

    return () => window.clearTimeout(timer);
  }, [currentMessage, displayedText, isTyping]);

  useEffect(() => {
    if (!currentMessage || isTyping || !isBubbleVisible || isBubbleFading) {
      return;
    }

    const delay = hasNextMessage ? 2000 : 3000;
    const timer = window.setTimeout(goToNextMessage, delay);

    return () => window.clearTimeout(timer);
  }, [
    completedAt,
    currentMessage,
    hasNextMessage,
    isBubbleFading,
    isBubbleVisible,
    isTyping,
    goToNextMessage,
  ]);

  useEffect(() => {
    function closeMenu() {
      setMenuPosition(null);
    }

    window.addEventListener("click", closeMenu);
    window.addEventListener("scroll", closeMenu);

    return () => {
      window.removeEventListener("click", closeMenu);
      window.removeEventListener("scroll", closeMenu);
    };
  }, [speak]);

  if (isMinimized) {
    return (
      <button
        type="button"
        onClick={() => {
          setIsMinimized(false);
          speak([{ text: "我回来啦。", expression: "idle" }]);
        }}
        className="fixed bottom-4 right-4 z-50 rounded-full border border-white/15 bg-[#111827]/90 px-4 py-3 text-sm font-black text-white shadow-2xl shadow-black/40 backdrop-blur transition hover:bg-rose-500"
      >
        召回桌宠
      </button>
    );
  }

  return (
    <>
      <div
        className="fixed z-50 w-[150px] select-none sm:w-[178px]"
        style={{ left: position.x, top: position.y }}
        onContextMenu={handleContextMenu}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {isBubbleVisible && currentMessage ? (
          <button
            type="button"
            onClick={handleBubbleClick}
            className={`mb-2 w-64 max-w-[calc(100vw-2rem)] rounded-2xl border border-white/15 bg-[#111827]/92 px-4 py-3 text-left text-sm font-bold leading-6 text-white shadow-2xl shadow-black/40 backdrop-blur transition ${
              isBubbleFading ? "translate-y-1 opacity-0" : "opacity-100"
            }`}
            aria-label="桌宠对话框"
          >
            {displayedText}
            {isTyping ? <span className="ml-0.5 animate-pulse">|</span> : null}
          </button>
        ) : null}

        <div className="relative cursor-grab active:cursor-grabbing">
          <Image
            src={currentAsset.src}
            alt={`桌宠${currentAsset.label}状态`}
            width={395}
            height={525}
            className="pointer-events-none h-auto w-full drop-shadow-[0_18px_30px_rgba(0,0,0,0.55)]"
            draggable={false}
            unoptimized
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-1 flex gap-1 rounded-full border border-white/15 bg-[#111827]/88 p-1 shadow-xl shadow-black/30 backdrop-blur"
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="让角色说话..."
            className="min-w-0 flex-1 rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-950 outline-none placeholder:text-slate-400"
          />
          <button
            type="submit"
            className="rounded-full bg-rose-500 px-3 py-2 text-xs font-black text-white transition hover:bg-rose-400"
          >
            说
          </button>
        </form>
      </div>

      {menuPosition ? (
        <div
          className="fixed z-[60] w-40 overflow-hidden rounded-xl border border-white/15 bg-[#111827]/95 p-1 text-sm font-bold text-white shadow-2xl shadow-black/50 backdrop-blur"
          style={{ left: menuPosition.x, top: menuPosition.y }}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => speak([{ text: "你好呀，今天想看哪一本？", expression: "smal" }])}
            className="block w-full rounded-lg px-3 py-2 text-left hover:bg-white/10"
          >
            打招呼
          </button>
          <button
            type="button"
            onClick={() => speak(idleLines[Math.floor(Math.random() * idleLines.length)])}
            className="block w-full rounded-lg px-3 py-2 text-left hover:bg-white/10"
          >
            随机台词
          </button>
          <button
            type="button"
            onClick={cycleExpression}
            className="block w-full rounded-lg px-3 py-2 text-left hover:bg-white/10"
          >
            切换表情
          </button>
          <button
            type="button"
            onClick={resetPosition}
            className="block w-full rounded-lg px-3 py-2 text-left hover:bg-white/10"
          >
            回到角落
          </button>
          <button
            type="button"
            onClick={() => {
              setMenuPosition(null);
              setIsMinimized(true);
            }}
            className="block w-full rounded-lg px-3 py-2 text-left text-rose-200 hover:bg-white/10"
          >
            暂时隐藏
          </button>
        </div>
      ) : null}
    </>
  );
}
