import { notNull } from "./utils.ts";

type Index = number;

// init: string[];
// answer: string[];

type MyPuzzle = {
  power: number;
  //
  rows: Array<Index[]>;
  cols: Array<Index[]>;
  boxes: Array<Index[]>;
  //
  width: number;
  height: number;
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
  let originalCoordinates = [];
  grid.forEach((row, rowI) => {
    row.forEach((ch, colI) => {
      if (!chars.includes(ch)) chars.push(ch);
      originalCoordinates.push([rowI, colI]);
    });
  });

  let boxes = Object.fromEntries(chars.map((ch) => [ch, [] as number[]]));
  let rows = Object.fromEntries(chars.map((ch) => [ch, [] as number[]]));
  let cols = Object.fromEntries(chars.map((ch) => [ch, [] as number[]]));

  for (let i = 0; i < grid.length; i++) {
    let rowCh = chars[i];
    for (let j = 0; j < grid[i].length; j++) {
      let colCh = chars[j];

      let ch = grid[i][j];
      let index = i * grid.length + j;
      boxes[ch].push(index);
      rows[rowCh].push(index);
      cols[colCh].push(index);
    }
  }

  function getBorders(borderW: number, borderH: number) {
    let borders = [];

    for (let i = 0; i < grid.length + 1; i++) {
      for (let j = 0; j < grid[0].length + 1; j++) {
        let ch = grid[i]?.[j];
        let leftCh = grid[i]?.[j - 1];
        let topCh = grid[i - 1]?.[j];

        let borderSize = borderW + borderW + borderH;
        let leftTop = {
          left: j * borderSize - (j + 1) * borderW,
          top: i * borderSize - (i + 1) * borderW,
        };

        if (ch !== leftCh) {
          borders.push({ ...leftTop, width: 2, height: borderSize });
        }
        if (ch !== topCh) {
          borders.push({ ...leftTop, width: borderSize, height: 2 });
        }
      }
    }

    return borders.toSorted((a, b) => a.top - b.top || a.left - b.left);
  }

  return {
    getBorders,
    power: chars.length,
    rows: chars.map((ch) => rows[ch]),
    cols: chars.map((ch) => cols[ch]),
    boxes: chars.map((ch) => boxes[ch]),
    width: grid.length,
    height: grid[0].length,
  };
}

// todo
//  - getRowByIndex
//  - getColByIndex
//  - getBoxByIndex
