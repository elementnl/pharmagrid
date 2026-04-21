import { useState, useMemo, useCallback } from "react";
import Grid from "@/components/Grid";
import GameHeader from "@/components/GameHeader";
import GuessModal from "@/components/GuessModal";
import AnswersDialog from "@/components/AnswersDialog";
import { generatePuzzle, isDrugValidForCell, getDrugByName, getValidDrugsForCell } from "@/utils/puzzleGenerator";
import { getTodayString } from "@/utils/seededRandom";
import { useGameState } from "@/hooks/useGameState";
import { useTheme } from "@/hooks/useTheme";

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
  const [answersCell, setAnswersCell] = useState(null);

  const puzzle = useMemo(() => generatePuzzle(currentDate), [currentDate]);
  const gameState = useGameState(currentDate);

  const displayGrid = useMemo(() => {
    if (!gameState.isComplete) return gameState.grid;

    return gameState.grid.map((row, rowIdx) =>
      row.map((cell, colIdx) => {
        if (cell?.correct) return cell;

        const rowCat = puzzle.rows[rowIdx];
        const colCat = puzzle.cols[colIdx];
        const validDrugs = getValidDrugsForCell(rowCat.key, rowCat.value, colCat.key, colCat.value);

        if (validDrugs.length > 0) {
          const drug = validDrugs[0];
          return {
            drugName: drug.generic_name,
            brandName: [...new Set([drug.brand_name, ...(drug.accepted_names || [])])],
            correct: false,
            revealed: true,
          };
        }

        return cell;
      })
    );
  }, [gameState.isComplete, gameState.grid, puzzle]);

  const displayGameState = useMemo(() => ({
    ...gameState,
    grid: displayGrid,
  }), [gameState, displayGrid]);

  const handleCellSelect = useCallback(
    (row, col) => {
      if (gameState.isComplete) {
        const cell = displayGrid[row][col];
        if (cell?.revealed) {
          setAnswersCell({ row, col });
        }
        return;
      }

      if (!gameState.grid[row][col]) {
        setSelectedCell({ row, col });
      }
    },
    [gameState.isComplete, gameState.grid, displayGrid]
  );

  const usedDrugs = useMemo(() => {
    const used = new Set();
    gameState.grid.flat().forEach((cell) => {
      if (cell?.correct) {
        const drug = getDrugByName(cell.drugName);
        if (drug) used.add(drug.generic_name);
      }
    });
    return used;
  }, [gameState.grid]);

  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [shakingCell, setShakingCell] = useState(null);

  const handleGuessSubmit = useCallback(
    (drugName) => {
      if (!selectedCell) return;

      const drug = getDrugByName(drugName);
      if (drug && usedDrugs.has(drug.generic_name)) {
        setDuplicateWarning(drug.generic_name);
        setTimeout(() => setDuplicateWarning(null), 2500);
        return;
      }

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

      const matchedDrug = getDrugByName(drugName);
      const displayName = matchedDrug ? matchedDrug.generic_name : drugName;
      const brandName = matchedDrug
        ? [...new Set([matchedDrug.brand_name, ...(matchedDrug.accepted_names || [])])]
        : null;

      gameState.makeGuess(row, col, displayName, isCorrect, brandName);
      setSelectedCell(null);

      if (!isCorrect) {
        setShakingCell({ row, col });
        setTimeout(() => setShakingCell(null), 500);
      }
    },
    [selectedCell, puzzle, gameState, usedDrugs]
  );

  const handlePrevDay = () => {
    setCurrentDate((d) => addDays(d, -1));
    setSelectedCell(null);
    setAnswersCell(null);
  };
  const handleNextDay = () => {
    if (!isToday) {
      setCurrentDate((d) => addDays(d, 1));
      setSelectedCell(null);
      setAnswersCell(null);
    }
  };

  const answersDrugList = useMemo(() => {
    if (!answersCell) return [];
    const { row, col } = answersCell;
    const rowCat = puzzle.rows[row];
    const colCat = puzzle.cols[col];
    return getValidDrugsForCell(rowCat.key, rowCat.value, colCat.key, colCat.value);
  }, [answersCell, puzzle]);

  return (
    <div className="max-w-150 mx-auto px-3 sm:px-4 py-4 sm:py-6 min-h-dvh flex flex-col gap-5 sm:gap-7">
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
        gameState={displayGameState}
        onCellSelect={handleCellSelect}
        shakingCell={shakingCell}
      />

      {selectedCell && (
        <GuessModal
          rowCategory={puzzle.rows[selectedCell.row]}
          colCategory={puzzle.cols[selectedCell.col]}
          onSubmit={handleGuessSubmit}
          onClose={() => setSelectedCell(null)}
          usedDrugs={usedDrugs}
          duplicateWarning={duplicateWarning}
        />
      )}

      {answersCell && (
        <AnswersDialog
          validDrugs={answersDrugList}
          rowCategory={puzzle.rows[answersCell.row]}
          colCategory={puzzle.cols[answersCell.col]}
          onClose={() => setAnswersCell(null)}
        />
      )}
    </div>
  );
}
