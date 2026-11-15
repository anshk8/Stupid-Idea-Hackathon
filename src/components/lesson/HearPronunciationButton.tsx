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
  className = "btn-speaker",
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!supported || disabled}
      className={className}
      aria-label={speaking ? "Stop pronunciation" : "Hear pronunciation"}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <path
          d="M4 9v6h4l5 4V5L8 9H4z"
          fill="currentColor"
        />
        <path
          d="M16.5 8.5a5 5 0 010 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {speaking ? (
          <path
            d="M18.5 6a8 8 0 010 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        ) : null}
      </svg>
      <span>{speaking ? "Playing…" : "Listen"}</span>
    </button>
  );
}