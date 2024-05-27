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
  applyStepsForCandidates,
  changeCellHandler,
  getFieldsFromLS,
  getHighlightCells,
  getPuzzles,
  isValidPuzzle,
  saveFieldsToLS,
} from "./utils";

export const $puzzleList = createStore(getPuzzles());
export const $puzzle = createStore<Field>(getFieldsFromLS()[0]);

export const $currentCell = createStore<number | null>(null);
export const $highLightCells = $currentCell.map(getHighlightCells);

const changeCellFx = createEffect<
  ChangeCellProps,
  { field: Field; history: History } | null,
  number[]
>(changeCellHandler);

export const $history = createStore<History>(getFieldsFromLS()[1]);
export const undo = createEvent();
export const redo = createEvent();
export const resetClicked = createEvent();

export const $candidates = combine($puzzle, $history, applyStepsForCandidates);

export const puzzleSelected = createEvent<string>();
export const pageOpened = createEvent();
export const arrowClicked = createEvent<string>();
export const cellClicked = createEvent<number | null>();
export const cellChanged = createEvent<number>();
export const cellCandidateChanged = createEvent<number>();
export const showCellError = createEvent<number[]>();

$puzzle.on(changeCellFx.doneData, (state, res) => (res ? res.field : state));

sample({
  source: [$puzzle, $history, $currentCell] as const,
  clock: cellChanged,
  fn: ([puzzle, history, cell], value) => {
    return { puzzle, history, cell, value };
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
  .on([puzzleSelected, resetClicked], () => {
    console.log('puzzleSelected');
    return { steps: [], current: -1 };
  });

$puzzle.on(puzzleSelected, (state, puzzleStr) => {
  let puzzle = puzzleStr.split("").map((it) => +it);

  return isValidPuzzle(puzzle) ? puzzle : state;
});

sample({
  source: [$history, $currentCell] as const,
  clock: cellCandidateChanged,
  fn: ([history, index], val) => {
    return addCandidateToHistory(history, index, val);
  },
  target: $history,
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

$history.watch(console.log);

sample({
  source: [$puzzle, $history] as const,
  clock: [changeCellFx.doneData, cellCandidateChanged],
}).watch(([field, history]) => {
  console.log("SAVED", history.current);
  saveFieldsToLS(field, history);
});
