import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  build: {
    rollupOptions: {
      input: {
        backlog: "backlog.html",
        story: "story.html",
        slack: "slack.html",
        sudoku: "sudoku.html",
      },
    },
  },
});
