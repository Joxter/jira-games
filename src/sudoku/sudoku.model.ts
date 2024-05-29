import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";
import { ChangeCellProps, Field, History } from "./types";
import {
  addCandidateToHistory,
  applyEditCellActions,
  applyStepsForCandidates,
  changeCellHandler,
  getSavedFromLS,
  getHighlightCells,
  getPuzzles,
  saveFieldsToLS,
} from "./utils";

export const $puzzleList = createStore(getPuzzles());
export const $puzzle = createStore<Field>(Array(81).fill(0));
// export const $field = createStore<Field>(Array(81).fill(0));

export const $currentCell = createStore<number | null>(null);
export const $highLightCells = $currentCell.map(getHighlightCells);

const changeCellFx = createEffect<
  ChangeCellProps,
  { field: Field; history: History } | null,
  number[]
>(changeCellHandler);

export const $history = createStore<History>({ current: -1, steps: [] });
export const undo = createEvent();
export const redo = createEvent();
export const resetClicked = createEvent();

export const puzzleSelected = createEvent<Field>();
export const pageOpened = createEvent();
export const initSudoku = createEvent<{
  puzzle: Field;
  history: History;
} | null>();

// gameplay
export const arrowClicked = createEvent<string>();
export const cellClicked = createEvent<number | null>();
export const cellChanged = createEvent<number>();
export const cellCandidateChanged = createEvent<number>();
export const showCellError = createEvent<number[]>();

export const $candidates = combine($puzzle, $history, applyStepsForCandidates);
export const $field = combine($puzzle, $history, (puzzle, history) => {
  return applyEditCellActions(puzzle, history);
});

sample({
  source: [$puzzle, $history, $currentCell] as const,
  clock: cellChanged,
  fn: ([puzzle, history, cell], value) => {
    return { puzzle, history, cell, value, type: "edit-cell" as const };
  },
  target: changeCellFx,
});

sample({
  source: [$puzzle, $history, $currentCell] as const,
  clock: cellCandidateChanged,
  fn: ([puzzle, history, cell], value) => {
    return { puzzle, history, cell, value, type: "edit-candidate" as const };
  },
  target: changeCellFx,
});

sample({ clock: changeCellFx.failData, target: showCellError });

$history
  .on(undo, (state) => {
    return {
      steps: state.steps,
      current: state.current >= 0 ? state.current - 1 : state.current,
    };
  })
  .on(redo, (state) => {
    return {
      steps: state.steps,
      current: state.steps[state.current + 1]
        ? state.current + 1
        : state.current,
    };
  })
  .on(changeCellFx.doneData, (state, res) => {
    return res ? res.history : state;
  })
  .on(initSudoku, (state, data) => {
    return data ? data.history : state;
  })
  .on(puzzleSelected, (_, puzzle) => {
    let [savedPuzzle, savedHistory] = getSavedFromLS();

    if (puzzle.join("") === savedPuzzle.join("")) {
      return savedHistory;
    } else {
      return { current: -1, steps: [] };
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
    cellCandidateChanged,
    puzzleSelected,
    resetClicked,
  ],
}).watch(([puzzle, history]) => {
  console.log("SAVED", history.current);
  saveFieldsToLS(puzzle, history);
});
