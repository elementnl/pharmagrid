import { useRef, useState, useEffect } from "react";
import Cell from "./Cell";
import CategoryLabel from "./CategoryLabel";

export default function Grid({ puzzle, gameState, onCellSelect, shakingCell }) {
  const { rows, cols } = puzzle;
  const { grid, isComplete } = gameState;
  const labelRef = useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);

  // Measure the row label column width to offset centering on desktop
  useEffect(() => {
    if (labelRef.current) {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setLabelWidth(entry.contentBoxSize[0]?.inlineSize || entry.contentRect.width);
        }
      });
      observer.observe(labelRef.current);
      return () => observer.disconnect();
    }
  }, []);

  return (
    <>
      {/* Mobile: 4-col grid, shifted slightly left to visually center cells */}
      <div className="w-full sm:hidden overflow-hidden">
        <div
          className="grid gap-1 -translate-x-2"
          style={{
            gridTemplateColumns: "minmax(70px, 100px) repeat(3, 1fr)",
          }}
        >
          <div />
          {cols.map((col, i) => (
            <CategoryLabel key={`col-${i}`} category={col} valign="end" />
          ))}
          {rows.map((row, rowIdx) => (
            <div key={`row-${rowIdx}`} className="contents">
              <CategoryLabel category={row} align="right" />
              {cols.map((_, colIdx) => (
                <Cell
                  key={`cell-${rowIdx}-${colIdx}`}
                  cellData={grid[rowIdx][colIdx]}
                  onSelect={onCellSelect}
                  disabled={isComplete}
                  rowIdx={rowIdx}
                  colIdx={colIdx}
                  shaking={shakingCell?.row === rowIdx && shakingCell?.col === colIdx}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: centered 3x3 with translate offset */}
      <div className="w-full hidden sm:flex justify-center overflow-visible">
        <div
          className="grid gap-2 mt-5"
          style={{
            gridTemplateColumns: "auto repeat(3, minmax(90px, 140px))",
            transform: labelWidth ? `translateX(-${labelWidth / 3}px)` : undefined,
          }}
        >
          <div ref={labelRef} />
          {cols.map((col, i) => (
            <CategoryLabel key={`col-${i}`} category={col} valign="end" />
          ))}
          {rows.map((row, rowIdx) => (
            <div key={`row-${rowIdx}`} className="contents">
              <CategoryLabel category={row} align="right" />
              {cols.map((_, colIdx) => (
                <Cell
                  key={`cell-${rowIdx}-${colIdx}`}
                  cellData={grid[rowIdx][colIdx]}
                  onSelect={onCellSelect}
                  disabled={isComplete}
                  rowIdx={rowIdx}
                  colIdx={colIdx}
                  shaking={shakingCell?.row === rowIdx && shakingCell?.col === colIdx}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
