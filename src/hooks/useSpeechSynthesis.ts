/// <reference types="dom-speech-recognition" />

"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

function pickFrenchVoice(voices: SpeechSynthesisVoice[]) {
  return (
    voices.find((v) => v.lang === "fr-FR") ??
    voices.find((v) => v.lang.toLowerCase().startsWith("fr")) ??
    null
  );
}

function subscribeToSpeechSynthesis(onChange: () => void) {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return () => {};
  }

  window.speechSynthesis.addEventListener("voiceschanged", onChange);
  return () =>
    window.speechSynthesis.removeEventListener("voiceschanged", onChange);
}

function isSpeechSynthesisSupported() {
  return typeof window !== "undefined" && Boolean(window.speechSynthesis);
}

type SpeechRecognitionConstructor = new () => SpeechRecognition;

export function useSpeechSynthesis() {
  const supported = useSyncExternalStore(
    subscribeToSpeechSynthesis,
    isSpeechSynthesisSupported,
    () => true,
  );
  const [voicesReady, setVoicesReady] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [recognitionError, setRecognitionError] = useState<string | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const error = supported
    ? voiceError
    : "Text-to-speech isn’t available in this browser.";

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!window.speechSynthesis) return;

    const synth = window.speechSynthesis;

    const markReady = () => {
      setVoicesReady(true);
      if (!pickFrenchVoice(synth.getVoices())) {
        setVoiceError(
          "No French voice found — pronunciation may use a fallback accent.",
        );
      } else {
        setVoiceError(null);
      }
    };

    markReady();
    synth.addEventListener("voiceschanged", markReady);
    return () => {
      recognitionRef.current?.abort();
      synth.cancel();
      synth.removeEventListener("voiceschanged", markReady);
    };
  }, []);

  const cancel = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const speakFrench = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setVoiceError("Text-to-speech isn’t available in this browser.");
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
      setVoiceError("Couldn’t play pronunciation. Try again.");
    };

    synth.speak(utterance);
  }, []);

  const recognizeFrench = useCallback((): Promise<string> => {
    if (typeof window === "undefined") {
      const message = "Speech recognition isn’t available in this browser.";
      setRecognitionError(message);
      return Promise.reject(new Error(message));
    }

    const speechWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const Recognition =
      speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

    if (!Recognition) {
      const message = "Speech recognition isn’t available in this browser.";
      setRecognitionError(message);
      return Promise.reject(new Error(message));
    }

    recognitionRef.current?.abort();
    setRecognitionError(null);
    setListening(true);

    return new Promise((resolve, reject) => {
      const recognition = new Recognition();
      let transcript = "";
      let settled = false;

      const fail = (message: string) => {
        if (settled) return;
        settled = true;
        recognitionRef.current = null;
        setListening(false);
        setRecognitionError(message);
        reject(new Error(message));
      };

      recognition.lang = "fr-FR";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onresult = (event) => {
        transcript = Array.from(event.results)
          .map((result) => result[0]?.transcript ?? "")
          .join(" ")
          .trim();
      };
      recognition.onerror = (event) => {
        const message =
          event.error === "not-allowed"
            ? "Microphone access was denied. Allow microphone access and try again."
            : event.error === "no-speech"
              ? "No speech was detected. Try again."
              : event.error === "aborted"
                ? "Speech recognition was canceled."
                : "Couldn’t recognize speech. Try again.";
        fail(message);
      };
      recognition.onend = () => {
        if (settled) return;
        if (!transcript) {
          fail("No speech was detected. Try again.");
          return;
        }

        settled = true;
        recognitionRef.current = null;
        setListening(false);
        resolve(transcript);
      };

      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch {
        fail("Couldn’t start speech recognition. Try again.");
      }
    });
  }, []);

  const cancelRecognition = useCallback(() => {
    recognitionRef.current?.abort();
  }, []);

  return {
    speakFrench,
    cancel,
    speaking,
    supported,
    voicesReady,
    error,
    recognizeFrench,
    cancelRecognition,
    listening,
    recognitionError,
  };
}
