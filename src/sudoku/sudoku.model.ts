import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";
import { Action, ChangeCellProps, Field, History, Layout } from "./types";
import {
  applyStepsForNumbers,
  applyStepsForCandidates,
  changeCellEffectHandler,
  getSavedFromLS,
  getHighlightCells,
  saveHistoryToLS,
  saveWinToLS,
  fastSolve,
} from "./utils";
import { getPuzzles } from "./puzzles/puzzles.ts";
import { Difficulty } from "./lib";

const simple6sudoku = "030400005603000100010305064031001046"
  .split("")
  .map((it) => +it);
const simple4sudoku = "0100300140020040".split("").map((it) => +it);

export const $puzzleList = createStore<
  Record<Layout, Record<Difficulty, Field[]>>
>({
  classic9: getPuzzles(),
  simple6: {
    easy: [simple6sudoku],
    medium: [simple6sudoku],
    hard: [simple6sudoku],
    expert: [simple6sudoku],
    master: [simple6sudoku],
  },
  simple4: {
    easy: [simple4sudoku],
    medium: [simple4sudoku],
    hard: [simple4sudoku],
    expert: [simple4sudoku],
    master: [simple4sudoku],
  },
} as const);
export const $currentLayout = createStore<Layout>("classic9");
export const $puzzle = createStore<{ puzzle: string; layout: Layout }>({
  layout: "classic9",
  puzzle: "",
});

export const $currentLogs = createStore<History | null>(null);
export const $allHistory = createStore<History[]>([]);

export const $currentCell = createStore<number | null>(null);
export const $inputMode = createStore<"normal" | "candidate">("normal");
export const $highLightCells = $currentCell.map(getHighlightCells);

const changeCellFx = createEffect<ChangeCellProps, History | null, number[]>(
  changeCellEffectHandler,
);

export const undo = createEvent();
export const redo = createEvent();
export const inputModeChanged = createEvent<"normal" | "candidate">();
export const resetClicked = createEvent();
export const winClicked = createEvent();
export const winCloseClicked = createEvent();
export const seveToPuzzleToLS = createEvent<any>();

export const puzzleSelected = createEvent<{ puzzle: string; layout: Layout }>();
export const layoutSelected = createEvent<Layout>();
export const addSecToTime = createEvent();
export const openWinModal = createEvent();
export const initSudoku =
  createEvent<[string | null, History[], Layout | null]>();

// gameplay
export const arrowClicked = createEvent<string>();
export const cellClicked = createEvent<number | null>();
export const revealNumber = createEvent<{ pos: number; number: number }>();
export const numberPressed = createEvent<number>();
export const numberWithShiftPressed = createEvent<number>();
export const userAction = createEvent<Action>();
export const showCellError = createEvent<number[]>();

$inputMode.on(inputModeChanged, (_, s) => s);

export const $solved = $puzzle.map(({ puzzle }) => {
  // todo fix fastSolve
  return puzzle ? fastSolve(puzzle.split("").map((a) => +a)) : null;
});

sample({
  source: $currentCell,
  clock: numberPressed,
  filter: $currentCell.map((it) => it !== null),
  fn: (cell, value) => {
    return { cell: cell!, value, type: "edit-cell" as const };
  },
  target: userAction,
});

sample({
  clock: revealNumber,
  fn: ({ pos, number }) => {
    return { cell: pos, value: number, type: "reveal-cell" as const };
  },
  target: userAction,
});

sample({
  source: $currentCell,
  clock: numberWithShiftPressed,
  filter: $currentCell.map((it) => it !== null),
  fn: (cell, value) => {
    return { cell: cell!, value, type: "edit-candidate" as const };
  },
  target: userAction,
});

sample({
  source: $currentCell,
  clock: numberPressed,
  filter: combine(
    $currentCell,
    $inputMode,
    (cell, mode) => cell !== null && mode === "candidate",
  ),
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
  .on(puzzleSelected, (_, { puzzle, layout }): History => {
    let savedHistory = getSavedFromLS();

    let currentLogs = savedHistory.find((it) => it.puzzle === puzzle);

    if (currentLogs) {
      return currentLogs;
    } else {
      return {
        layout,
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

$currentLayout.on(layoutSelected, (_, l) => l);

$puzzle
  .on(puzzleSelected, (state, { puzzle, layout }) => {
    return { puzzle, layout };
  })
  .on(initSudoku, (state, [puzzle, _, layout]) => {
    return puzzle && layout ? { puzzle, layout } : state;
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
  return history ? applyStepsForNumbers(history) : null;
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

sample({ source: $puzzle, clock: payerWins }).watch(({ puzzle }) => {
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
