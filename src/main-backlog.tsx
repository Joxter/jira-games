import "./main.css";
import css from "./app.module.css";
import { render } from "preact";
import { BacklogPage } from "./backlog/BacklogPage";

render(
  <div class={css.root}>
    <BacklogPage />
  </div>,
  document.getElementById("app")!,
);
