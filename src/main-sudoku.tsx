import "./main.css";
import css from "./app.module.css";
import { render } from "preact";
import { Sudoku } from "./sudoku/Sudoku";

render(
  <div class={css.root}>
    <Sudoku />
  </div>,
  document.getElementById("app")!,
);
