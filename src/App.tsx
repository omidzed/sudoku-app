import { useEffect, useState } from "react";
import "./App.css";
import { fetchSudoku } from "./services/sudokuApi";
import type { Board } from "./types";
import { NumberPad } from "./NumberPad";

function App() {
  const [board, setBoard] = useState<Board | null>(null);
  const [initialBoard, setInitialBoard] = useState<Board | null>(null);
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPuzzle = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchSudoku();
        console.log("API DATA:", data);
        setBoard(data.puzzle);
        setInitialBoard(data.puzzle);
      } catch (err) {
        console.error(err);
        setError("Failed to load Sudoku!");
      } finally {
        setLoading(false);
      }
    };

    loadPuzzle();
  }, []);

  const handleInputEdit = (
    value: string,
    rowIndex: number,
    colIndex: number,
  ) => {
    if (!board) return;

    const newBoard = board.map((row) => [...row]);
    const num = Number(value);

    if (value === "") {
      newBoard[rowIndex][colIndex] = null;
    } else if (!isNaN(num) && num >= 1 && num <= 9) {
      newBoard[rowIndex][colIndex] = num;
    } else {
      return;
    }
    setBoard(newBoard);
  };

  const handleNumberClick = (clickedNumber: number) => {
    if (!board || !selectedCell) return;
    const newBoard = board.map((row) => [...row]);
    newBoard[selectedCell.row][selectedCell.col] = clickedNumber;
    setBoard(newBoard);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh w-full bg-linear-to-r from-blue-400 to-purple-600">
      <h1 className="text-6xl text-white p-6">SUDOKU</h1>

      {loading && <p className="text-white mt-4">Loading...</p>}
      {error && <p className="text-red-400 mt-4">{error}</p>}

      {board && (
        <section className="max-w-fit grid grid-cols-9">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              let styling = "";

              if (rowIndex % 3 === 0) styling += " border-t-4";
              if (colIndex % 3 === 0) styling += " border-l-4";
              if (rowIndex === 8) styling += " border-b-4";
              if (colIndex === 8) styling += " border-r-4";
              if (
                selectedCell?.row === rowIndex &&
                selectedCell?.col === colIndex
              )
                styling += " bg-yellow-400";

              const boxRow = Math.floor(rowIndex / 3);
              const boxCol = Math.floor(colIndex / 3);
              const isLightBox = (boxRow + boxCol) % 2 === 0;

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() =>
                    setSelectedCell({ row: rowIndex, col: colIndex })
                  }
                  className={`w-12 h-12 flex items-center justify-center border border-blue-900  ${
                    isLightBox
                      ? "bg-white text-blue-800"
                      : "bg-blue-400 text-white"
                  } 
                  ${styling}`}
                >
                  <input
                    value={cell ?? ""}
                    type="text"
                    maxLength={1}
                    disabled={initialBoard?.[rowIndex][colIndex] !== null}
                    onChange={(e) =>
                      handleInputEdit(e.target.value, rowIndex, colIndex)
                    }
                    className="w-full h-full text-center text-2xl bg-transparent focus:outline-none"
                  />
                </div>
              );
            }),
          )}
        </section>
      )}
      <section className="mt-6">
        <NumberPad onNumberClick={handleNumberClick} />
      </section>
    </div>
  );
}

export default App;
