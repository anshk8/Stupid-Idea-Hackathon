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
  onSelect: (option: ScenarioOption) => void;
  onCheck: () => void;
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
  onSelect,
  onCheck,
  onSpeak,
}: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] md:items-start md:gap-8">
      <aside className="rounded-2xl border-2 border-edge bg-snow p-5 md:sticky md:top-4">
        <p className="mb-2 text-xs font-extrabold tracking-[0.12em] text-ink-muted uppercase">
          Pronunciation
        </p>
        <p className="mb-4 font-display text-2xl font-extrabold text-ink">
          {phrase.frenchTranslation}
        </p>
        <HearPronunciationButton
          speaking={speaking}
          supported={supported}
          onClick={onSpeak}
          disabled={!solved}
        />
        <p className="mt-3 min-h-5 text-sm font-bold text-[#ff9600]" role="status">
          {!solved
            ? "Pick the right reply to unlock listen."
            : (error ?? "")}
        </p>
      </aside>

      <div>
        <p className="mb-2 text-sm font-extrabold tracking-[0.12em] text-ink-muted uppercase">
          Choose the best reply
        </p>
        <p className="mb-5 text-xl font-extrabold leading-snug text-ink">
          {phrase.scenario}
        </p>

        <ul className="mb-4 flex flex-col gap-3">
          {phrase.options!.map((option) => {
            const selected = selectedId === option.id;
            const isCorrect = option.tone === "mean";

            let styles =
              "border-edge bg-white hover:bg-snow";
            if (solved && isCorrect) {
              styles = "border-lingo bg-[#d7ffb8]";
            } else if (solved) {
              styles = "border-edge bg-white opacity-45";
            } else if (selected && feedback && !isCorrect) {
              styles = "border-wrong bg-[#ffdfe0]";
            } else if (selected) {
              styles = "border-duo-blue bg-[#ddf4ff] ring-2 ring-duo-blue/40";
            }

            return (
              <li key={option.id}>
                <button
                  type="button"
                  onClick={() => onSelect(option)}
                  disabled={solved}
                  aria-pressed={selected}
                  className={`w-full rounded-2xl border-2 border-b-4 px-4 py-3 text-left transition ${styles}`}
                >
                  <span className="block text-base font-extrabold text-ink">
                    {option.french}
                  </span>
                  <span className="mt-0.5 block text-sm font-bold text-ink-muted">
                    {option.english}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {feedback ? (
          <p
            className={`mb-3 rounded-2xl px-4 py-3 text-center text-sm font-extrabold ${
              solved
                ? "bg-[#d7ffb8] text-lingo-dark"
                : "bg-[#ffdfe0] text-wrong-dark"
            }`}
            role="status"
          >
            {feedback}
          </p>
        ) : null}

        {!solved ? (
          <button
            type="button"
            onClick={onCheck}
            disabled={!selectedId}
            className="btn-primary w-full"
          >
            Check
          </button>
        ) : null}
      </div>
    </div>
  );
}
