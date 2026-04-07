import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { drugs } from "@/utils/puzzleGenerator";

export default function GuessModal({ rowCategory, colCategory, onSubmit, onClose, usedDrugs = new Set(), duplicateWarning }) {
  const [input, setInput] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const allDrugs = useMemo(() => {
    return drugs.map((d) => ({
      generic: d.generic_name,
    }));
  }, []);

  const suggestions = useMemo(() => {
    const query = input.toLowerCase().trim();
    if (!query) return [];
    return allDrugs
      .filter((d) => d.generic.toLowerCase().includes(query))
      .slice(0, 6);
  }, [input, allDrugs]);

  useEffect(() => {
    setHighlightIndex(-1);
  }, [suggestions]);

  useEffect(() => {
    if (highlightIndex >= 0 && listRef.current) {
      const items = listRef.current.children;
      if (items[highlightIndex]) {
        items[highlightIndex].scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightIndex]);

  const selectDrug = (drugName) => {
    setInput(drugName);
    onSubmit(drugName);
  };

  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      e.preventDefault();
      selectDrug(suggestions[highlightIndex].generic);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input.trim());
    }
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Make a Guess</DialogTitle>
          <DialogDescription>
            Name a drug that matches both categories
          </DialogDescription>
        </DialogHeader>

        {/* Category clues */}
        <div className="flex items-stretch gap-2">
          <div className="flex flex-col items-center justify-center px-3 py-3 bg-muted rounded-lg flex-1 min-w-0">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">
              {rowCategory.label}
            </span>
            <span className="text-sm font-bold text-primary leading-snug uppercase text-center">
              {rowCategory.value}
            </span>
          </div>
          <div className="flex items-center shrink-0">
            <span className="text-muted-foreground text-sm">&</span>
          </div>
          <div className="flex flex-col items-center justify-center px-3 py-3 bg-muted rounded-lg flex-1 min-w-0">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">
              {colCategory.label}
            </span>
            <span className="text-sm font-bold text-primary leading-snug uppercase text-center">
              {colCategory.value}
            </span>
          </div>
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="relative">
            <Input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Start typing a drug name..."
              autoComplete="off"
              spellCheck="false"
              role="combobox"
              aria-expanded={suggestions.length > 0}
              aria-autocomplete="list"
            />

            {/* Autocomplete dropdown */}
            {suggestions.length > 0 && (
              <ul
                ref={listRef}
                className="absolute top-full left-0 right-0 z-10 mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto p-1"
                role="listbox"
              >
                {suggestions.map((drug, i) => {
                  const isUsed = usedDrugs.has(drug.generic);
                  return (
                    <li
                      key={drug.generic}
                      className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                        isUsed
                          ? "opacity-40 cursor-not-allowed"
                          : `cursor-pointer ${i === highlightIndex ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"}`
                      }`}
                      onClick={() => !isUsed && selectDrug(drug.generic)}
                      role="option"
                      aria-selected={i === highlightIndex}
                    >
                      <span className="font-medium">
                        {drug.generic}
                        {isUsed && <span className="text-xs font-normal text-muted-foreground ml-1.5">(used)</span>}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <Button type="submit" disabled={!input.trim()}>
            Submit Guess
          </Button>
        </form>

        {duplicateWarning ? (
          <p className="text-center text-xs text-destructive font-semibold">
            You already used {duplicateWarning}!
          </p>
        ) : (
          <p className="text-center text-xs text-muted-foreground">
            Type to search, use arrow keys to navigate
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
