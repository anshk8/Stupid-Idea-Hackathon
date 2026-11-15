"use client";

import Image from "next/image";

import { BrandLogo } from "@/components/BrandLogo";
import { LESSON_SUBTITLE, LESSON_TITLE } from "@/data/lessons";

type Props = {
  onStart: () => void;
};

const JOURNEY_METRICS = [
  { label: "Current streak", value: "3 days" },
  { label: "# of people learning more than you", value: "8,421,992" },
  { label: "# of mess ups while learning", value: "67" },
  {
    label: "Estimated days until fluency",
    value: "∞",
    note: "You're slower than most people. Not sure you'll make it to full fluency.",
  },
];

export function HomeScreen({ onStart }: Props) {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-5xl flex-col px-5 py-8 md:py-12">
      <header className="mb-8 flex flex-col items-center text-center md:mb-10 md:flex-row md:items-center md:gap-4 md:text-left">
        <BrandLogo size={88} priority className="mb-3 md:mb-0" />
        <div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink md:text-5xl">
            SwearLingo
          </h1>
          <p className="mt-1 text-base text-ink-muted md:text-lg">
            Profanity perfects Proficiency
          </p>
        </div>
      </header>

      <section className="mb-6 rounded-3xl border-2 border-ink/10 bg-white p-5 shadow-card animate-fade-up md:mb-8 md:p-6">
        <p className="mb-3 text-xs font-bold tracking-[0.18em] text-lingo-dark uppercase">
          Highlight of today
        </p>
        <div className="flex items-center gap-4">
          <Image
            src="/jensen.png"
            alt="Jensen Huang"
            width={88}
            height={88}
            className="h-20 w-20 shrink-0 rounded-2xl object-cover object-top"
          />
          <div className="min-w-0">
            <p className="font-display text-lg font-bold text-ink md:text-xl">
              # of affairs Jensen Huang had this week:{" "}
              <span className="text-lingo-dark">3 and counting…</span>
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              Unrelated, but we thought you should know.
            </p>
          </div>
        </div>
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
                <div className="min-w-0">
                  <p className="text-sm font-bold text-ink">{metric.label}</p>
                  {"note" in metric && metric.note ? (
                    <p className="mt-0.5 text-xs text-ink-muted">{metric.note}</p>
                  ) : null}
                </div>
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

          <button type="button" onClick={onStart} className="btn-primary w-full">
            Start Lesson →
          </button>
        </article>
      </div>
    </main>
  );
}
