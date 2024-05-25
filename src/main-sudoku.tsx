import "./main.css";
import css from "./app.module.css";
import { render } from "preact";
import { SudokuPage } from "./sudoku/SudokuPage";

render(
  <div class={css.root}>
    <SudokuPage />
  </div>,
  document.getElementById("app")!,
);
