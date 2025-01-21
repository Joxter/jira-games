import { isInvalid } from "./lib/sudoku-solver";
import {
  Action,
  Candidates,
  ChangeCellProps,
  Field,
  History,
  WinsPersistent,
} from "./types";
import { Difficulty } from "./lib";
import {
  all_difficulties,
  DIFFICULTY_EASY,
  DIFFICULTY_EXPERT,
  DIFFICULTY_HARD,
  DIFFICULTY_MASTER,
  DIFFICULTY_MEDIUM,
} from "./lib/constants";

export const CANDIDATES = [
  1 << 0,
  1 << 1,
  1 << 2,
  1 << 3,
  1 << 4,
  1 << 5,
  1 << 6,
  1 << 7,
  1 << 8,
  1 << 9,
];

export function applyStepsForNumbers(history: History): Field {
  const res = parseToField(history.puzzle);
  let { current, steps } = history;

  for (let i = 0; i <= current; i++) {
    let { type, cell, value } = steps[i];
    if (type === "reveal-cell") {
      res[cell] = value;
    } else if (type === "edit-cell") {
      if (res[cell] == value) {
        res[cell] = 0;
      } else {
        res[cell] = value;
      }
    } else if (type === "edit-candidate") {
      res[cell] = 0;
    }
  }

  return res;
}

export function applyStepsForCandidates({
  steps,
  current,
}: History): Candidates {
  let res = Array(81).fill(0);

  for (let i = 0; i <= current; i++) {
    let { type, cell, value } = steps[i];
    if (type === "edit-cell") {
      res[cell] = 0;
      getBox(cell).forEach((c) => {
        res[c] = res[c] & ~CANDIDATES[value];
      });
    } else if (type === "edit-candidate") {
      if (value === 0) {
        res[cell] = 0;
      } else {
        res[cell] = res[cell] ^ CANDIDATES[value];
      }
    }
  }

  return res;
}

export function changeCellEffectHandler(data: ChangeCellProps): History | null {
  const { history, action } = data;
  const puzzle = history.puzzle.split("").map((it) => +it);
  const { cell, value, type } = action;
  if (puzzle[cell]) return null;

  let field = applyStepsForNumbers(history);

  if (type === "edit-cell" || type === "reveal-cell") {
    if (field[cell] !== value && value > 0) {
      let errCells = isInvalid(field, cell, value);
      if (errCells) throw errCells;
    }
  } else if (type === "edit-candidate") {
    // do nothing
  } else {
    console.warn("UNREACHABLE, wrong type: " + type);
    return null;
  }

  if (history.current === history.steps.length - 1) {
    return {
      ...history,
      steps: [...history.steps, action],
      current: history.current + 1,
      lastStepTime: Date.now(),
    };
  }

  return {
    ...history,
    steps: [...history.steps.slice(0, history.current + 1), action],
    current: history.current + 1,
    lastStepTime: Date.now(),
  };
}

export function getDifficulty(
  puzzles: Record<Difficulty, Field[]>,
  target: string,
): Difficulty {
  return (
    all_difficulties.find((d) => {
      return puzzles[d].map((it) => it.join("")).includes(target);
    }) || all_difficulties[0]
  );
}

export function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function viewCandidates(candidates: number): number[] {
  return candidates
    .toString(2)
    .split("")
    .reverse()
    .map((it, i) => (it === "1" ? i : 0))
    .filter((n) => n > 0);
}

export function getWinsFromLS() {
  try {
    let wins: WinsPersistent = JSON.parse(localStorage.getItem("sudoku-wins")!);
    return wins || {};
  } catch (err) {
    console.error(err);
    return {};
  }
}

export const difToLocale = {
  [DIFFICULTY_EASY]: "1",
  [DIFFICULTY_MEDIUM]: "2",
  [DIFFICULTY_HARD]: "3",
  [DIFFICULTY_EXPERT]: "4",
  [DIFFICULTY_MASTER]: "5",
} as const;

