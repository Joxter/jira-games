import { expect, describe, it } from "vitest";
import { fastSolve, formatTime, getBox, getCol, getRow } from "./utils";

describe("utils", () => {
  describe("formatTime", () => {
    it("should work", () => {
      expect(formatTime(0)).toBe("00:00:00");
      expect(formatTime(1)).toBe("00:00:01");
      expect(formatTime(59)).toBe("00:00:59");
      expect(formatTime(60)).toBe("00:01:00");
      expect(formatTime(90)).toBe("00:01:30");
      expect(formatTime(3600)).toBe("01:00:00");
      expect(formatTime(3661)).toBe("01:01:01");
      expect(formatTime(86399)).toBe("23:59:59");
    });
  });

  describe("getRow", () => {
    it("should work", () => {
      expect(getRow(0)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
      expect(getRow(1)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
      expect(getRow(8)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
      expect(getRow(9)).toEqual([9, 10, 11, 12, 13, 14, 15, 16, 17]);
      expect(getRow(72)).toEqual([72, 73, 74, 75, 76, 77, 78, 79, 80]);
      expect(getRow(80)).toEqual([72, 73, 74, 75, 76, 77, 78, 79, 80]);
    });
  });

  describe("getCol", () => {
    it("should work", () => {
      expect(getCol(0)).toEqual([0, 9, 18, 27, 36, 45, 54, 63, 72]);
      expect(getCol(10)).toEqual([1, 10, 19, 28, 37, 46, 55, 64, 73]);
      expect(getCol(8)).toEqual([8, 17, 26, 35, 44, 53, 62, 71, 80]);
      expect(getCol(9)).toEqual([0, 9, 18, 27, 36, 45, 54, 63, 72]);
      expect(getCol(20)).toEqual([2, 11, 20, 29, 38, 47, 56, 65, 74]);
      expect(getCol(72)).toEqual([0, 9, 18, 27, 36, 45, 54, 63, 72]);
      expect(getCol(80)).toEqual([8, 17, 26, 35, 44, 53, 62, 71, 80]);
    });
  });

  describe("getBox", () => {
    it("should work", () => {
      expect(getBox(0)).toEqual([0, 1, 2, 9, 10, 11, 18, 19, 20]);
      expect(getBox(10)).toEqual([0, 1, 2, 9, 10, 11, 18, 19, 20]);
      expect(getBox(8)).toEqual([6, 7, 8, 15, 16, 17, 24, 25, 26]);
      expect(getBox(9)).toEqual([0, 1, 2, 9, 10, 11, 18, 19, 20]);
      expect(getBox(20)).toEqual([0, 1, 2, 9, 10, 11, 18, 19, 20]);
      expect(getBox(72)).toEqual([54, 55, 56, 63, 64, 65, 72, 73, 74]);
      expect(getBox(80)).toEqual([60, 61, 62, 69, 70, 71, 78, 79, 80]);
    });
  });

  describe("fastSolve", () => {
    function strToField(str: string) {
      return str.split("").map((n) => +n);
    }

    it.each([
      {
        puzzle:
          "000900250600000000000007004032045080080370010175000400000000608790800500000259130",
        solution:
          "347986251658421379219537864932145786486372915175698423523714698791863542864259137",
      },
      {
        puzzle:
          "000209000501000000000030060300005000020060800005004600710000590840006000000080030",
        solution:
          "634259187591678324278431965367815249429763851185924673716342598843596712952187436",
      },
      {
        puzzle:
          "000209000501000000000030060300005000020060888005004600710000590840006000000080030",
        solution: null,
      },
      {
        puzzle:
          "110209000501000000000030060300005000020060800005004600710000590840006000000080030",
        solution: null,
      },
    ])("should work for classic 9 size sudoku", ({ puzzle, solution }) => {
      expect(fastSolve(strToField(puzzle))?.join("") || null).toEqual(solution);
    });

    it.each([
      { puzzle: "3002003102000004", solution: "3142243142131324" },
      { puzzle: "3001100000000020", solution: "3241143223144123" },
      { puzzle: "3301100000000020", solution: null },
      { puzzle: "1143040041000010", solution: null },
    ])("should work for 4*4 sudoku", ({ puzzle, solution }) => {
      expect(
        fastSolve(strToField(puzzle), {
          power: 4,
          boxHeight: 2,
          boxWidth: 2,
        })?.join("") || null,
      ).toEqual(solution);
    });
  });
});
