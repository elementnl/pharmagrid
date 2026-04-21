import { Check, Eye } from "lucide-react";

function toTitleCase(str) {
  return str.replace(
    /\b\w+/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function Cell({ cellData, onSelect, disabled, rowIdx, colIdx, shaking }) {
  // Correct answer — locked in green
  if (cellData?.correct) {
    const displayGeneric = toTitleCase(cellData.drugName);
    const displayBrand = cellData.brandName
      ? (Array.isArray(cellData.brandName) ? cellData.brandName : [cellData.brandName])
          .map(capitalize)
          .join(" / ")
      : null;

    return (
      <div className="aspect-square flex flex-col items-center justify-center rounded-xl border-2 p-1.5 text-center animate-pop-in bg-success/10 border-success/40">
        <span className="font-bold text-[11px] sm:text-xs leading-tight wrap-break-word text-success">
          {displayGeneric}
        </span>
        {displayBrand && (
          <span className="text-[9px] sm:text-[11px] leading-tight mt-0.5 opacity-70 text-success">
            ({displayBrand})
          </span>
        )}
        <Check size={12} className="text-success mt-0.5 shrink-0" strokeWidth={3} />
      </div>
    );
  }

  // Revealed answer (game over, unfilled) — yellow, clickable for more answers
  if (cellData?.revealed) {
    const displayGeneric = toTitleCase(cellData.drugName);
    const displayBrand = cellData.brandName
      ? (Array.isArray(cellData.brandName) ? cellData.brandName : [cellData.brandName])
          .map(capitalize)
          .join(" / ")
      : null;

    return (
      <div
        className="aspect-square flex flex-col items-center justify-center rounded-xl border-2 p-1.5 text-center animate-pop-in bg-amber-500/10 border-amber-500/40 cursor-pointer hover:bg-amber-500/15 transition-all"
        onClick={() => onSelect(rowIdx, colIdx)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onSelect(rowIdx, colIdx);
        }}
      >
        <span className="font-bold text-[11px] sm:text-xs leading-tight wrap-break-word text-amber-600 dark:text-amber-400">
          {displayGeneric}
        </span>
        {displayBrand && (
          <span className="text-[9px] sm:text-[11px] leading-tight mt-0.5 opacity-70 text-amber-600 dark:text-amber-400">
            ({displayBrand})
          </span>
        )}
        <Eye size={12} className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0 opacity-60" strokeWidth={2} />
      </div>
    );
  }

  // Disabled empty cell (shouldn't happen anymore since we reveal answers)
  if (disabled) {
    return (
      <div className="aspect-square rounded-xl border-2 border-dashed border-border bg-card opacity-40" />
    );
  }

  // Empty cell — clickable
  return (
    <div
      className={`aspect-square flex items-center justify-center rounded-xl border-2 border-border bg-card shadow-sm cursor-pointer transition-all hover:bg-muted hover:border-primary hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 ${shaking ? "animate-shake border-destructive/50" : ""}`}
      onClick={() => onSelect(rowIdx, colIdx)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect(rowIdx, colIdx);
      }}
    >
      <span className="text-muted-foreground text-xs font-medium opacity-50">
        ?
      </span>
    </div>
  );
}
