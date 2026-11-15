"use client";

type Props = {
  onRestart: () => void;
};

export function LessonComplete({ onRestart }: Props) {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-lg flex-col items-center justify-center px-5 py-12">
      <div className="w-full rounded-3xl border-2 border-ink/10 bg-white p-8 text-center shadow-card animate-fade-up md:p-10">
        <p className="mb-3 text-5xl" aria-hidden>
          🎉
        </p>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-lingo-dark md:text-5xl">
          FÉLICITATIONS!
        </h1>
        <p className="mt-3 text-lg text-ink-muted">
          You have completed French Swearing 101!
        </p>

        <div className="my-8 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-lingo/15 px-3 py-4">
            <p className="font-display text-2xl font-extrabold text-lingo-dark">
              100%
            </p>
            <p className="text-xs font-bold tracking-wide text-ink-muted uppercase">
              French Fluency
            </p>
          </div>
          <div className="rounded-2xl bg-ink/5 px-3 py-4">
            <p className="font-display text-2xl font-extrabold text-ink">0%</p>
            <p className="text-xs font-bold tracking-wide text-ink-muted uppercase">
              Diplomatic Skills
            </p>
          </div>
        </div>

        <p className="mb-8 text-base leading-relaxed text-ink">
          Congratulations! You&apos;re now fluent in offending people in French.
        </p>

        <button type="button" onClick={onRestart} className="btn-primary w-full">
          Restart Lesson
        </button>
      </div>
    </main>
  );
}
