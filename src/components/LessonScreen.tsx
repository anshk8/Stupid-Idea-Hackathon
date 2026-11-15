"use client";

import { useEffect, useState } from "react";

import type { LessonPhrase, ScenarioOption } from "@/data/lessons";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

type Props = {
  phrase: LessonPhrase;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onHome: () => void;
};

function normalizeAnswer(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function LessonScreen({
  phrase,
  index,
  total,
  onPrev,
  onNext,
  onHome,
}: Props) {
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

  const progress = ((index + 1) / total) * 100;
  const isFirst = index === 0;
  const isScenario = Boolean(phrase.scenario && phrase.options?.length);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [solved, setSolved] = useState(!isScenario);

  const [spokenText, setSpokenText] = useState<{
    phraseId: number;
    text: string;
  } | null>(null);
  const [checkedAnswer, setCheckedAnswer] = useState<{
    phraseId: number;
    correct: boolean;
    response: string;
  } | null>(null);

  const hasSpokenAnswer = spokenText?.phraseId === phrase.id;
  const answerIsChecked = checkedAnswer?.phraseId === phrase.id;

  useEffect(() => {
    cancel();
    cancelRecognition();
    setSelectedId(null);
    setFeedback(null);
    setSolved(!Boolean(phrase.scenario && phrase.options?.length));
    setSpokenText(null);
    setCheckedAnswer(null);
  }, [phrase.id, phrase.scenario, phrase.options, cancel, cancelRecognition]);

  function handleOption(option: ScenarioOption) {
    if (solved) return;
    setSelectedId(option.id);

    if (option.tone === "mean") {
      setSolved(true);
      setFeedback("Correct!");
      speakFrench(phrase.frenchTranslation);
      return;
    }

    setFeedback(null);
  }

  const handleRecognition = async () => {
    cancel();
    setSpokenText(null);
    setCheckedAnswer(null);
    try {
      setSpokenText({ phraseId: phrase.id, text: await recognizeFrench() });
    } catch {
      // Hook exposes recognitionError for display.
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
      response: correct ? "Correct!" : "Not quite.",
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
        <div className="flex items-center gap-2">
          <p className="rounded-full bg-lingo/15 px-3 py-1 font-display text-sm font-bold text-lingo-dark">
            {index + 1}/{total}
          </p>
          <button
            type="button"
            onClick={onHome}
            className="rounded-full border-2 border-ink/10 bg-white px-3 py-1 font-display text-sm font-bold text-ink-muted transition hover:border-lingo hover:text-lingo-dark"
          >
            Menu
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

      <section className="flex flex-1 flex-col">
        <article className="rounded-3xl border-2 border-ink/10 bg-white p-6 shadow-card md:p-8">
          {isScenario ? (
            <ScenarioCard
              phrase={phrase}
              selectedId={selectedId}
              solved={solved}
              feedback={feedback}
              speaking={speaking}
              supported={supported}
              error={error}
              onOption={handleOption}
              onSpeak={() =>
                speaking ? cancel() : speakFrench(phrase.frenchTranslation)
              }
            />
          ) : (
            <VocabSpeakCard
              phrase={phrase}
              speaking={speaking}
              supported={supported}
              error={error}
              listening={listening}
              recognitionError={recognitionError}
              hasSpokenAnswer={hasSpokenAnswer}
              spokenText={hasSpokenAnswer ? spokenText.text : null}
              answerIsChecked={answerIsChecked}
              checkedCorrect={answerIsChecked ? checkedAnswer.correct : null}
              checkedResponse={answerIsChecked ? checkedAnswer.response : null}
              onSpeak={() =>
                speaking ? cancel() : speakFrench(phrase.frenchTranslation)
              }
              onRecognize={handleRecognition}
              onCheck={handleCheckAnswer}
              onCancelSpeak={cancel}
            />
          )}
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
          <button
            type="button"
            onClick={onNext}
            disabled={!solved}
            className="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {index + 1 >= total ? "Finish →" : "Next →"}
          </button>
        </div>
      </section>
    </main>
  );
}

function VocabSpeakCard({
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
}: {
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
  onCancelSpeak: () => void;
}) {
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

      <button
        type="button"
        onClick={onSpeak}
        disabled={!supported || listening}
        className="btn-speaker mx-auto mb-6 flex"
        aria-label={speaking ? "Stop pronunciation" : "Hear pronunciation"}
      >
        <span className="text-3xl" aria-hidden>
          {speaking ? "🔊" : "🔈"}
        </span>
        <span className="font-display text-lg font-bold">
          {speaking ? "Speaking…" : "Hear Pronunciation"}
        </span>
      </button>

      {error ? (
        <p className="mb-3 text-center text-sm text-amber-700" role="status">
          {error}
        </p>
      ) : null}
      {!supported ? (
        <p className="mb-3 text-center text-sm text-red-600" role="alert">
          French text-to-speech isn’t available here. Try Chrome or Safari.
        </p>
      ) : null}

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
          className="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
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

function ScenarioCard({
  phrase,
  selectedId,
  solved,
  feedback,
  speaking,
  supported,
  error,
  onOption,
  onSpeak,
}: {
  phrase: LessonPhrase;
  selectedId: string | null;
  solved: boolean;
  feedback: string | null;
  speaking: boolean;
  supported: boolean;
  error: string | null;
  onOption: (option: ScenarioOption) => void;
  onSpeak: () => void;
}) {
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
        <p className="mb-4 text-center text-sm font-bold text-lingo-dark" role="status">
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
          <button
            type="button"
            onClick={onSpeak}
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
        </>
      ) : null}
    </>
  );
}
