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
    <>
      <p className="mb-4 text-center text-sm font-bold tracking-wide text-ink-muted uppercase">
        How do you say this in French?
      </p>

      <p className="mb-5 text-center font-display text-3xl font-extrabold leading-tight text-ink md:text-4xl">
        {phrase.englishPhrase}
      </p>

      <div className="mb-5 rounded-2xl bg-cream px-4 py-5 text-center">
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
        disabled={listening}
        onClick={onSpeak}
        className="btn-speaker mx-auto flex"
      />
      <button
        type="button"
        onClick={() => window.alert("no")}
        className="mx-auto mt-2 mb-6 block text-sm font-semibold text-ink-muted underline decoration-dotted underline-offset-4 hover:text-ink"
      >
        Slower please
      </button>

      <p
        className={`mb-3 min-h-5 text-center text-sm ${
          !supported ? "text-red-600" : "text-amber-700"
        }`}
        role={!supported ? "alert" : "status"}
      >
        {!supported
          ? "French text-to-speech isn’t available here. Try Chrome or Safari."
          : (error ?? "")}
      </p>

      <div className="mb-4 rounded-2xl border-2 border-ink/10 px-4 py-4 text-center">
        <p className="mb-1 text-xs font-bold tracking-wide text-ink-muted uppercase">
          Your spoken attempt
        </p>
        <p
          className={`font-display text-xl font-bold md:text-2xl ${
            answerIsChecked
              ? checkedCorrect
                ? "text-lingo-dark"
                : "text-red-600"
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

      {answerIsChecked ? (
        <p
          className={`mb-4 text-center font-bold ${
            checkedCorrect ? "text-lingo-dark" : "text-red-600"
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
          {listening ? "Listening…" : "🎙️ Speak it"}
        </button>
        <button
          type="button"
          onClick={onCheck}
          disabled={!hasSpokenAnswer || listening}
          className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Check answer
        </button>
      </div>

      {recognitionError ? (
        <p className="mt-3 text-center text-sm text-amber-700" role="alert">
          {recognitionError}
        </p>
      ) : null}
    </>
  );
}
