import { initSudoku, puzzleSelected } from "./sudoku.model";
import { useEffect, useMemo, useState } from "preact/hooks";
import css from "./PuzzlePage.module.css";
import { PuzzlePage } from "./PuzzlePage";
import { SudokuList } from "./SudokuList";
import { getSavedFromLS, isValidPuzzle, resetLS } from "./utils";
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
const allHistory = getSavedFromLS();

if (initP) {
  let savedLogs = allHistory.find((it) => initP.join("") === it.puzzle);

  if (savedLogs) {
    initSudoku([initP.join(""), allHistory]);
  } else {
    initSudoku([null, allHistory]);
  }
} else {
  initSudoku([null, allHistory]);
}

export function Sudoku() {
  const [page, setPage] = useState(initP ? location.hash : "#list");

  useEffect(() => {
    function handler() {
      console.log("hashchange", location.hash);
      setPage(location.hash || "#list");
    }
    window.addEventListener("hashchange", handler);

    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const PageComponent = useMemo(() => {
    // console.log('123');
    const initP = getPuzzleFromUrl();
    if (initP) {
      puzzleSelected(initP.join(""));
      return PuzzlePage;
    } else {
      return SudokuList;
    }
  }, [page]);

  return (
    <div className={css.page}>
      <DebugLS />
      <PageComponent key={page} />
    </div>
  );
}

function DebugLS() {
  const [LS, setLS] = useState(getSavedFromLS());

  useEffect(() => {
    let id = setInterval(() => {
      setLS(getSavedFromLS());
    }, 300);

    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <div style={{ overflow: "hidden" }}>
      <p style={{ wordWrap: "break-word" }}>{JSON.stringify(LS)}</p>
      <button
        onClick={() => {
          resetLS();
        }}
      >
        reset LS
      </button>
    </div>
  );
}
