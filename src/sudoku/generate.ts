import { appendFileSync } from "fs";
import { generate } from "./lib";
import { all_difficulties } from "./lib/constants";

while (true) {
  for (const difficulty of all_difficulties) {
    let start = Date.now();

    const board = (
      await generate({ difficulty, timeLimit: 10000 }).catch(() => [])
    )
      .map((it) => it || 0)
      .join("");

    let time = Date.now() - start;

    if (!board) {
      console.log(`${difficulty} ${time} TIME LIMIT`);
      continue;
    }

    let noZero = board.replaceAll("0", "").length;

    console.log(`${difficulty} ${time} ${board} ${noZero}`);
    appendFileSync("./puzzles.txt", `${difficulty} ${board}\n`);
  }
}
