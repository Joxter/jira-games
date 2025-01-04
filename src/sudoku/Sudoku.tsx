import { initSudoku } from "./sudoku.model";
import { useEffect, useState } from "preact/hooks";
import css from "./PuzzlePage.module.css";
import { PuzzlePage } from "./PuzzlePage";
import { SudokuList } from "./SudokuList";
import { getPuzzleFromUrl, getSavedFromLS, resetLS } from "./utils";
import { Route, Router, Switch } from "wouter";

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
  return (
    <div className={css.page}>
      {false && <DebugLS />}
      <Router base="https://joxter.github.io/jira-games/">
        <Switch>
          <Route path="/" component={SudokuList} />
          <Route path="/new-game" component={SudokuList} />
          <Route path="/current-game" component={PuzzlePage} />
          <Route path="/settings" component={SettingPage} />
        </Switch>
      </Router>
    </div>
  );
}

function SettingPage() {
  return <div>settings</div>;
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
