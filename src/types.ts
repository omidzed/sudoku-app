export type Cell = number | null;

export type Board = Cell[][];

export type SudokuBoard = {
  puzzle: Board;
  solution:Board;
};