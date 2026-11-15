"use client";

import { useState } from "react";

import { BrandLogo } from "@/components/BrandLogo";

type Props = {
  onRestart: () => void;
  onHome: () => void;
};

export function LessonComplete({ onRestart, onHome }: Props) {
  const [captchaState, setCaptchaState] = useState<
    "idle" | "loading" | "failed"
  >("idle");

  function handleCaptcha() {
    if (captchaState === "loading") return;
    setCaptchaState("loading");
    window.setTimeout(() => setCaptchaState("failed"), 900);
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-lg flex-col items-center justify-center px-4 py-10">
      <div className="w-full text-center animate-fade-up">
        <BrandLogo size={160} className="mx-auto mb-5" />
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-lingo md:text-5xl">
          Lesson complete!
        </h1>
        <p className="mt-3 text-lg font-bold text-ink-muted">
          You finished French Swearing 101.
        </p>

        <p className="mt-8 mb-6 text-xl font-extrabold text-ink">
          Go have a conversation in French
        </p>

        <div className="mb-8 text-left">
          <p className="mb-2 text-sm font-extrabold text-ink">Check your score:</p>
          <button
            type="button"
            onClick={handleCaptcha}
            disabled={captchaState === "loading"}
            className="flex w-full items-center gap-3 rounded-2xl border-2 border-edge border-b-4 bg-snow px-4 py-3 text-left transition hover:bg-white disabled:cursor-wait"
            aria-label="Check your score with reCAPTCHA"
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded border-2 ${
                captchaState === "failed"
                  ? "border-wrong bg-[#ffdfe0]"
                  : "border-edge bg-white"
              }`}
              aria-hidden
            >
              {captchaState === "loading" ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-edge border-t-duo-blue" />
              ) : captchaState === "failed" ? (
                <span className="font-bold text-wrong">×</span>
              ) : null}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-extrabold text-ink">
                I&apos;m not a robot
              </span>
              {captchaState === "failed" ? (
                <span className="mt-0.5 block text-xs font-extrabold text-wrong">
                  Verification failed. Please try again.
                </span>
              ) : (
                <span className="mt-0.5 block text-xs font-bold text-ink-muted">
                  reCAPTCHA
                </span>
              )}
            </span>
            <span
              className="shrink-0 text-[10px] font-bold leading-tight text-ink-muted"
              aria-hidden
            >
              <span className="mb-0.5 block text-lg">↺</span>
              Privacy · Terms
            </span>
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <button type="button" onClick={onRestart} className="btn-primary w-full">
            Practice again
          </button>
          <button type="button" onClick={onHome} className="btn-secondary w-full">
            Back to home
          </button>
        </div>
      </div>
    </main>
  );
}
