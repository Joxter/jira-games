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

  // todo:
  //  - borders?: Array<[number, number]>; // todo add borders
  //  - isValid: (number[]) => boolean
  //  - solve: (number[]) => number[]
};

export function generateFromSchema(schema: string): MyPuzzle {
  schema = schema.trim();
  let grid = schema.split("\n").map((row, i) => {
    return row.split("");
  });

  let chars: string[] = [];
  schema
    .replace(/\s/g, "")
    .split("")
    .forEach((ch) => {
      if (!chars.includes(ch)) chars.push(ch);
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

  let borders = [];
  let borderW = 2;
  let borderH = 10;

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      let ch = grid[i][j];
      let leftCh = grid[i][j - 1];
      let topCh = grid[i - 1]?.[j];

      if (ch !== leftCh) {
        //
      }
      if (ch !== topCh) {
        //
      }
    }
  }

  return {
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