export function saveWinToLS(puzzle: string) {
  try {
    let wins = getWinsFromLS();

    wins[puzzle] = { win: true, winDate: Date.now() };
    localStorage.setItem(`sudoku-wins`, JSON.stringify(wins));
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export function saveHistoryToLS(history: History) {
  try {
    let saved = getSavedFromLS();

    let rewriteIndex = saved.findIndex((it) => history.puzzle === it.puzzle);
    if (rewriteIndex > -1) {
      saved[rewriteIndex] = history;
    } else {
      saved.push(history);
    }

    localStorage.setItem(`sudoku-history`, JSON.stringify(saved));
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export function resetLS() {
  localStorage.removeItem("sudoku-history");
  // localStorage.removeItem("sudoku-wins");
}

export function removeFromHistoryLS(puzzle: string) {
  try {
    let saved = getSavedFromLS();

    localStorage.setItem(
      `sudoku-history`,
      JSON.stringify(saved.filter((it) => it.puzzle !== puzzle)),
    );
  } catch (err) {
    // console.error(err);
    return [];
  }
}

export function getSavedFromLS(): History[] {
  try {
    let historyRaw = JSON.parse(localStorage.getItem("sudoku-history") || "[]");
    if (Array.isArray(historyRaw)) {
      return historyRaw;
    } else if (historyRaw.puzzle && historyRaw.history) {
      return [
        {
          ...historyRaw.history,
          puzzle: Array.isArray(historyRaw.puzzle)
            ? historyRaw.join("")
            : historyRaw.puzzle,
        },
      ];
    }
    return [];
  } catch (err) {
    // console.error(err);
    return [];
  }
}

export function getHighlightCells(current: number | null) {
  let res = [] as number[];
  if (current === null) return res;

  // row
  let start = current - (current % 9);
  for (let i = start; i < start + 9; i++) {
    res.push(i);
  }
  //col
  for (let i = current % 9; i < 81; i += 9) {
    res.push(i);
  }
  /*
   0  1  2  3  4  5  6  7  8
   9 10 11 12 13 14 15 16 17
  18 19 20 21 22 23 24 25 26
  27 28 29 30 31 32 33 34 35
  36 37 38 39 40 41 42 43 44
  45 46 47 48 49 50 51 52 53
  54 55 56 57 58 59 60 61 62
  63 64 65 66 67 68 69 70 71
  72 73 74 75 76 77 78 79 80
   */
  for (const start of [0, 3, 6, 27, 30, 33, 54, 57, 60]) {
    let box = [];
    for (let i = start; i < start + 3; i++) box.push(i);
    for (let i = start + 9; i < start + 3 + 9; i++) box.push(i);
    for (let i = start + 9 + 9; i < start + 3 + 9 + 9; i++) box.push(i);

    if (box.includes(current)) {
      res.push(...box);
    }
  }

  return res as number[];
}

export function isValidPuzzle(puzzle: number[]): boolean {
  return (
    puzzle.every((it) => {
      return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(it);
    }) && puzzle.length === 81
  );
}

export function fieldToLayout(field: number[]): [number, number][][] {
  //            [ value,  index]
  const layout: [number, number][][] = Array(9)
    .fill(0)
    .map(() => Array(9));

  field.forEach((val, _i) => {
    const rowI = Math.floor(_i / 9);

    const outer = {
      i: Math.floor(rowI / 3) * 3,
      j: (rowI % 3) * 3,
    };

    const colJ = _i % 9;

    const i = outer.i + Math.floor(colJ / 3);
    const j = outer.j + (colJ % 3);

    layout[i][j] = [val, _i];
  });

  return layout;
}

type Params = {
  power: number;
  boxWidth: number;
  boxHeight: number;
};

const classic9Params: Params = {
  power: 9,
  boxWidth: 3,
  boxHeight: 3,
};

export function fastSolve(
  _board: Field,
  params: Params = classic9Params,
): Field | null {
  let board = [..._board];
  let win = [..._board];

  for (let i = 0; i < params.power * params.power; i++) {
    if (board[i] && isInvalid(i, board[i]) !== false) {
      return null;
    }
  }
  console.log("GO");

  let solutionCount = solveSudoku();

  return solutionCount === 1 ? win : null;

  function isInvalid(index: number, num: number): number[] | false {
    const row = Math.floor(index / params.power);
    const col = index % params.power;
    const res = new Set<number>();

    for (let i = 0; i < params.power; i++) {
      if (board[row * params.power + i] === num)
        res.add(row * params.power + i);
      if (board[col + params.power * i] === num)
        res.add(col + params.power * i);
    }

    const startRow = row - (row % params.boxHeight);
    const startCol = col - (col % params.boxWidth);
    for (let i = 0; i < params.boxHeight; i++) {
      for (let j = 0; j < params.boxWidth; j++) {
        if (board[(startRow + i) * params.power + startCol + j] === num) {
          res.add((startRow + i) * params.power + startCol + j);
        }
      }
    }

    res.delete(index);
    return res.size === 0 ? false : [...res];
  }

  function solveSudoku(): number {
    let solutionCount = 0;

    _solveSudoku();

    return solutionCount;

    function _solveSudoku(): boolean {
      for (let i = 0; i < params.power * params.power; i++) {
        if (board[i]) continue;

        for (let num = 1; num <= params.power; num++) {
          if (isInvalid(i, num)) continue;

          board[i] = num;
          _solveSudoku();
          if (solutionCount > 1) {
            return false;
          }
          board[i] = 0;
        }

        return false;
      }
      solutionCount++;
      win = [...board];
      return solutionCount === 1;
    }
  }
}

export function formatTime(time: number) {
  let hour = Math.floor(time / (60 * 60));
  let min = Math.floor((time % 3600) / 60);
  let sec = time % 60;

  return [hour, min, sec].map((it) => it.toString().padStart(2, "0")).join(":");
}

export function getRow(index: number): number[] {
  const row = Math.floor(index / 9);
  let res = [];
  for (let i = 0; i < 9; i++) res.push(row * 9 + i);
  return res;
}

export function getCol(index: number): number[] {
  const col = index % 9;
  const res = [];
  for (let i = 0; i < 9; i++) res.push(col + 9 * i);
  return res;
}

export function getBox(index: number): number[] {
  const row = Math.floor(index / 9);
  const col = index % 9;

  const res = [];
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      res.push((startRow + i) * 9 + startCol + j);
    }
  }
  return res;
}

export function getRelated(index: number): number[] {
  return [...new Set([...getRow(index), ...getCol(index), ...getBox(index)])];
}

function parseToField(str: string) {
  return str.split("").map((it) => +it);
}

export function getPuzzleFromUrl(): Field | null {
  let url = new URL(window.location.href);
  let puzzle = url.searchParams.get("puzzle");

  if (puzzle) {
    let puzzleRaw = puzzle.split("").map((it) => +it);

    if (isValidPuzzle(puzzleRaw)) {
      return puzzleRaw;
    }
  }

  return null;
}

export function notNull<T>(value: T | null): value is T {
  return value !== null;
}
