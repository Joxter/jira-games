import { all_difficulties } from "./lib/constants";
import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";
import { isInvalid } from "./lib/sudoku-solver";

type Field = number[];
type Candidates = number[];

const CANDIDATES = [
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

type Diff = (typeof all_difficulties)[number];

type Action =
  | { type: "edit-cell"; id: number; val: number }
  | { type: "edit-candidate"; id: number; val: number };

export const $puzzle = createStore<Field>(getFieldsFromLS()[0]);

export const $currentCell = createStore<number | null>(null);
export const $highLightCells = $currentCell.map((current) => {
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
});

type ChangeCellProps = {
  puzzle: Field;
  history: History;
  cell: number | null;
  value: number;
};

const changeCellFx = createEffect<
  ChangeCellProps,
  { field: Field; history: History } | null,
  number
>((data) => {
  const { puzzle, history, cell, value } = data;
  if (cell === null) return null;
  let field = applyEditCellActions(puzzle, history);
  if (field[cell] === value) return null;

  let errCell = isInvalid(field, cell, value);
  if (typeof errCell === "number") return Promise.reject(errCell);

  field[cell] = value;
  const action = { type: "edit-cell" as const, id: cell, val: value };

  if (history.current === history.steps.length - 1) {
    return {
      field,
      history: {
        steps: [...history.steps, action],
        current: history.current + 1,
      },
    };
  }

  return {
    field,
    history: {
      steps: [...history.steps.slice(0, history.current + 1), action],
      current: history.current + 1,
    },
  };
});

type History = { steps: Action[]; current: number };

export const $history = createStore<History>(getFieldsFromLS()[1]);

export const undo = createEvent();
export const redo = createEvent();

export const $field = createStore<Field>(getFieldsFromLS()[0]);
$field.on(changeCellFx.doneData, (state, res) => {
  return res ? res.field : state;
});

export const $candidates = combine(
  $puzzle,
  $history,
  (puzzle, { steps, current }): Candidates => {
    let res = Array(81).fill(0);

    for (let i = 0; i <= current; i++) {
      let { type, id, val } = steps[i];
      if (type === "edit-cell") {
        res[id] = 0;
      } else if (type === "edit-candidate") {
        res[id] = res[id] ^ CANDIDATES[val];
      }
    }

    return res;
  },
);

export const diffClicked = createEvent<Diff>();
export const arrowClicked = createEvent<string>();
export const cellClicked = createEvent<number | null>();
export const cellChanged = createEvent<number>();
export const cellCandidateChanged = createEvent<number>();
export const resetClicked = createEvent();
export const showCellError = createEvent<number>();

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
  });

const diffClickedWithPuzzle = diffClicked.map((diff) => {
  let p = getPuzzles().filter(({ difficulty }) => difficulty === diff);

  return randomFrom(p).puzzle;
});

$puzzle.on(diffClickedWithPuzzle, (f, puzzle) => {
  return puzzle;
});

sample({
  source: [$history, $currentCell] as const,
  clock: cellCandidateChanged,
  fn: ([history, index], val) => {
    if (index === null) return history;

    if (history.current === history.steps.length - 1) {
      return {
        steps: [
          ...history.steps,
          { type: "edit-candidate" as const, id: index, val },
        ],
        current: history.current + 1,
      };
    } else {
      return {
        steps: [
          ...history.steps.slice(0, history.current + 1),
          { type: "edit-candidate" as const, id: index, val },
        ],
        current: history.current + 1,
      };
    }
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

combine($puzzle, $history).watch(([field, history]) => {
  saveFieldsToLS(field, history);
});

function saveFieldsToLS(field: Field, history: History) {
  try {
    localStorage.setItem("sudoku_history", JSON.stringify(history));
    localStorage.setItem("sudoku_field", JSON.stringify(field));
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

function getFieldsFromLS(): [Field, History] {
  try {
    let rawPuzzle = localStorage.getItem("sudoku_field") || "";
    let rawHistory = localStorage.getItem("sudoku_history") || "";
    let puzzle = JSON.parse(rawPuzzle) as any as any[];
    let history = JSON.parse(rawHistory) as any;

    if (
      puzzle.every((it) => {
        return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(it);
      }) &&
      puzzle.length === 81
    ) {
      return [applyEditCellActions(puzzle, history) as Field, history];
    }
    return [Array(81).fill(0), { current: -1, steps: [] }];
  } catch (err) {
    console.error(err);
    return [Array(81).fill(0), { current: -1, steps: [] }];
  }
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getPuzzles() {
  return `easy 000900250600000000000007004032045080080370010175000400000000608790800500000259130
medium 000002600050800040006007890000009506008020007000070001200000000000108000301045000
easy 413000090000000004950002000000100809200340050164800000000008001531000007829601000
medium 006001300200070000375000004020010009060208000000000100832007050000084003601005007
hard 050080046000000510400201308000009080000000000010807600200030000000900805004000007
expert 500000300000208010006010027070000000450000700001760040000070800020000090004035000
master 013050000002000000040006705300004800000080457000900003257063080600290000000000000
easy 090080570805002600007053002000200700304000000000437000700001056006020809510000300
medium 000820630020100000800006007095000000000300008700000500004005780000000002500609000
hard 005090004002680050100004000080030065000060200050009700809040023000000000060000407
expert 509000008000000000000003045080300204091020803000006000000052910600007000010000000
easy 760028003004000090080340000453000007021750000870490000200000001000000700005901840
medium 040080300009200007000700940004000801006300500000007000000050008100609000067000003
hard 700200060960000008000008000000070094070300000052000030000500001501007900030800407
expert 000050030500000107004007000308900012070002600009040000000020090000019700007000860
master 000741060002309840000000000001020700500007300600000000007830009106004000090000500
easy 630745900000100000000009864370000100140060000080000036000007090500010007000853410
medium 008004300006580100021009004000850001000000008050400000010000000000070020060003009
hard 080002040000970600307060000804007000900000000000504038400300700050009320100050090
expert 008002600000000000250000100510080000700010402000700000000040006000170504060059003
`
    .trim()
    .split("\n")
    .map((line) => {
      let [difficulty, puzzle] = line.trim().split(" ");

      return {
        difficulty: difficulty as any as Diff,
        puzzle: puzzle.split("").map((it) => +it),
      };
    });
}

export function viewCandidates(candidates: number): number[] {
  return candidates
    .toString(2)
    .split("")
    .reverse()
    .map((it, i) => (it === "1" ? i : 0))
    .filter((n) => n > 0);
}

export function applyEditCellActions(puzzle: Field, history: History): Field {
  let res = [...puzzle];
  let { current, steps } = history;

  for (let i = 0; i <= current; i++) {
    let { type, id, val } = steps[i];
    if (type === "edit-cell") {
      res[id] = val;
    }
  }

  return res;
}
