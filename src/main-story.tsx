import "./main.css";
import css from "./app.module.css";
import { render } from "preact";
import { StoryPage } from "./story/StoryPage";

render(
  <div class={css.root}>
    <StoryPage />
  </div>,
  document.getElementById("app")!,
);
