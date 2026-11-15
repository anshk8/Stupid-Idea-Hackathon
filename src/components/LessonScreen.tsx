"use client";

import { useEffect, useState } from "react";

import type { LessonPhrase } from "@/data/lessons";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

type Props = {
  phrase: LessonPhrase;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
};

const incorrectAnswerResponses = [
  "That answer took a wrong turn at the Eiffel Tower.",
  "The French dictionary just sighed.",
  "Bold attempt. The pronunciation had other plans.",
  "A baguette somewhere just snapped in half.",
  "That was French-ish. The dictionary disagrees.",
];

function normalizeAnswer(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function LessonScreen({ phrase, index, total, onPrev, onNext }: Props) {
  const {
    speakFrench,
    cancel,
    speaking,
    supported,
    error,
    recognizeFrench,
    cancelRecognition,
    listening,
    recognitionError,
  } = useSpeechSynthesis();
  const [spokenText, setSpokenText] = useState<{
    phraseId: number;
    text: string;
  } | null>(null);
  const [checkedAnswer, setCheckedAnswer] = useState<{
    phraseId: number;
    correct: boolean;
    response: string;
  } | null>(null);
  const progress = ((index + 1) / total) * 100;
  const isFirst = index === 0;
  const hasSpokenAnswer = spokenText?.phraseId === phrase.id;
  const answerIsChecked = checkedAnswer?.phraseId === phrase.id;

  useEffect(() => {
    cancel();
    cancelRecognition();
  }, [phrase.id, cancel, cancelRecognition]);

  const handleRecognition = async () => {
    setSpokenText(null);
    setCheckedAnswer(null);
    try {
      setSpokenText({ phraseId: phrase.id, text: await recognizeFrench() });
    } catch {
      // The hook exposes recognition errors for display.
    }
  };

  const handleCheckAnswer = () => {
    if (!hasSpokenAnswer || !spokenText) return;

    const correct =
      normalizeAnswer(spokenText.text) ===
      normalizeAnswer(phrase.frenchTranslation);

    setCheckedAnswer({
      phraseId: phrase.id,
      correct,
      response: correct
        ? "Correct!"
        : incorrectAnswerResponses[
            Math.floor(Math.random() * incorrectAnswerResponses.length)
          ],
    });
  };

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
            Say this phrase in French:
          </p>

          <p className="mb-6 text-center font-display text-3xl font-extrabold leading-tight text-ink md:text-4xl">
            {phrase.englishPhrase}
          </p>

          <div className="mb-4 rounded-2xl bg-cream px-4 py-5 text-center">
            <p className="mb-1 text-xs font-bold tracking-wide text-ink-muted uppercase">
              Your answer
            </p>
            <p
              className={`font-display text-2xl font-bold md:text-3xl ${
                answerIsChecked
                  ? checkedAnswer.correct
                    ? "text-lingo-dark"
                    : "text-red-600"
                  : "text-ink"
              }`}
            >
              {hasSpokenAnswer
                ? spokenText.text
                : listening
                  ? "Listening…"
                  : "Your spoken answer will appear here."}
            </p>
          </div>

          {hasSpokenAnswer && !answerIsChecked ? (
            <button
              type="button"
              onClick={handleCheckAnswer}
              className="btn-primary mx-auto flex"
            >
              Check answer
            </button>
          ) : null}
          {answerIsChecked ? (
            <p
              className={`text-center font-bold ${
                checkedAnswer.correct ? "text-lingo-dark" : "text-red-600"
              }`}
              role="status"
            >
              {checkedAnswer.response}
            </p>
          ) : null}
          {answerIsChecked ? (
            <div className="mb-8 rounded-2xl bg-cream px-4 py-5 text-center">
              <div className="mb-1 flex items-center justify-center gap-2">
                <p className="text-xs font-bold tracking-wide text-ink-muted uppercase">
                  Correct answer
                </p>
                <button
                  type="button"
                  onClick={() =>
                    speaking ? cancel() : speakFrench(phrase.frenchTranslation)
                  }
                  disabled={!supported}
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lingo-dark disabled:cursor-not-allowed disabled:opacity-40 ${
                    speaking
                      ? "bg-lingo text-white"
                      : "text-ink hover:bg-lingo/20"
                  }`}
                  aria-label={
                    speaking ? "Stop pronunciation" : "Hear pronunciation"
                  }
                  aria-pressed={speaking}
                >
                  <span className="text-lg" aria-hidden>
                    {speaking ? "🔊" : "🔈"}
                  </span>
                </button>
              </div>
              <p className="font-display text-2xl font-bold text-lingo-dark md:text-3xl">
                {phrase.frenchTranslation}
              </p>
            </div>
          ) : null}

          {error ? (
            <p
              className="mt-3 text-center text-sm text-amber-700"
              role="status"
            >
              {error}
            </p>
          ) : null}
          {!supported ? (
            <p className="mt-3 text-center text-sm text-red-600" role="alert">
              French text-to-speech isn’t available here. Try Chrome or Safari.
            </p>
          ) : null}

          <button
            type="button"
            onClick={handleRecognition}
            disabled={listening}
            className="btn-secondary mx-auto mt-5 flex"
          >
            {listening ? "Listening…" : "🎙️ Speak your answer"}
          </button>

          {recognitionError ? (
            <p className="mt-3 text-center text-sm text-amber-700" role="alert">
              {recognitionError}
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
