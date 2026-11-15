"use client";

import { useCallback, useEffect, useState } from "react";

function pickFrenchVoice(voices: SpeechSynthesisVoice[]) {
  return (
    voices.find((v) => v.lang === "fr-FR") ??
    voices.find((v) => v.lang.toLowerCase().startsWith("fr")) ??
    null
  );
}

export function useSpeechSynthesis() {
  const [supported, setSupported] = useState(true);
  const [voicesReady, setVoicesReady] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setSupported(false);
      setError("Text-to-speech isn’t available in this browser.");
      return;
    }

    const synth = window.speechSynthesis;

    const markReady = () => {
      setVoicesReady(true);
      if (!pickFrenchVoice(synth.getVoices())) {
        setError(
          "No French voice found — pronunciation may use a fallback accent.",
        );
      } else {
        setError(null);
      }
    };

    markReady();
    synth.addEventListener("voiceschanged", markReady);
    return () => {
      synth.cancel();
      synth.removeEventListener("voiceschanged", markReady);
    };
  }, []);

  const cancel = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const speakFrench = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        setSupported(false);
        setError("Text-to-speech isn’t available in this browser.");
        return;
      }

      const synth = window.speechSynthesis;
      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "fr-FR";
      utterance.rate = 0.85;

      const voice = pickFrenchVoice(synth.getVoices());
      if (voice) utterance.voice = voice;

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => {
        setSpeaking(false);
        setError("Couldn’t play pronunciation. Try again.");
      };

      synth.speak(utterance);
    },
    [],
  );

  return { speakFrench, cancel, speaking, supported, voicesReady, error };
}
