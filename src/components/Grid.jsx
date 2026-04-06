import Cell from "./Cell";
import CategoryLabel from "./CategoryLabel";

export default function Grid({ puzzle, gameState, onCellSelect }) {
  const { rows, cols } = puzzle;
  const { grid, isComplete } = gameState;

  return (
    <div className="w-full flex justify-center">
      <div
        className="grid gap-1.5 w-full max-w-130"
        style={{ gridTemplateColumns: "120px repeat(3, 1fr)" }}
      >
        {/* Empty corner */}
        <div />

        {/* Column headers */}
        {cols.map((col, i) => (
          <CategoryLabel key={`col-${i}`} category={col} />
        ))}

        {/* Rows */}
        {rows.map((row, rowIdx) => (
          <div key={`row-${rowIdx}`} className="contents">
            <CategoryLabel category={row} />
            {cols.map((_, colIdx) => (
              <Cell
                key={`cell-${rowIdx}-${colIdx}`}
                cellData={grid[rowIdx][colIdx]}
                onSelect={onCellSelect}
                disabled={isComplete}
                rowIdx={rowIdx}
                colIdx={colIdx}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
