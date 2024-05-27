import { Difficulty } from "./lib";

export type Field = number[];
export type Candidates = number[];

export type Diff = Difficulty;

export type Action =
  | { type: "edit-cell"; id: number; val: number }
  | { type: "edit-candidate"; id: number; val: number };

export type History = { steps: Action[]; current: number };

export type ChangeCellProps = {
  puzzle: Field;
  history: History;
  cell: number | null;
  value: number;
};
