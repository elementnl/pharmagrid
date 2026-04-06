import { useState, useMemo, useCallback } from "react";
import Grid from "./components/Grid";
import GameHeader from "./components/GameHeader";
import GameOver from "./components/GameOver";
import GuessModal from "./components/GuessModal";
import { generatePuzzle, isDrugValidForCell } from "./utils/puzzleGenerator";
import { getTodayString } from "./utils/seededRandom";
import { useGameState } from "./hooks/useGameState";
import { useTheme } from "./hooks/useTheme";

function addDays(dateStr, days) {
  const date = new Date(dateStr + "T00:00:00");
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

export default function App() {
  const today = getTodayString();
  const [currentDate, setCurrentDate] = useState(today);
  const isToday = currentDate === today;
  const { theme, toggleTheme } = useTheme();

  const [selectedCell, setSelectedCell] = useState(null);

  const puzzle = useMemo(() => generatePuzzle(currentDate), [currentDate]);
  const gameState = useGameState(currentDate);

  const handleCellSelect = useCallback(
    (row, col) => {
      if (!gameState.isComplete && !gameState.grid[row][col]) {
        setSelectedCell({ row, col });
      }
    },
    [gameState.isComplete, gameState.grid]
  );

  const handleGuessSubmit = useCallback(
    (drugName) => {
      if (!selectedCell) return;
      const { row, col } = selectedCell;
      const rowCat = puzzle.rows[row];
      const colCat = puzzle.cols[col];
      const isCorrect = isDrugValidForCell(
        drugName,
        rowCat.key,
        rowCat.value,
        colCat.key,
        colCat.value
      );
      gameState.makeGuess(row, col, drugName, isCorrect);
      setSelectedCell(null);
    },
    [selectedCell, puzzle, gameState]
  );

  const handlePrevDay = () => {
    setCurrentDate((d) => addDays(d, -1));
    setSelectedCell(null);
  };
  const handleNextDay = () => {
    if (!isToday) {
      setCurrentDate((d) => addDays(d, 1));
      setSelectedCell(null);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto px-4 py-6 min-h-dvh flex flex-col gap-7">
      <GameHeader
        dateStr={currentDate}
        guessesRemaining={gameState.guessesRemaining}
        score={gameState.score}
        isComplete={gameState.isComplete}
        onPrevDay={handlePrevDay}
        onNextDay={handleNextDay}
        isToday={isToday}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <Grid
        puzzle={puzzle}
        gameState={gameState}
        onCellSelect={handleCellSelect}
      />

      {gameState.isComplete && (
        <GameOver puzzle={puzzle} gameState={gameState} />
      )}

      {selectedCell && (
        <GuessModal
          rowCategory={puzzle.rows[selectedCell.row]}
          colCategory={puzzle.cols[selectedCell.col]}
          onSubmit={handleGuessSubmit}
          onClose={() => setSelectedCell(null)}
        />
      )}
    </div>
  );
}
