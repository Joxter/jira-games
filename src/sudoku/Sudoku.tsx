import { useUnit } from "effector-react";
import { puzzleSelected } from "./sudoku.model";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import css from "./PuzzlePage.module.css";
import { PuzzlePage } from "./PuzzlePage";
import { SudokuList } from "./SudokuList";

export function Sudoku() {
  const [page, setPage] = useState(location.hash || "#list"); // #list

  useEffect(() => {
    function handler() {
      setPage(location.hash || "#list");
    }
    window.addEventListener("hashchange", handler);

    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const PageComponent = useMemo(() => {
    if (page === "#list") {
      return SudokuList;
    }
    if (page.startsWith("#puzzle-")) {
      puzzleSelected(page.split("-")[1]);
      return PuzzlePage;
    }
    console.log("NOT FOUND", [page]);
    return null;
  }, [page]);

  return (
    <div className={css.page}>
      <a href="#list">to list</a>
      {PageComponent && <PageComponent key={page} />}
    </div>
  );
}
