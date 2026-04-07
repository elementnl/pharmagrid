import { ChevronLeft, ChevronRight, Pill, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

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
      {/* Theme toggle — fixed top-right on desktop */}
      <div className="fixed top-4 right-4 z-40 hidden sm:flex items-center gap-2">
        <span className="text-xs text-muted-foreground">
          {theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        </span>
        <Switch
          checked={theme === "dark"}
          onCheckedChange={onToggleTheme}
          aria-label="Toggle dark mode"
        />
      </div>

      {/* Logo */}
      <div className="flex items-center justify-center gap-2.5 mb-1">
        <Pill
          size={28}
          className="text-primary animate-pulse-glow"
          strokeWidth={2}
        />
        <h1 className="font-heading text-3xl sm:text-4xl tracking-tight bg-linear-to-br from-primary to-primary/60 bg-clip-text text-transparent font-black">
          <span className="font-thin">PHARMA</span>GRID
        </h1>
      </div>

      <p className="text-xs sm:text-[13px] text-muted-foreground tracking-wide mb-4">
        Name drugs that match both categories
      </p>

      {/* Date nav */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={onPrevDay}
          className="h-8 w-8 rounded-lg"
          aria-label="Previous day"
        >
          <ChevronLeft size={16} />
        </Button>
        <span className="text-sm text-foreground font-medium min-w-36 sm:min-w-40 tabular-nums">
          {formatted}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={onNextDay}
          disabled={isToday}
          className="h-8 w-8 rounded-lg"
          aria-label="Next day"
        >
          <ChevronRight size={16} />
        </Button>
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-2 flex-wrap">
        <Badge variant="secondary" className="text-[13px] px-3 py-1 gap-1.5">
          <span className="text-muted-foreground font-normal">Guesses Left</span>
          <span className="font-bold">{guessesRemaining}</span>
        </Badge>
        <Badge variant="secondary" className="text-[13px] px-3 py-1 gap-1.5">
          <span className="text-muted-foreground font-normal">Score</span>
          <span className="font-bold">{score}/9</span>
        </Badge>
        {isComplete && (
          <Badge
            className={`text-[13px] px-3 py-1 animate-pop-in ${
              score === 9
                ? "bg-success/15 text-success border-success/40"
                : "bg-primary/10 text-primary border-primary/40"
            }`}
          >
            {score === 9 ? "Perfect!" : "Done"}
          </Badge>
        )}
      </div>

      {/* Theme toggle — fixed bottom-center on mobile */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex sm:hidden items-center gap-2 bg-card border border-border rounded-full px-4 py-2 shadow-md">
        {theme === "dark" ? (
          <Moon size={14} className="text-muted-foreground" />
        ) : (
          <Sun size={14} className="text-muted-foreground" />
        )}
        <span className="text-xs text-muted-foreground">
          {theme === "dark" ? "Dark" : "Light"}
        </span>
        <Switch
          checked={theme === "dark"}
          onCheckedChange={onToggleTheme}
          aria-label="Toggle dark mode"
        />
      </div>
    </header>
  );
}
