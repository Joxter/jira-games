import css from "./app.module.css";
import { StoryPage } from "./story/StoryPage";

export function App() {
  return (
    <div class={css.root}>
      <StoryPage />
    </div>
  );
}
