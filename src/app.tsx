import css from "./app.module.css";
// import { StoryPage } from "./story/StoryPage";
import { BacklogPage } from "./backlog/BacklogPage";

export function App() {
  return (
    <div class={css.root}>
      {/* <StoryPage /> */}
      <BacklogPage />
    </div>
  );
}
