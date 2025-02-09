import { initSudoku } from "./sudoku.model";
import { useEffect, useState } from "react";
import { PuzzlePage } from "./PuzzlePage";
import { NewGamePage } from "./NewGamePage.tsx";
import { getPuzzleFromUrl, getSavedFromLS, resetLS } from "./utils";
import { Route, Router, Switch } from "wouter";
import { SettingPage } from "./SettingsPage.tsx";

const initP = getPuzzleFromUrl();
const allHistory = getSavedFromLS();

if (initP) {
  let savedLogs = allHistory.find((it) => initP.field.join("") === it.puzzle);

  if (savedLogs) {
    initSudoku([savedLogs.puzzle, allHistory, savedLogs.layout]);
  } else {
    initSudoku([null, allHistory, null]);
  }
} else {
  initSudoku([null, allHistory, null]);
}

const prefix =
  location.origin === "https://joxter.github.io" ? "/jira-games" : "";

export function SudokuRouter() {
  return (
    <>
      {false && <DebugLS />}
      <Router base={prefix}>
        <Switch>
          <Route path="/" component={NewGamePage} />
          <Route path="/new-game" component={NewGamePage} />
          <Route path="/current-game" component={PuzzlePage} />
          <Route path="/settings" component={SettingPage} />
          <Route path="/debug" component={DebugLS} />
          <Route path="*" component={NotFound} />
        </Switch>
      </Router>
    </>
  );
}

function NotFound() {
  return <p>404</p>;
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
