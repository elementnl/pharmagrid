import { Check, X } from "lucide-react";

export default function Cell({ cellData, onSelect, disabled, rowIdx, colIdx }) {
  if (cellData) {
    const isCorrect = cellData.correct;
    return (
      <div
        className={`aspect-square flex flex-col items-center justify-center rounded-xl border-2 p-1.5 text-center
          ${isCorrect ? "bg-correct-bg border-correct-border" : "bg-incorrect-bg border-incorrect-border"}
          ${isCorrect ? "animate-pop-in" : "animate-pop-in [animation-duration:0.35s]"}
        `}
        style={!isCorrect ? { animation: "pop-in 0.35s ease, shake 0.4s ease 0.1s" } : undefined}
      >
        <span
          className={`font-bold text-[11px] leading-tight wrap-break-word ${
            isCorrect ? "text-correct" : "text-incorrect"
          }`}
        >
          {cellData.drugName}
        </span>
        {isCorrect ? (
          <Check size={16} className="text-correct mt-0.5" strokeWidth={3} />
        ) : (
          <X size={16} className="text-incorrect mt-0.5" strokeWidth={3} />
        )}
      </div>
    );
  }

  if (disabled) {
    return (
      <div className="aspect-square rounded-xl border-2 border-dashed border-border bg-bg-surface opacity-40" />
    );
  }

  return (
    <div
      className="aspect-square flex items-center justify-center rounded-xl border-2 border-border bg-cell-bg shadow-sm cursor-pointer transition-all hover:bg-cell-hover hover:border-accent hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
      onClick={() => onSelect(rowIdx, colIdx)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect(rowIdx, colIdx);
      }}
    >
      <span className="text-text-muted text-xs font-medium opacity-60">
        ?
      </span>
    </div>
  );
}
