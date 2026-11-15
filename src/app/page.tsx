"use client";

import { useState } from "react";

import { HomeScreen } from "@/components/HomeScreen";
import { LessonComplete } from "@/components/LessonComplete";
import { LessonScreen } from "@/components/LessonScreen";
import { frenchLesson } from "@/data/lessons";

type Screen = "home" | "lesson" | "complete";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("home");
  const [index, setIndex] = useState(0);

  function startLesson() {
    setIndex(0);
    setScreen("lesson");
  }

  function goNext() {
    if (index >= frenchLesson.length - 1) {
      setScreen("complete");
      return;
    }
    setIndex((i) => i + 1);
  }

  function goPrev() {
    setIndex((i) => Math.max(0, i - 1));
  }

  function goHome() {
    setScreen("home");
    setIndex(0);
  }

  if (screen === "home") {
    return <HomeScreen onStart={startLesson} />;
  }

  if (screen === "complete") {
    return (
      <LessonComplete onRestart={startLesson} onHome={goHome} />
    );
  }

  return (
    <LessonScreen
      phrase={frenchLesson[index]}
      index={index}
      total={frenchLesson.length}
      onPrev={goPrev}
      onNext={goNext}
      onHome={goHome}
    />
  );
}
