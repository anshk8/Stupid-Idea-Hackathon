"use client";

import { LESSON_SUBTITLE, LESSON_TITLE } from "@/data/lessons";

type Props = {
  onStart: () => void;
};

export function HomeScreen({ onStart }: Props) {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-lg flex-col items-center justify-center px-5 py-12">
      <div className="mb-10 text-center animate-fade-up">
        <p className="mb-2 text-4xl" aria-hidden>
          🤬
        </p>
        <h1 className="font-display text-5xl font-extrabold tracking-tight text-ink md:text-6xl">
          SwearLingo
        </h1>
        <p className="mt-3 font-sans text-lg text-ink-muted">
          Learn a new language by cussing!
        </p>
      </div>

      <article className="w-full rounded-3xl border-2 border-ink/10 bg-white p-6 shadow-card animate-fade-up delay-100 md:p-8">
        <div className="mb-4 flex items-center gap-3">
          <span className="text-4xl" aria-hidden>
            🇫🇷
          </span>
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">
              {LESSON_TITLE}
            </h2>
            <p className="mt-1 text-sm font-medium text-lingo">
              5 phrases · Beginner hostility
            </p>
          </div>
        </div>

        <p className="mb-6 text-base leading-relaxed text-ink-muted">
          {LESSON_SUBTITLE}
        </p>

        <button
          type="button"
          onClick={onStart}
          className="btn-primary w-full"
        >
          Start Lesson →
        </button>
      </article>
    </main>
  );
}
