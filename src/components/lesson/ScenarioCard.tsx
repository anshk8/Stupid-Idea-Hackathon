"use client";

import type { LessonPhrase, ScenarioOption } from "@/data/lessons";

import { HearPronunciationButton } from "./HearPronunciationButton";

type Props = {
  phrase: LessonPhrase;
  selectedId: string | null;
  solved: boolean;
  feedback: string | null;
  speaking: boolean;
  supported: boolean;
  error: string | null;
  onOption: (option: ScenarioOption) => void;
  onSpeak: () => void;
};

export function ScenarioCard({
  phrase,
  selectedId,
  solved,
  feedback,
  speaking,
  supported,
  error,
  onOption,
  onSpeak,
}: Props) {
  return (
    <>
      <p className="mb-2 text-center text-xs font-bold tracking-wide text-lingo-dark uppercase">
        Real-life scenario
      </p>
      <p className="mb-5 text-center text-base leading-relaxed text-ink-muted md:text-lg">
        {phrase.scenario}
      </p>

      <ul className="mb-5 flex flex-col gap-3">
        {phrase.options!.map((option) => {
          const selected = selectedId === option.id;
          const isCorrect = option.tone === "mean";
          let styles =
            "border-ink/15 bg-white hover:border-lingo hover:bg-cream";

          if (solved && isCorrect) {
            styles = "border-lingo bg-lingo/15 text-lingo-dark";
          } else if (selected && !isCorrect) {
            styles = "border-amber-400 bg-amber-50";
          } else if (solved) {
            styles = "border-ink/10 bg-ink/5 opacity-50";
          }

          return (
            <li key={option.id}>
              <button
                type="button"
                onClick={() => onOption(option)}
                disabled={solved}
                className={`w-full rounded-2xl border-2 px-4 py-3 text-left transition ${styles}`}
              >
                <span className="block font-display text-base font-bold md:text-lg">
                  {option.french}
                </span>
                <span className="mt-0.5 block text-sm font-semibold text-ink-muted">
                  {option.english}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {feedback ? (
        <p
          className="mb-4 text-center text-sm font-bold text-lingo-dark"
          role="status"
        >
          {feedback}
        </p>
      ) : null}

      {solved ? (
        <>
          <div className="mb-6 rounded-2xl bg-cream px-4 py-5 text-center animate-fade-up">
            <p className="mb-1 text-xs font-bold tracking-wide text-ink-muted uppercase">
              French
            </p>
            <p className="font-display text-2xl font-bold text-lingo-dark md:text-3xl">
              {phrase.frenchTranslation}
            </p>
          </div>
          <HearPronunciationButton
            speaking={speaking}
            supported={supported}
            onClick={onSpeak}
          />
          {error ? (
            <p className="mt-3 text-center text-sm text-amber-700" role="status">
              {error}
            </p>
          ) : null}
        </>
      ) : null}
    </>
  );
}
