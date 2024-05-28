import { initSudoku, puzzleSelected } from "./sudoku.model";
import { useEffect, useMemo, useState } from "preact/hooks";
import css from "./PuzzlePage.module.css";
import { PuzzlePage } from "./PuzzlePage";
import { SudokuList } from "./SudokuList";
import { getFieldsFromLS, isValidPuzzle } from "./utils";
import { Field } from "./types";

function getPuzzleFromUrl(): Field | null {
  let h = location.hash;

  if (h.startsWith("#puzzle-")) {
    let puzzleRaw = h
      .split("-")[1]
      .split("")
      .map((it) => +it);

    if (isValidPuzzle(puzzleRaw)) {
      return puzzleRaw;
    }
  }

  return null;
}

const initP = getPuzzleFromUrl();
const [lastField, lastHistory] = getFieldsFromLS();

if (initP) {
  if (lastField.join("") === initP.join("")) {
    initSudoku({ puzzle: lastField, history: lastHistory });
  } else {
    initSudoku(null);
  }
} else {
  initSudoku(null);
}

export function Sudoku() {
  const [page, setPage] = useState(initP ? location.hash : "#list");

  useEffect(() => {
    function handler() {
      setPage(location.hash || "#list");
    }
    window.addEventListener("hashchange", handler);

    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const PageComponent = useMemo(() => {
    const initP = getPuzzleFromUrl();
    if (initP) {
      puzzleSelected(initP);
      return PuzzlePage;
    } else {
      return SudokuList;
    }
  }, [page]);

  return (
    <div className={css.page}>
      <a href="#list">to list</a>
      <PageComponent key={page} />
    </div>
  );
}
