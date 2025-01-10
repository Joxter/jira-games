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
