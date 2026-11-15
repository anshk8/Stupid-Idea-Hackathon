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
    <div className="mt-auto border-t-2 border-edge bg-white px-0 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirst}
          className="btn-secondary flex-1"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          className="btn-primary flex-1"
        >
          {isLast ? "Finish" : "Continue"}
        </button>
      </div>
    </div>
  );
}
