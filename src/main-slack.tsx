import "./main.css";
import css from "./app.module.css";
import { render } from "preact";
import { SlackPage } from "./slack/SlackPage";

render(
  <div class={css.root}>
    <SlackPage />
  </div>,
  document.getElementById("app")!,
);
