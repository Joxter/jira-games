export type Field = number[];
export type Candidates = number[];
export type WinsPersistent = Record<string, { win: boolean }>;

export type Action =
  | { type: "edit-cell"; id: number; val: number }
  | { type: "edit-candidate"; id: number; val: number };
// todo add "win clicked" event, refactor events, add proper play/win state

export type History = { steps: Action[]; current: number; time: number };

export type ChangeCellProps = {
  puzzle: Field;
  history: History;
  cell: number | null;
  value: number;
  type: "edit-cell" | "edit-candidate";
};
