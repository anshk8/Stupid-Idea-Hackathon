"use client";

import Image from "next/image";

import { BrandLogo } from "@/components/BrandLogo";
import { LESSON_SUBTITLE, LESSON_TITLE } from "@/data/lessons";

type Props = {
  onStart: () => void;
};

const JOURNEY_METRICS = [
  { label: "Current streak", value: "3 days" },
  { label: "People learning more than you", value: "8,421,992" },
  { label: "Mess ups while learning", value: "67" },
  {
    label: "Days until fluency",
    value: "∞",
    note: "You're slower than most people. Not sure you'll make it.",
  },
];

const COURSES = [
  {
    id: "fr",
    section: "Section 1, Unit 1",
    title: LESSON_TITLE,
    subtitle: LESSON_SUBTITLE,
    flag: "🇫🇷",
    meta: "5 phrases · ~3 min",
    headerClass: "bg-lingo",
    ringClass: "border-lingo bg-[#d7ffb8]",
    active: true,
  },
  {
    id: "de",
    section: "Section 1, Unit 1",
    title: "German Swearing 101",
    subtitle: "Essential insults for when politeness fails in Berlin.",
    flag: "🇩🇪",
    meta: "Coming soon",
    headerClass: "bg-[#ce82ff]",
    ringClass: "border-[#ce82ff] bg-[#f2dfff]",
    active: false,
  },
  {
    id: "ar",
    section: "Section 1, Unit 1",
    title: "Arabic Swearing 101",
    subtitle: "Learn the phrases textbooks refuse to print.",
    flag: "🇸🇦",
    meta: "Coming soon",
    headerClass: "bg-[#ff9600]",
    ringClass: "border-[#ff9600] bg-[#fff0d4]",
    active: false,
  },
] as const;

export function HomeScreen({ onStart }: Props) {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-5xl flex-col px-5 py-6">
      <header className="mb-6 flex items-center justify-between gap-3 border-b-2 border-edge pb-4">
        <div className="flex items-center gap-3">
          <BrandLogo size={72} priority />
          <div>
            <p className="font-display text-2xl font-extrabold tracking-tight text-lingo md:text-3xl">
              SwearLingo
            </p>
            <p className="text-sm font-bold text-ink-muted md:text-base">
              Profanity perfects Proficiency
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm font-extrabold">
          <span className="text-[#ff9600]">🔥 3</span>
          <span className="text-duo-blue">⚡ 0</span>
          <span className="text-[#ff4b4b]">❤️ 5</span>
        </div>
      </header>

      <div className="grid flex-1 gap-5 md:grid-cols-2 md:items-start">
        <div className="flex flex-col gap-5">
          <section className="rounded-2xl border-2 border-edge border-b-4 bg-white p-4">
            <p className="mb-3 text-xs font-extrabold tracking-[0.14em] text-ink-muted uppercase">
              Highlight of today
            </p>
            <div className="flex items-center gap-3">
              <Image
                src="/jensen.png"
                alt="Jensen Huang"
                width={56}
                height={56}
                className="h-14 w-14 shrink-0 rounded-xl object-cover object-top"
              />
              <div className="min-w-0">
                <p className="font-extrabold text-ink">
                  Jensen Huang affairs this week:{" "}
                  <span className="text-lingo-dark">3…</span>
                </p>
                <p className="mt-0.5 text-sm font-semibold text-ink-muted">
                  Unrelated. We thought you should know.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border-2 border-edge border-b-4 bg-white p-4">
            <p className="mb-1 text-xs font-extrabold tracking-[0.14em] text-ink-muted uppercase">
              Your stats
            </p>
            <ul>
              {JOURNEY_METRICS.map((metric) => (
                <li
                  key={metric.label}
                  className="flex items-start justify-between gap-4 border-b-2 border-edge py-3 last:border-b-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-ink">{metric.label}</p>
                    {"note" in metric && metric.note ? (
                      <p className="mt-0.5 text-xs font-semibold text-ink-muted">
                        {metric.note}
                      </p>
                    ) : null}
                  </div>
                  <p className="shrink-0 font-display text-xl font-extrabold tabular-nums text-ink">
                    {metric.value}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="flex flex-col gap-5">
          {COURSES.map((course) => (
            <section
              key={course.id}
              className="overflow-hidden rounded-2xl border-2 border-edge border-b-4"
            >
              <div className={`${course.headerClass} px-5 py-4 text-white`}>
                <p className="text-xs font-extrabold tracking-[0.14em] uppercase opacity-90">
                  {course.section}
                </p>
                <h2 className="mt-1 font-display text-2xl font-extrabold">
                  {course.title}
                </h2>
                <p className="mt-1 text-sm font-semibold text-white/90">
                  {course.subtitle}
                </p>
              </div>
              <div className="flex flex-col items-center gap-4 bg-white px-5 py-6">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full border-4 ${course.ringClass}`}
                >
                  <span className="text-3xl" aria-hidden>
                    {course.flag}
                  </span>
                </div>
                {course.active ? (
                  <button
                    type="button"
                    onClick={onStart}
                    className="btn-primary w-full max-w-xs"
                  >
                    Start
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="btn-primary w-full max-w-xs"
                    aria-disabled="true"
                  >
                    Start
                  </button>
                )}
                <p className="text-xs font-bold tracking-wide text-ink-muted uppercase">
                  {course.meta}
                </p>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
