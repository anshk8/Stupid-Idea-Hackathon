"use client";

import { BrandLogo } from "@/components/BrandLogo";

type Props = {
  index: number;
  total: number;
  progress: number;
  onHome: () => void;
};

export function LessonHeader({ index, total, progress, onHome }: Props) {
  return (
    <header className="mb-6 flex items-center gap-3">
      <button
        type="button"
        onClick={onHome}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-2xl font-bold text-ink-muted transition hover:bg-snow"
        aria-label="Close lesson"
      >
        ×
      </button>

      <div
        className="h-4 flex-1 overflow-hidden rounded-full bg-edge"
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

      <BrandLogo size={56} className="shrink-0" />
    </header>
  );
}
