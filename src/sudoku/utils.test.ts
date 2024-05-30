import { expect, describe, it } from "vitest";
import { formatTime } from "./utils";

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
