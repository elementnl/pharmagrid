import { ChevronLeft, ChevronRight, Pill, Sun, Moon } from "lucide-react";

export default function GameHeader({
  dateStr,
  guessesRemaining,
  score,
  isComplete,
  onPrevDay,
  onNextDay,
  isToday,
  theme,
  onToggleTheme,
}) {
  const dateObj = new Date(dateStr + "T00:00:00");
  const formatted = dateObj.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="text-center animate-fade-in">
      {/* Top row: spacer | brand | theme toggle */}
      <div className="flex items-center justify-between mb-1">
        <div className="w-12" />
        <div className="flex items-center gap-2.5">
          <Pill
            size={28}
            className="text-accent animate-pulse-glow"
            strokeWidth={2}
          />
          <h1 className="text-[28px] font-extrabold tracking-tight bg-linear-to-br from-gradient-start to-gradient-end bg-clip-text text-transparent">
            PharmGrid
          </h1>
        </div>
        <button
          onClick={onToggleTheme}
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-border bg-bg-surface text-text-secondary hover:bg-cell-hover hover:border-border-hover transition-all cursor-pointer"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <p className="text-[13px] text-text-muted tracking-wide mb-4">
        Name drugs that match both categories
      </p>

      {/* Date nav */}
      <div className="flex items-center justify-center gap-3.5 mb-4">
        <button
          onClick={onPrevDay}
          className="w-8.5 h-8.5 flex items-center justify-center rounded-[10px] border border-border bg-bg-surface text-text-secondary shadow-sm hover:bg-cell-hover hover:border-border-hover hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 transition-all disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Previous day"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm text-text-secondary font-medium min-w-40 tabular-nums">
          {formatted}
        </span>
        <button
          onClick={onNextDay}
          disabled={isToday}
          className="w-8.5 h-8.5 flex items-center justify-center rounded-[10px] border border-border bg-bg-surface text-text-secondary shadow-sm hover:bg-cell-hover hover:border-border-hover hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 transition-all disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Next day"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-2.5">
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-bg-surface border border-border rounded-full text-[13px] shadow-sm">
          <span className="text-text-muted">Guesses</span>
          <span className="text-text-primary font-bold">{guessesRemaining}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-bg-surface border border-border rounded-full text-[13px] shadow-sm">
          <span className="text-text-muted">Score</span>
          <span className="text-text-primary font-bold">{score}/9</span>
        </div>
        {isComplete && (
          <div
            className={`flex items-center px-3.5 py-1.5 rounded-full text-[13px] font-bold animate-pop-in ${
              score === 9
                ? "bg-correct-bg border border-correct-border text-correct"
                : "bg-accent-bg border border-accent text-accent"
            }`}
          >
            {score === 9 ? "Perfect!" : "Done"}
          </div>
        )}
      </div>
    </header>
  );
}
