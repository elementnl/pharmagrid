import { getValidDrugsForCell } from "../utils/puzzleGenerator";

export default function GameOver({ puzzle, gameState }) {
  const { rows, cols } = puzzle;
  const { grid, score } = gameState;

  const message =
    score === 9
      ? "Perfect Score!"
      : score >= 7
        ? "Great Job!"
        : score >= 4
          ? "Not Bad!"
          : "Better Luck Tomorrow!";

  return (
    <div className="w-full max-w-130 mx-auto text-center p-7 bg-bg-surface rounded-2xl border border-border shadow-md animate-slide-up">
      {/* Score ring */}
      <div
        className={`w-18 h-18 rounded-full border-[3px] inline-flex items-center justify-center mb-3 transition-all ${
          score === 9
            ? "border-correct shadow-[0_0_20px_var(--color-correct-bg)]"
            : "border-border"
        }`}
      >
        <span
          className={`text-[28px] font-extrabold ${
            score === 9 ? "text-correct" : "text-accent"
          }`}
        >
          {score}
        </span>
        <span className="text-base text-text-muted font-medium">/9</span>
      </div>

      <h2 className="text-[22px] font-bold text-text-primary mb-1">
        {message}
      </h2>
      <p className="text-sm text-text-muted">
        {score === 9
          ? "You matched every drug correctly!"
          : "Here are the answers you missed:"}
      </p>

      {/* Missed answers */}
      {score < 9 && (
        <div className="flex flex-col gap-2.5 text-left mt-5">
          {rows.map((row, rowIdx) =>
            cols.map((col, colIdx) => {
              const cell = grid[rowIdx][colIdx];
              if (cell?.correct) return null;

              const validDrugs = getValidDrugsForCell(
                row.key,
                row.value,
                col.key,
                col.value
              );

              return (
                <div
                  key={`answer-${rowIdx}-${colIdx}`}
                  className="p-3 bg-bg rounded-xl border border-border animate-fade-in"
                  style={{ animationDelay: `${(rowIdx * 3 + colIdx) * 50}ms`, animationFillMode: "both" }}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-xs font-semibold text-text-secondary bg-accent-bg px-2 py-0.5 rounded-md">
                      {row.value}
                    </span>
                    <span className="text-[11px] text-text-muted">&</span>
                    <span className="text-xs font-semibold text-text-secondary bg-accent-bg px-2 py-0.5 rounded-md">
                      {col.value}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {validDrugs.map((d) => (
                      <span
                        key={d.generic_name}
                        className="text-[13px] font-semibold text-correct bg-correct-bg px-2.5 py-0.5 rounded-md"
                      >
                        {d.generic_name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
