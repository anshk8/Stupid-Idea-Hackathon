"use client";

type Props = {
  speaking: boolean;
  supported: boolean;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
};

export function HearPronunciationButton({
  speaking,
  supported,
  disabled = false,
  onClick,
  className = "btn-speaker mx-auto flex",
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!supported || disabled}
      className={className}
      aria-label={speaking ? "Stop pronunciation" : "Hear pronunciation"}
    >
      <span className="text-3xl" aria-hidden>
        {speaking ? "🔊" : "🔈"}
      </span>
      <span className="font-display text-lg font-bold">
        {speaking ? "Speaking…" : "Hear Pronunciation"}
      </span>
    </button>
  );
}
