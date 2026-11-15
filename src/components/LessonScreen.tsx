"use client";

import { useEffect } from "react";

import type { LessonPhrase } from "@/data/lessons";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

type Props = {
  phrase: LessonPhrase;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
};

export function LessonScreen({
  phrase,
  index,
  total,
  onPrev,
  onNext,
}: Props) {
  const { speakFrench, cancel, speaking, supported, error } =
    useSpeechSynthesis();
  const progress = ((index + 1) / total) * 100;
  const isFirst = index === 0;

  useEffect(() => {
    cancel();
  }, [phrase.id, cancel]);

  return (
    <main className="mx-auto flex min-h-full w-full max-w-lg flex-col px-5 py-6 md:py-10">
      <header className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="font-display text-xl font-extrabold text-ink">
            SwearLingo
          </p>
          <p className="text-sm text-ink-muted">🇫🇷 French Swearing 101</p>
        </div>
        <p className="rounded-full bg-lingo/15 px-3 py-1 font-display text-sm font-bold text-lingo-dark">
          {index + 1}/{total}
        </p>
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

      <section className="flex flex-1 flex-col">
        <article className="rounded-3xl border-2 border-ink/10 bg-white p-6 shadow-card md:p-8">
          <p className="mb-4 text-center text-sm font-bold tracking-wide text-ink-muted uppercase">
            How do you say this in French?
          </p>

          <p className="mb-6 text-center font-display text-3xl font-extrabold leading-tight text-ink md:text-4xl">
            {phrase.englishPhrase}
          </p>

          <div className="mb-8 rounded-2xl bg-cream px-4 py-5 text-center">
            <p className="mb-1 text-xs font-bold tracking-wide text-ink-muted uppercase">
              French
            </p>
            <p className="font-display text-2xl font-bold text-lingo-dark md:text-3xl">
              {phrase.frenchTranslation}
            </p>
          </div>

          <button
            type="button"
            onClick={() => speakFrench(phrase.frenchTranslation)}
            disabled={!supported}
            className="btn-speaker mx-auto flex"
            aria-label="Hear pronunciation"
          >
            <span className="text-3xl" aria-hidden>
              {speaking ? "🔊" : "🔈"}
            </span>
            <span className="font-display text-lg font-bold">
              {speaking ? "Speaking…" : "Hear Pronunciation"}
            </span>
          </button>

          {error ? (
            <p className="mt-3 text-center text-sm text-amber-700" role="status">
              {error}
            </p>
          ) : null}
          {!supported ? (
            <p className="mt-3 text-center text-sm text-red-600" role="alert">
              French text-to-speech isn’t available here. Try Chrome or Safari.
            </p>
          ) : null}
        </article>

        <div className="mt-auto flex gap-3 pt-8 pb-2">
          <button
            type="button"
            onClick={onPrev}
            disabled={isFirst}
            className="btn-secondary flex-1"
          >
            ← Previous
          </button>
          <button type="button" onClick={onNext} className="btn-primary flex-1">
            {index + 1 >= total ? "Finish →" : "Next →"}
          </button>
        </div>
      </section>
    </main>
  );
}
