import { expect, describe, it } from "vitest";
import { generateFromSchema } from "./puzzle-utils.ts";

describe("puzzle-utils", () => {
  describe("generateFromSchema", () => {
    it("should work with size 4", () => {
      let schema = `
1122
1122
3344
3344
`;

      expect(generateFromSchema(schema)).toMatchObject({
        power: 4,
        rows: [
          [0, 1, 2, 3],
          [4, 5, 6, 7],
          [8, 9, 10, 11],
          [12, 13, 14, 15],
        ],
        cols: [
          [0, 4, 8, 12],
          [1, 5, 9, 13],
          [2, 6, 10, 14],
          [3, 7, 11, 15],
        ],
        boxes: [
          [0, 1, 4, 5],
          [2, 3, 6, 7],
          [8, 9, 12, 13],
          [10, 11, 14, 15],
        ],
        width: 4,
        height: 4,
      });
    });

    it("should work with size 9 (classic sudoku)", () => {
      let schema = `
111222333
111222333
111222333
444555666
444555666
444555666
777888999
777888999
777888999
`;

      expect(generateFromSchema(schema)).toMatchObject({
        power: 9,
        rows: [
          [0, 1, 2, 3, 4, 5, 6, 7, 8],
          [9, 10, 11, 12, 13, 14, 15, 16, 17],
          [18, 19, 20, 21, 22, 23, 24, 25, 26],
          [27, 28, 29, 30, 31, 32, 33, 34, 35],
          [36, 37, 38, 39, 40, 41, 42, 43, 44],
          [45, 46, 47, 48, 49, 50, 51, 52, 53],
          [54, 55, 56, 57, 58, 59, 60, 61, 62],
          [63, 64, 65, 66, 67, 68, 69, 70, 71],
          [72, 73, 74, 75, 76, 77, 78, 79, 80],
        ],
        cols: [
          [0, 9, 18, 27, 36, 45, 54, 63, 72],
          [1, 10, 19, 28, 37, 46, 55, 64, 73],
          [2, 11, 20, 29, 38, 47, 56, 65, 74],
          [3, 12, 21, 30, 39, 48, 57, 66, 75],
          [4, 13, 22, 31, 40, 49, 58, 67, 76],
          [5, 14, 23, 32, 41, 50, 59, 68, 77],
          [6, 15, 24, 33, 42, 51, 60, 69, 78],
          [7, 16, 25, 34, 43, 52, 61, 70, 79],
          [8, 17, 26, 35, 44, 53, 62, 71, 80],
        ],
        boxes: [
          [0, 1, 2, 9, 10, 11, 18, 19, 20],
          [3, 4, 5, 12, 13, 14, 21, 22, 23],
          [6, 7, 8, 15, 16, 17, 24, 25, 26],
          [27, 28, 29, 36, 37, 38, 45, 46, 47],
          [30, 31, 32, 39, 40, 41, 48, 49, 50],
          [33, 34, 35, 42, 43, 44, 51, 52, 53],
          [54, 55, 56, 63, 64, 65, 72, 73, 74],
          [57, 58, 59, 66, 67, 68, 75, 76, 77],
          [60, 61, 62, 69, 70, 71, 78, 79, 80],
        ],
        width: 9,
        height: 9,
      });
    });

    it("should work with size 6", () => {
      let schema = `
111222
111222
333444
333444
555666
555666
`;

      expect(generateFromSchema(schema)).toMatchObject({
        power: 6,
        rows: [
          [0, 1, 2, 3, 4, 5],
          [6, 7, 8, 9, 10, 11],
          [12, 13, 14, 15, 16, 17],
          [18, 19, 20, 21, 22, 23],
          [24, 25, 26, 27, 28, 29],
          [30, 31, 32, 33, 34, 35],
        ],
        cols: [
          [0, 6, 12, 18, 24, 30],
          [1, 7, 13, 19, 25, 31],
          [2, 8, 14, 20, 26, 32],
          [3, 9, 15, 21, 27, 33],
          [4, 10, 16, 22, 28, 34],
          [5, 11, 17, 23, 29, 35],
        ],
        boxes: [
          [0, 1, 2, 6, 7, 8],
          [3, 4, 5, 9, 10, 11],
          [12, 13, 14, 18, 19, 20],
          [15, 16, 17, 21, 22, 23],
          [24, 25, 26, 30, 31, 32],
          [27, 28, 29, 33, 34, 35],
        ],
        width: 6,
        height: 6,
      });
    });

    it("should work with size 5", () => {
      let schema = `
11122
11422
34442
33455
33555
`;

      expect(generateFromSchema(schema)).toMatchObject({
        power: 5,
        rows: [
          [0, 1, 2, 3, 4],
          [5, 6, 7, 8, 9],
          [10, 11, 12, 13, 14],
          [15, 16, 17, 18, 19],
          [20, 21, 22, 23, 24],
        ],
        cols: [
          [0, 5, 10, 15, 20],
          [1, 6, 11, 16, 21],
          [2, 7, 12, 17, 22],
          [3, 8, 13, 18, 23],
          [4, 9, 14, 19, 24],
        ],
        boxes: [
          [0, 1, 2, 5, 6],
          [3, 4, 8, 9, 14],
          [7, 11, 12, 13, 17],
          [10, 15, 16, 20, 21],
          [18, 19, 22, 23, 24],
        ],
        width: 5,
        height: 5,
      });
    });

    it("getBordersBasic example", () => {
      let schema = `
111222333
111222333
111222333
444555666
444555666
444555666
777888999
777888999
777888999
`;

      expect(generateFromSchema(schema).getBorders(2, 10)).toEqual([
        { left: 0, top: 0, width: 2, height: 14 },
        { left: 0, top: 0, width: 14, height: 2 },
        { left: 12, top: 0, width: 14, height: 2 },
        { left: 24, top: 0, width: 14, height: 2 },
        { left: 36, top: 0, width: 2, height: 14 },
        { left: 36, top: 0, width: 14, height: 2 },
        { left: 48, top: 0, width: 14, height: 2 },
        { left: 60, top: 0, width: 14, height: 2 },
        { left: 72, top: 0, width: 2, height: 14 },
        { left: 72, top: 0, width: 14, height: 2 },
        { left: 84, top: 0, width: 14, height: 2 },
        { left: 96, top: 0, width: 14, height: 2 },
        { left: 108, top: 0, width: 2, height: 14 },
        { left: 0, top: 12, width: 2, height: 14 },
        { left: 36, top: 12, width: 2, height: 14 },
        { left: 72, top: 12, width: 2, height: 14 },
        { left: 108, top: 12, width: 2, height: 14 },
        { left: 0, top: 24, width: 2, height: 14 },
        { left: 36, top: 24, width: 2, height: 14 },
        { left: 72, top: 24, width: 2, height: 14 },
        { left: 108, top: 24, width: 2, height: 14 },
        { left: 0, top: 36, width: 2, height: 14 },
        { left: 0, top: 36, width: 14, height: 2 },
        { left: 12, top: 36, width: 14, height: 2 },
        { left: 24, top: 36, width: 14, height: 2 },
        { left: 36, top: 36, width: 2, height: 14 },
        { left: 36, top: 36, width: 14, height: 2 },
        { left: 48, top: 36, width: 14, height: 2 },
        { left: 60, top: 36, width: 14, height: 2 },
        { left: 72, top: 36, width: 2, height: 14 },
        { left: 72, top: 36, width: 14, height: 2 },
        { left: 84, top: 36, width: 14, height: 2 },
        { left: 96, top: 36, width: 14, height: 2 },
        { left: 108, top: 36, width: 2, height: 14 },
        { left: 0, top: 48, width: 2, height: 14 },
        { left: 36, top: 48, width: 2, height: 14 },
        { left: 72, top: 48, width: 2, height: 14 },
        { left: 108, top: 48, width: 2, height: 14 },
        { left: 0, top: 60, width: 2, height: 14 },
        { left: 36, top: 60, width: 2, height: 14 },
        { left: 72, top: 60, width: 2, height: 14 },
        { left: 108, top: 60, width: 2, height: 14 },
        { left: 0, top: 72, width: 2, height: 14 },
        { left: 0, top: 72, width: 14, height: 2 },
        { left: 12, top: 72, width: 14, height: 2 },
        { left: 24, top: 72, width: 14, height: 2 },
        { left: 36, top: 72, width: 2, height: 14 },
        { left: 36, top: 72, width: 14, height: 2 },
        { left: 48, top: 72, width: 14, height: 2 },
        { left: 60, top: 72, width: 14, height: 2 },
        { left: 72, top: 72, width: 2, height: 14 },
        { left: 72, top: 72, width: 14, height: 2 },
        { left: 84, top: 72, width: 14, height: 2 },
        { left: 96, top: 72, width: 14, height: 2 },
        { left: 108, top: 72, width: 2, height: 14 },
        { left: 0, top: 84, width: 2, height: 14 },
        { left: 36, top: 84, width: 2, height: 14 },
        { left: 72, top: 84, width: 2, height: 14 },
        { left: 108, top: 84, width: 2, height: 14 },
        { left: 0, top: 96, width: 2, height: 14 },
        { left: 36, top: 96, width: 2, height: 14 },
        { left: 72, top: 96, width: 2, height: 14 },
        { left: 108, top: 96, width: 2, height: 14 },
        { left: 0, top: 108, width: 14, height: 2 },
        { left: 12, top: 108, width: 14, height: 2 },
        { left: 24, top: 108, width: 14, height: 2 },
        { left: 36, top: 108, width: 14, height: 2 },
        { left: 48, top: 108, width: 14, height: 2 },
        { left: 60, top: 108, width: 14, height: 2 },
        { left: 72, top: 108, width: 14, height: 2 },
        { left: 84, top: 108, width: 14, height: 2 },
        { left: 96, top: 108, width: 14, height: 2 },
      ]);
    });
  });
});
