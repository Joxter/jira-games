import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";
import { Action, ChangeCellProps, Field, History } from "./types";
import {
  applyEditCellActions,
  applyStepsForCandidates,
  changeCellHandler,
  getSavedFromLS,
  getHighlightCells,
  getPuzzles,
  saveHistoryToLS,
  saveWinToLS,
} from "./utils";

export const $puzzleList = createStore(getPuzzles());
export const $puzzle = createStore<string>("");
export const $currentLogs = createStore<History | null>(null);
export const $allHistory = createStore<History[]>([]);

export const $currentCell = createStore<number | null>(null);
export const $highLightCells = $currentCell.map(getHighlightCells);

const changeCellFx = createEffect<ChangeCellProps, History | null, number[]>(
  changeCellHandler,
);

export const undo = createEvent();
export const redo = createEvent();
export const resetClicked = createEvent();
export const winClicked = createEvent();
export const winCloseClicked = createEvent();
export const seveToPuzzleToLS = createEvent<any>();

export const puzzleSelected = createEvent<string>();
export const addSecToTime = createEvent();
export const openWinModal = createEvent();
export const initSudoku = createEvent<[string | null, History[]]>();

// gameplay
export const arrowClicked = createEvent<string>();
export const cellClicked = createEvent<number | null>();
export const cellChanged = createEvent<number>();
export const cellCandidateChanged = createEvent<number>();
export const userAction = createEvent<Action>();
export const showCellError = createEvent<number[]>();

sample({
  source: $currentCell,
  clock: cellChanged,
  filter: $currentCell.map((it) => it !== null),
  fn: (cell, value) => {
    return { cell: cell!, value, type: "edit-cell" as const };
  },
  target: userAction,
});
sample({
  source: $currentCell,
  clock: cellCandidateChanged,
  filter: $currentCell.map((it) => it !== null),
  fn: (cell, value) => {
    return { cell: cell!, value, type: "edit-candidate" as const };
  },
  target: userAction,
});

sample({
  source: [$puzzle, $currentLogs] as const,
  clock: userAction,
  fn: ([puzzle, history], action) => {
    return { puzzle, history: history!, action };
  },
  target: changeCellFx,
});

sample({ clock: changeCellFx.failData, target: showCellError });

$currentLogs
  .on(undo, (state) => {
    if (!state) return state;

    return {
      ...state,
      current: state.current >= 0 ? state.current - 1 : state.current,
    };
  })
  .on(redo, (state) => {
    if (!state) return state;

    return {
      ...state,
      current: state.steps[state.current + 1]
        ? state.current + 1
        : state.current,
    };
  })
  .on(changeCellFx.doneData, (state, newLogs) => {
    return newLogs ? newLogs : state;
  })
  .on(initSudoku, (state, [initPuzzle, allHistory]) => {
    let current = allHistory.find((it) => it.puzzle === initPuzzle);
    return current || state;
  })
  .on(puzzleSelected, (_, puzzle): History => {
    let savedHistory = getSavedFromLS();

    let currentLogs = savedHistory.find((it) => it.puzzle === puzzle);

    if (currentLogs) {
      return currentLogs;
    } else {
      return {
        puzzle,
        current: -1,
        steps: [],
        time: 0,
        started: Date.now(),
        lastStepTime: Date.now(),
      };
    }
  })
  .reset(resetClicked);

$allHistory.on(initSudoku, (state, [, allHistory]) => {
  return allHistory;
});

$puzzle
  .on(puzzleSelected, (state, puzzleStr) => {
    return puzzleStr;
  })
  .on(initSudoku, (state, [puzzle]) => {
    return puzzle || state;
  });

$currentCell
  .on(cellClicked, (_, n) => n)
  .on(arrowClicked, (current, dir) => {
    if (current === null) return null;
    let newPos = {
      ArrowUp: current - 9,
      ArrowDown: current + 9,
      ArrowLeft: current - 1,
      ArrowRight: current + 1,
    }[dir];

    if (newPos !== undefined && newPos >= 0 && newPos < 81) {
      return newPos;
    }
    return null;
  });

sample({
  source: $currentLogs,
  clock: [
    changeCellFx.doneData,
    puzzleSelected,
    resetClicked,
    // userAction.filter({ fn: ({ type }) => type === "edit-candidate" }),
    seveToPuzzleToLS,
  ],
}).watch((logs) => {
  // console.log("SAVED", logs);
  if (logs) saveHistoryToLS(logs);
});

// $candidates.watch(console.log);
// $field.watch(console.log);
// $currentLogs.watch(console.log);

export const $field = $currentLogs.map((history) => {
  return history ? applyEditCellActions(history) : null;
});
export const $candidates = $currentLogs.map((history) => {
  return history ? applyStepsForCandidates(history) : null;
});
export const $isWin = $field.map(
  (field) => field && field.every((it) => it > 0),
);

export const payerWins = $isWin.updates.filter({
  fn: (isWin) => !!isWin,
});

sample({ clock: payerWins, target: openWinModal });

sample({ source: $puzzle, clock: payerWins }).watch((puzzle) => {
  saveWinToLS(puzzle);
});

sample({
  source: $currentLogs,
  clock: addSecToTime,
  filter: $isWin.map((it) => !it),
  fn: (history) => {
    if (!history) return history;
    return { ...history, time: history.time + 1 };
  },
  target: $currentLogs,
});
