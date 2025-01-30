import { notNull } from "./utils.ts";

type Index = number;

// init: string[];
// answer: string[];

export type MyPuzzle = {
  power: number;
  //
  rows: Array<Index[]>;
  cols: Array<Index[]>;
  boxes: Array<Index[]>;
  //
  rowByIndex: Array<Index[]>;
  colByIndex: Array<Index[]>;
  boxByIndex: Array<Index[]>;
  //
  getBorders: (
    borderW: number,
    borderH: number,
  ) => {
    left: number;
    top: number;
    width: number;
    height: number;
  }[];

  // todo:
  //  - isValid: (number[]) => boolean
  //  - solve: (number[]) => number[]
  //  - width: (cellSize) => number
};

export function generateFromSchema(schema: string): MyPuzzle {
  schema = schema.trim();
  let grid = schema.split("\n").map((row) => {
    return row.trim().split("");
  });

  let chars: string[] = [];
  let originalCoordinates: Array<[number, number]> = [];
  grid.forEach((row, rowI) => {
    row.forEach((ch, colI) => {
      if (!chars.includes(ch)) chars.push(ch);
      originalCoordinates.push([rowI, colI]);
    });
  });

  let boxes = Object.fromEntries(chars.map((ch) => [ch, [] as number[]]));
  let rows = chars.map(() => [] as number[]);
  let cols = chars.map(() => [] as number[]);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      let ch = grid[i][j];
      let index = i * grid.length + j;

      boxes[ch].push(index);
      rows[i].push(index);
      cols[j].push(index);
    }
  }

  function getBorders(borderW: number, borderLen: number) {
    let borders = [];
    let borderSize = borderW + borderW + borderLen;
    let k = borderW + borderLen;

    for (let i = 0; i < grid.length + 1; i++) {
      for (let j = 0; j < grid[0].length + 1; j++) {
        let ch = grid[i]?.[j];
        let leftCh = grid[i]?.[j - 1];
        let topCh = grid[i - 1]?.[j];

        let leftTop = { left: j * k, top: i * k };

        if (ch !== leftCh) {
          borders.push({ ...leftTop, width: borderW, height: borderSize });
        }
        if (ch !== topCh) {
          borders.push({ ...leftTop, width: borderSize, height: borderW });
        }
      }
    }

    return borders;
  }

  return {
    getBorders,
    power: chars.length,
    rows: rows,
    cols: cols,
    boxes: chars.map((ch) => boxes[ch]),
    rowByIndex: originalCoordinates.map(([row, col]) => rows[row]),
    colByIndex: originalCoordinates.map(([row, col]) => cols[col]),
    boxByIndex: originalCoordinates.map(([row, col]) => boxes[grid[row][col]]),
  };
}
