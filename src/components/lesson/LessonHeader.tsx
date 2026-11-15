"use client";

type Props = {
  index: number;
  total: number;
  progress: number;
  onHome: () => void;
};

export function LessonHeader({ index, total, progress, onHome }: Props) {
  return (
    <>
      <header className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="font-display text-xl font-extrabold text-ink">
            SwearLingo
          </p>
          <p className="text-sm text-ink-muted">🇫🇷 French Swearing 101</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="rounded-full bg-lingo/15 px-3 py-1 font-display text-sm font-bold text-lingo-dark">
            {index + 1}/{total}
          </p>
          <button
            type="button"
            onClick={onHome}
            className="rounded-full border-2 border-ink/10 bg-white px-3 py-1 font-display text-sm font-bold text-ink-muted transition hover:border-lingo hover:text-lingo-dark"
          >
            Home
          </button>
        </div>
      </header>

      <div
        className="mb-6 h-3 w-full overflow-hidden rounded-full bg-ink/10"
        role="progressbar"
        aria-valuenow={index + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label="Lesson progress"
      >
        <div
          className="h-full rounded-full bg-lingo transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </>
  );
}
