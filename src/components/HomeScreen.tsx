"use client";

import { useEffect, useRef, useState } from "react";

import { LESSON_SUBTITLE, LESSON_TITLE } from "@/data/lessons";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

type Props = {
  onStart: () => void;
};

const JOURNEY_METRICS = [
  { label: "Current streak", value: "3 days" },
  { label: "# of people learning more than you", value: "8,421,992" },
  { label: "# of mess ups while learning", value: "47" },
];

const SPEAK_BUTTON_SPEED = 300;

export function HomeScreen({ onStart }: Props) {
  const { recognizeEnglish, cancelRecognition, listening, recognitionError } =
    useSpeechSynthesis();
  const [promptOpen, setPromptOpen] = useState(false);
  const [promptFeedback, setPromptFeedback] = useState<string | null>(null);
  const speakButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!promptOpen) return;

    const button = speakButtonRef.current;
    if (!button) return;

    const margin = 16;
    let x = margin;
    let y = margin;
    const angle = Math.random() * Math.PI * 2;
    let velocityX = Math.cos(angle) * SPEAK_BUTTON_SPEED;
    let velocityY = Math.sin(angle) * SPEAK_BUTTON_SPEED;
    let previousTime = 0;
    let frameId = 0;

    button.style.left = `${x}px`;
    button.style.top = `${y}px`;

    const animate = (time: number) => {
      if (previousTime === 0) previousTime = time;
      const elapsed = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;

      const maxX = Math.max(
        margin,
        window.innerWidth - button.offsetWidth - margin,
      );
      const maxY = Math.max(
        margin,
        window.innerHeight - button.offsetHeight - margin,
      );

      x += velocityX * elapsed;
      y += velocityY * elapsed;

      if (x <= margin || x >= maxX) {
        x = Math.max(margin, Math.min(x, maxX));
        velocityX *= -1;
      }
      if (y <= margin || y >= maxY) {
        y = Math.max(margin, Math.min(y, maxY));
        velocityY *= -1;
      }

      button.style.left = `${x}px`;
      button.style.top = `${y}px`;
      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [promptOpen]);

  const startSpeakingPrompt = async () => {
    setPromptFeedback(null);
    try {
      const transcript = await recognizeEnglish();
      const normalized = transcript
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim();

      if (normalized === "phuc yea") {
        setPromptOpen(false);
        onStart();
      } else {
        setPromptFeedback(`We heard “${transcript}”. Try saying “fuck yeah!”`);
      }
    } catch {
      // The hook exposes recognition errors for display.
    }
  };

  return (
    <>
      <main className="mx-auto flex min-h-full w-full max-w-5xl flex-col px-5 py-8 md:py-12">
        <header className="mb-8 text-center md:mb-10 md:text-left">
          <p className="mb-1 text-3xl md:hidden" aria-hidden>
            🤬
          </p>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink md:text-5xl">
            SwearLingo
          </h1>
          <p className="mt-1 text-base text-ink-muted md:text-lg">
            Learn a new language by cussing!
          </p>
        </header>

        <section className="mb-6 rounded-3xl border-2 border-ink/10 bg-white p-5 shadow-card animate-fade-up md:mb-8 md:p-6">
          <p className="mb-2 text-xs font-bold tracking-[0.18em] text-lingo-dark uppercase">
            Highlight of today
          </p>
          <p className="font-display text-lg font-bold text-ink md:text-xl">
            # of affairs Jensen Huang had this week:{" "}
            <span className="text-lingo-dark">3 and counting…</span>
          </p>
        </section>

        <div className="grid flex-1 gap-6 md:grid-cols-2 md:items-start lg:gap-8">
          <section className="rounded-3xl border-2 border-ink/10 bg-white p-5 shadow-card animate-fade-up delay-100 md:p-6">
            <h2 className="font-display text-2xl font-extrabold text-ink">
              Your learning journey
            </h2>

            <ul className="mt-5 divide-y divide-ink/10">
              {JOURNEY_METRICS.map((metric) => (
                <li
                  key={metric.label}
                  className="flex items-baseline justify-between gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <p className="min-w-0 text-sm font-bold text-ink">
                    {metric.label}
                  </p>
                  <p className="shrink-0 font-display text-2xl font-extrabold tabular-nums text-lingo-dark">
                    {metric.value}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <article className="rounded-3xl border-2 border-ink/10 bg-white p-6 shadow-card animate-fade-up delay-100 md:p-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="text-4xl" aria-hidden>
                🇫🇷
              </span>
              <div>
                <h2 className="font-display text-2xl font-bold text-ink">
                  {LESSON_TITLE}
                </h2>
                <p className="mt-1 text-sm font-medium text-lingo">5 phrases</p>
              </div>
            </div>

            <p className="mb-6 text-base leading-relaxed text-ink-muted">
              {LESSON_SUBTITLE}
            </p>

            <button
              type="button"
              onClick={() => {
                setPromptFeedback(null);
                setPromptOpen(true);
              }}
              className="btn-primary w-full"
            >
              Start Lesson →
            </button>
          </article>
        </div>
      </main>

      {promptOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 px-5 py-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="speaking-prompt-title"
        >
          <section className="relative w-full max-w-xl rounded-3xl border-2 border-ink/10 bg-white p-6 text-center shadow-card md:p-8">
            <button
              type="button"
              onClick={() => {
                cancelRecognition();
                setPromptOpen(false);
              }}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-2xl leading-none text-ink-muted transition hover:bg-cream hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lingo-dark"
              aria-label="Close prompt"
            >
              ×
            </button>
            <p className="text-5xl" aria-hidden>
              🎤
            </p>
            <h2
              id="speaking-prompt-title"
              className="mt-4 font-display text-2xl font-extrabold text-ink md:text-3xl"
            >
              To get started, say:
            </h2>
            <p className="mt-2 font-display text-3xl font-extrabold text-lingo-dark md:text-4xl">
              “Fuck yeah!”
            </p>
            {recognitionError || promptFeedback ? (
              <p
                className="mt-3 text-sm font-semibold text-red-600"
                role="alert"
              >
                {promptFeedback ?? recognitionError}
              </p>
            ) : null}
            <button
              type="button"
              onClick={() => {
                cancelRecognition();
                setPromptOpen(false);
                onStart();
              }}
              className="mt-3 text-sm font-semibold text-ink-muted underline underline-offset-4 hover:text-ink"
            >
              I don't want to
            </button>
          </section>
          <button
            ref={speakButtonRef}
            type="button"
            onClick={startSpeakingPrompt}
            disabled={listening}
            className="btn-primary fixed z-10 whitespace-nowrap disabled:cursor-wait"
            style={{ left: 16, top: 16 }}
          >
            {listening ? "Listening…" : "🎙️ Start speaking"}
          </button>
        </div>
      ) : null}
    </>
  );
}
