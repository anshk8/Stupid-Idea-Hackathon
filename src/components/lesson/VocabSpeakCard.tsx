"use client";

import type { LessonPhrase } from "@/data/lessons";

import { HearPronunciationButton } from "./HearPronunciationButton";

type Props = {
  phrase: LessonPhrase;
  speaking: boolean;
  supported: boolean;
  error: string | null;
  listening: boolean;
  recognitionError: string | null;
  hasSpokenAnswer: boolean;
  spokenText: string | null;
  answerIsChecked: boolean;
  checkedCorrect: boolean | null;
  checkedResponse: string | null;
  onSpeak: () => void;
  onRecognize: () => void;
  onCheck: () => void;
};

export function VocabSpeakCard({
  phrase,
  speaking,
  supported,
  error,
  listening,
  recognitionError,
  hasSpokenAnswer,
  spokenText,
  answerIsChecked,
  checkedCorrect,
  checkedResponse,
  onSpeak,
  onRecognize,
  onCheck,
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
          disabled={listening}
          onClick={onSpeak}
        />
        <button
          type="button"
          onClick={() => window.alert("no")}
          className="mt-3 block text-sm font-extrabold text-duo-blue underline underline-offset-4"
        >
          Slower please
        </button>
        <p
          className={`mt-3 min-h-5 text-sm font-bold ${
            !supported ? "text-wrong" : "text-[#ff9600]"
          }`}
          role={!supported ? "alert" : "status"}
        >
          {!supported
            ? "Speech isn’t available here. Try Chrome or Safari."
            : (error ?? "")}
        </p>
      </aside>

      <div>
        <p className="mb-2 text-sm font-extrabold tracking-[0.12em] text-ink-muted uppercase">
          Say this in French
        </p>
        <p className="mb-5 text-3xl font-extrabold leading-tight text-ink">
          {phrase.englishPhrase}
        </p>

        <div
          className={`mb-4 rounded-2xl border-2 px-4 py-4 ${
            answerIsChecked
              ? checkedCorrect
                ? "border-lingo bg-[#d7ffb8]"
                : "border-wrong bg-[#ffdfe0]"
              : "border-edge bg-white"
          }`}
        >
          <p className="mb-1 text-xs font-extrabold tracking-[0.12em] text-ink-muted uppercase">
            Your answer
          </p>
          <p
            className={`text-xl font-extrabold ${
              answerIsChecked
                ? checkedCorrect
                  ? "text-lingo-dark"
                  : "text-wrong-dark"
                : "text-ink"
            }`}
          >
            {hasSpokenAnswer
              ? spokenText
              : listening
                ? "Listening…"
                : "Tap speak, then say the French phrase."}
          </p>
        </div>

        {answerIsChecked && checkedResponse ? (
          <p
            className={`mb-4 text-center text-sm font-extrabold ${
              checkedCorrect ? "text-lingo-dark" : "text-wrong-dark"
            }`}
            role="status"
          >
            {checkedResponse}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onRecognize}
            disabled={listening}
            className="btn-secondary flex-1"
          >
            {listening ? "Listening…" : "Speak"}
          </button>
          <button
            type="button"
            onClick={onCheck}
            disabled={!hasSpokenAnswer || listening}
            className="btn-primary flex-1"
          >
            Check
          </button>
        </div>

        {recognitionError ? (
          <p
            className="mt-3 text-center text-sm font-bold text-[#ff9600]"
            role="alert"
          >
            {recognitionError}
          </p>
        ) : null}
      </div>
    </div>
  );
}
