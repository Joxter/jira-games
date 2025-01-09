import "./main.css";
import css from "./app.module.css";
import { render } from "preact";
import { SudokuRouter } from "./sudoku/SudokuRouter.tsx";

render(
  <div class={css.root}>
    <SudokuRouter />
  </div>,
  document.getElementById("app")!,
);
