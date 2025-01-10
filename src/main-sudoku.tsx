import "./main.css";
import { createRoot } from "react-dom/client";
import { SudokuRouter } from "./sudoku/SudokuRouter.tsx";

const root = createRoot(document.getElementById("app")!);
root.render(<SudokuRouter />);
