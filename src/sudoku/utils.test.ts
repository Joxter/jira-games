import { expect, describe, it } from "vitest";
import { formatTime, getBox, getCol, getRow } from "./utils";

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
});
