import { useEffect, useState } from "react";
import "./App.css";
import { fetchSudoku } from "./services/sudokuApi";
import type { Board } from "./types";
import { NumberPad } from "./NumberPad";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [board, setBoard] = useState<Board | null>(null);
  const [initialBoard, setInitialBoard] = useState<Board | null>(null);
  const [solutionBoard, setSolutionBoard] = useState<Board | null>(null);
  const [isCheckingAnswers, setIsCheckingAnswers] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  useEffect(() => {
    const loadPuzzle = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchSudoku();
        const puzzle = data.puzzle.map((row) => [...row]);
        const solution = data.solution.map((row) => [...row]);

        setBoard(puzzle);
        setSolutionBoard(solution);
        setInitialBoard(puzzle.map((row) => [...row]));
      } catch (err) {
        console.error(err);
        setError("Failed to load Sudoku!");
      } finally {
        setLoading(false);
      }
    };

    loadPuzzle();
  }, []);

  const handleNumberClick = (clickedNumber: number) => {
    if (!board || !selectedCell || !initialBoard || !solutionBoard) return;

    const { row, col } = selectedCell;
    if (initialBoard[row][col] !== null) return;

    const newBoard = board.map((row) => [...row]);
    newBoard[row][col] = clickedNumber;
    setBoard(newBoard);
    setSelectedCell(null);
  };

  const solutionsCheck = () => {
    isCheckingAnswers
      ? setIsCheckingAnswers(false)
      : setIsCheckingAnswers(true);
  };

  useEffect(() => {
    if (!isCheckingAnswers) return;
    const timer = setTimeout(() => setIsCheckingAnswers(false), 2000);
    return () => clearTimeout(timer);
  }, [isCheckingAnswers]);

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh w-full bg-linear-to-r from-blue-400 to-purple-600">
      <section className="flex gap-6 mb-6 ">
        <h1 className="text-6xl text-white font-extrabold font-audiowide">
          Südoku
        </h1>
        <button
          onClick={solutionsCheck}
          className="text-6xl text-white transition-transform duration-150 ease-in-out active:scale-110 cursor-pointer"
        >
          <IoIosCheckmarkCircleOutline />
        </button>
      </section>
      {loading && <p className="text-white mt-4">Loading...</p>}
      {error && <p className="text-red-400 mt-4">{error}</p>}

      {board && (
        <section className="max-w-fit grid grid-cols-9">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              let styling = "";

              const boxRow = Math.floor(rowIndex / 3);
              const boxCol = Math.floor(colIndex / 3);
              const isLightBox = (boxRow + boxCol) % 2 === 0;
              const isInitial = initialBoard?.[rowIndex][colIndex] !== null;

              if (!isInitial) {
                styling += "cursor-pointer";
              }

              const textColor = isLightBox ? "text-blue-800" : "text-white";
              let bgColor = isLightBox ? "bg-white" : "bg-blue-400";

              if (
                selectedCell?.row === rowIndex &&
                selectedCell?.col === colIndex &&
                !isInitial
              ) {
                bgColor = "bg-yellow-400";
              }

              if (isCheckingAnswers && !isInitial && cell !== null) {
                bgColor =
                  cell === solutionBoard?.[rowIndex][colIndex]
                    ? "bg-green-400"
                    : "bg-red-400";
              }
              if (rowIndex % 3 === 0) styling += " border-t-4";
              if (colIndex % 3 === 0) styling += " border-l-4";
              if (rowIndex === 8) styling += " border-b-4";
              if (colIndex === 8) styling += " border-r-4";

              if (
                selectedCell?.row === rowIndex &&
                selectedCell?.col === colIndex &&
                initialBoard?.[selectedCell.row][selectedCell.col] === null
              ) {
                styling += " bg-yellow-400";
              }

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() =>
                    setSelectedCell({ row: rowIndex, col: colIndex })
                  }
                  className={`w-12 h-12 flex items-center justify-center border border-blue-900 
                  ${styling} ${bgColor} ${textColor}`}
                >
                  <div
                    onClick={() => {
                      if (!initialBoard) return;
                      if (initialBoard[rowIndex][colIndex] !== null) return;

                      setSelectedCell({ row: rowIndex, col: colIndex });
                    }}
                    className={`${isInitial ? "" : "font-bold"} w-10 h-10 flex items-center justify-center text-2xl`}
                  >
                    {cell ?? ""}
                  </div>
                </div>
              );
            }),
          )}
        </section>
      )}
      <section className="flex justify-end mt-6">
        <NumberPad onNumberClick={handleNumberClick} />
      </section>
    </div>
  );
}

export default App;
