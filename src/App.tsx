import { useEffect, useState } from "react";
import "./App.css";
import { fetchSudoku } from "./services/sudokuApi";

function App() {
  const [board, setBoard] = useState<number[][] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPuzzle = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchSudoku();
        console.log("API DATA:", data);
        setBoard(data.puzzle); // adjust based on API response shape
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

  return (
    <section className="flex flex-col items-center justify-center h-screen bg-linear-to-r from-blue-400 to-purple-600">
      <h1 className="text-6xl text-white">SUDOKU</h1>
      {loading && <p className="text-white mt-4">Loading...</p>}
      {error && <p className="text-red-400 mt-4">{error}</p>}

      {board && (
        <div className="max-w-fit grid grid-cols-9">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const boxRow = Math.floor(rowIndex / 3);
              const boxCol = Math.floor(colIndex / 3);
              const isLightBox = (boxRow + boxCol) % 2 === 0;

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-12 h-12 flex items-center justify-center border border-gray-300 ${
                    isLightBox ? "bg-white" : "bg-gray-200"
                  }`}
                >
                  <input
                    value={cell ?? ""}
                    type="text"
                    maxLength={1}
                    disabled={cell !== null}
                    onChange={(e) =>
                      handleInputEdit(e.target.value, rowIndex, colIndex)
                    }
                    className="w-full h-full text-center text-lg bg-transparent focus:outline-none"
                  />
                </div>
              );
            }),
          )}
        </div>
      )}
    </section>
  );
}

export default App;
