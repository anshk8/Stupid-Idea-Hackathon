"use client";

import { useEffect, useState } from "react";

import { LessonHeader } from "@/components/lesson/LessonHeader";
import { LessonNav } from "@/components/lesson/LessonNav";
import { ScenarioCard } from "@/components/lesson/ScenarioCard";
import { VocabSpeakCard } from "@/components/lesson/VocabSpeakCard";
import type { LessonPhrase, ScenarioOption } from "@/data/lessons";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { normalizeAnswer } from "@/lib/normalizeAnswer";

type Props = {
  phrase: LessonPhrase;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onHome: () => void;
};

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

    const correctAnswerResponses = [
      "Wow 1/3 chance you just guessed but congrats I guess.",
      "Thank god we can finally move on.",
    ];

    if (option.tone === "mean") {
      setSolved(true);
      setFeedback(
        correctAnswerResponses[
          Math.floor(Math.random() * correctAnswerResponses.length)
        ],
      );
      speakFrench(phrase.frenchTranslation);
      return;
    }

    setFeedback(null);
  }

  async function handleRecognition() {
    cancel();
    setSpokenText(null);
    setCheckedAnswer(null);
    try {
      setSpokenText({ phraseId: phrase.id, text: await recognizeFrench() });
    } catch {
      // Hook exposes recognitionError for display.
    }
  }

  function handleCheckAnswer() {
    if (!hasSpokenAnswer || !spokenText) return;

    const correct =
      normalizeAnswer(spokenText.text) ===
      normalizeAnswer(phrase.frenchTranslation);

    const incorrectAnswerResponses = [
      "is you dumb?",
      "bro lock in.",
      "ok like are we even trying at this point?",
      "somewhere a baguette is crying.",
      "holey moley you're bad at french dawg.",
      "you think i'm a joke huh? come back when you're ready to get serious chienne.",
    ];

    setCheckedAnswer({
      phraseId: phrase.id,
      correct,
      response: correct
        ? "Finally."
        : incorrectAnswerResponses[
            Math.floor(Math.random() * incorrectAnswerResponses.length)
          ],
    });
  }

  function toggleSpeak() {
    if (speaking) cancel();
    else speakFrench(phrase.frenchTranslation);
  }

  return (
    <main className="mx-auto flex min-h-full w-full max-w-lg flex-col px-5 py-6 md:py-10">
      <LessonHeader
        index={index}
        total={total}
        progress={progress}
        onHome={onHome}
      />

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
              onSpeak={toggleSpeak}
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
              onSpeak={toggleSpeak}
              onRecognize={handleRecognition}
              onCheck={handleCheckAnswer}
            />
          )}
        </article>

        <LessonNav
          isFirst={isFirst}
          isLast={index + 1 >= total}
          canNext={solved}
          onPrev={onPrev}
          onNext={onNext}
        />
      </section>
    </main>
  );
}
