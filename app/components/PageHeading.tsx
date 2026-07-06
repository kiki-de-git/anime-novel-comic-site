type PageHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHeading({ eyebrow, title, description }: PageHeadingProps) {
  return (
    <div className="border-b border-white/10 pb-5">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-rose-500">
        {eyebrow}
      </p>
      <h1 className="mt-2 text-4xl font-black leading-tight tracking-normal text-white sm:text-5xl">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
        {description}
      </p>
    </div>
  );
}
