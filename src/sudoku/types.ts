import { generateFromSchema, MyPuzzle } from "./puzzle-utils.ts";

export type Field = number[];
export type Candidates = number[];
export type WinsPersistent = Record<
  string,
  {
    win: boolean;
    winDate?: number;
  }
>;

export type Action =
  | { type: "edit-cell"; cell: number; value: number }
  | { type: "reveal-cell"; cell: number; value: number }
  | { type: "edit-candidate"; cell: number; value: number };

export type History = {
  layout: Layout;
  puzzle: string;
  steps: Action[];
  current: number;
  time: number;
  lastStepTime?: number;
  started?: number;
};

export type ChangeCellProps = {
  history: History;
  action: Action;
};

export const LS_HISTORY_KEY = "sudoku-history";

export const ValidLayouts = ["classic9", "simple6", "simple4"] as const;

export type Layout = (typeof ValidLayouts)[number];

export const Layouts: Record<Layout, { name: Layout; schema: MyPuzzle }> = {
  classic9: {
    name: "classic9",
    schema: generateFromSchema(`111222333
111222333
111222333
444555666
444555666
444555666
777888999
777888999
777888999
`),
  },
  simple6: {
    name: "simple6",
    schema: generateFromSchema(`111222
111222
333444
333444
555666
555666`),
  },
  simple4: {
    name: "simple4",
    schema: generateFromSchema(`1122
1122
3344
3344`),
  },
};
