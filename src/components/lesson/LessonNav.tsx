"use client";

type Props = {
  isFirst: boolean;
  isLast: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
};

export function LessonNav({
  isFirst,
  isLast,
  canNext,
  onPrev,
  onNext,
}: Props) {
  return (
    <div className="mt-auto flex gap-3 pt-6 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      <button
        type="button"
        onClick={onPrev}
        disabled={isFirst}
        className="btn-secondary flex-1"
      >
        ← Previous
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isLast ? "Finish →" : "Next →"}
      </button>
    </div>
  );
}
