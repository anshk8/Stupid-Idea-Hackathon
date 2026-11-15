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
    <main className="mx-auto flex min-h-svh w-full max-w-lg flex-col items-center justify-center px-5 py-12">
      <div className="w-full rounded-3xl border-2 border-ink/10 bg-white p-8 text-center shadow-card animate-fade-up md:p-10">
        <BrandLogo size={96} className="mx-auto mb-4" />
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-lingo-dark md:text-5xl">
          FÉLICITATIONS!
        </h1>
        <p className="mt-3 text-lg text-ink-muted">
          You have completed French Swearing 101!
        </p>

        <p className="mt-8 mb-6 text-base leading-relaxed text-ink">
          Go have a conversation in French
        </p>

        <div className="mb-8 text-left">
          <button
            type="button"
            onClick={handleCaptcha}
            disabled={captchaState === "loading"}
            className="flex w-full items-center gap-3 rounded-lg border border-ink/20 bg-[#f9f9f9] px-4 py-3 text-left shadow-sm transition hover:bg-white disabled:cursor-wait"
            aria-label="reCAPTCHA verification"
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded border-2 ${
                captchaState === "failed"
                  ? "border-red-500 bg-red-50"
                  : "border-ink/30 bg-white"
              }`}
              aria-hidden
            >
              {captchaState === "loading" ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/20 border-t-lingo-dark" />
              ) : captchaState === "failed" ? (
                <span className="font-bold text-red-600">×</span>
              ) : null}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-ink">
                I&apos;m not a robot
              </span>
              {captchaState === "failed" ? (
                <span className="mt-0.5 block text-xs font-bold text-red-600">
                  Verification failed. Please try again.
                </span>
              ) : (
                <span className="mt-0.5 block text-xs text-ink-muted">
                  reCAPTCHA
                </span>
              )}
            </span>
            <span
              className="shrink-0 text-[10px] leading-tight text-ink-muted"
              aria-hidden
            >
              <span className="mb-0.5 block text-lg">↺</span>
              Privacy · Terms
            </span>
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <button type="button" onClick={onRestart} className="btn-primary w-full">
            Restart Lesson
          </button>
          <button type="button" onClick={onHome} className="btn-secondary w-full">
            Main Menu
          </button>
        </div>
      </div>
    </main>
  );
}
