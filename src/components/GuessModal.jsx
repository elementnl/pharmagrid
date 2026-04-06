import { useState, useEffect, useRef, useMemo } from "react";
import { X } from "lucide-react";
import { drugs } from "../utils/puzzleGenerator";

export default function GuessModal({ rowCategory, colCategory, onSubmit, onClose }) {
  const [input, setInput] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const allDrugs = useMemo(() => {
    return drugs.map((d) => ({
      generic: d.generic_name,
      brand: d.brand_name,
    }));
  }, []);

  const suggestions = useMemo(() => {
    const query = input.toLowerCase().trim();
    if (!query) return [];
    return allDrugs
      .filter(
        (d) =>
          d.generic.toLowerCase().includes(query) ||
          d.brand.toLowerCase().includes(query)
      )
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-overlay backdrop-blur-sm animate-overlay-in"
      onClick={onClose}
    >
      <div
        className="bg-bg-elevated border border-border rounded-2xl p-8 pt-7 w-full max-w-100 shadow-lg relative animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:bg-accent-bg hover:text-text-primary transition-all cursor-pointer"
          onClick={onClose}
        >
          <X size={18} />
        </button>

        {/* Category clues */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="flex flex-col items-center px-4 py-3 bg-accent-bg border border-border rounded-xl flex-1">
            <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
              {rowCategory.label}
            </span>
            <span className="text-[15px] font-bold text-accent mt-0.5">
              {rowCategory.value}
            </span>
          </div>
          <span className="text-text-muted text-lg font-light">&</span>
          <div className="flex flex-col items-center px-4 py-3 bg-accent-bg border border-border rounded-xl flex-1">
            <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
              {colCategory.label}
            </span>
            <span className="text-[15px] font-bold text-accent mt-0.5">
              {colCategory.value}
            </span>
          </div>
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Start typing a drug name..."
              className="w-full px-4 py-3.5 bg-bg border-2 border-border rounded-xl text-text-primary text-base outline-none transition-all focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-bg)] placeholder:text-text-muted placeholder:text-sm"
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
                className="absolute top-full left-0 right-0 z-10 mt-1 bg-bg-elevated border border-border rounded-xl shadow-lg max-h-60 overflow-y-auto p-1 animate-fade-in"
                role="listbox"
              >
                {suggestions.map((drug, i) => (
                  <li
                    key={drug.generic}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                      i === highlightIndex ? "bg-accent-bg" : "hover:bg-accent-bg"
                    }`}
                    onClick={() => selectDrug(drug.generic)}
                    role="option"
                    aria-selected={i === highlightIndex}
                  >
                    <span className="text-sm font-semibold text-text-primary">
                      {drug.generic}
                    </span>
                    <span className="text-xs text-text-muted italic">
                      {drug.brand}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="submit"
            disabled={!input.trim()}
            className="py-3 bg-linear-to-br from-gradient-start to-gradient-end text-white text-[15px] font-bold rounded-xl shadow-[0_2px_8px_rgba(108,92,231,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(108,92,231,0.4)] active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Submit Guess
          </button>
        </form>

        <p className="text-center text-xs text-text-muted mt-3">
          Type to search, use arrow keys to navigate
        </p>
      </div>
    </div>
  );
}
