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
  saveFieldsToLS,
  saveWinToLS,
} from "./utils";

export const $puzzleList = createStore(getPuzzles());
export const $puzzle = createStore<Field>(Array(81).fill(0));
export const $history = createStore<History>({
  current: -1,
  steps: [],
  time: 0,
});

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
export const seveToPuzzleToLS = createEvent();

export const puzzleSelected = createEvent<Field>();
export const addSecToTime = createEvent();
export const openWinModal = createEvent();
export const initSudoku = createEvent<{
  puzzle: Field;
  history: History;
} | null>();

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
  source: [$puzzle, $history] as const,
  clock: userAction,
  fn: ([puzzle, history], action) => {
    return { puzzle, history, action };
  },
  target: changeCellFx,
});

sample({ clock: changeCellFx.failData, target: showCellError });

$history
  .on(undo, (state) => {
    return {
      ...state,
      current: state.current >= 0 ? state.current - 1 : state.current,
    };
  })
  .on(redo, (state) => {
    return {
      ...state,
      current: state.steps[state.current + 1]
        ? state.current + 1
        : state.current,
    };
  })
  .on(changeCellFx.doneData, (state, newHistory) => {
    return newHistory ? newHistory : state;
  })
  .on(initSudoku, (state, data) => {
    return data ? data.history : state;
  })
  .on(puzzleSelected, (_, puzzle) => {
    let [savedPuzzle, savedHistory] = getSavedFromLS();

    if (puzzle.join("") === savedPuzzle.join("")) {
      return savedHistory;
    } else {
      return {
        current: -1,
        steps: [],
        time: 0,
        started: Date.now(),
        lastStepTime: Date.now(),
      };
    }
  })
  .reset(resetClicked);

$puzzle
  .on(puzzleSelected, (state, puzzleStr) => {
    return puzzleStr;
  })
  .on(initSudoku, (state, data) => {
    return data ? data.puzzle : state;
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
  source: [$puzzle, $history] as const,
  clock: [
    changeCellFx.doneData,
    puzzleSelected,
    resetClicked,
    userAction,
    seveToPuzzleToLS,
  ],
}).watch(([puzzle, history]) => {
  // console.log("SAVED", history.current);
  saveFieldsToLS(puzzle, history);
});

// $candidates.watch(console.log);
// $field.watch(console.log);
// $history.watch(console.log);

export const $field = combine($puzzle, $history, (puzzle, history) => {
  return applyEditCellActions(puzzle, history);
});
export const $candidates = combine($puzzle, $history, (puzzle, history) => {
  return applyStepsForCandidates(puzzle, history);
});
export const $isWin = $field.map((field) => field.every((it) => it > 0));

export const payerWins = $isWin.updates.filter({
  fn: (isWin) => isWin,
});

sample({ clock: payerWins, target: openWinModal });

sample({ source: $puzzle, clock: payerWins }).watch((puzzle) => {
  saveWinToLS(puzzle);
});

sample({
  source: $history,
  clock: addSecToTime,
  filter: $isWin.map((it) => !it),
  fn: (history) => {
    return { ...history, time: history.time + 1 };
  },
  target: $history,
});
