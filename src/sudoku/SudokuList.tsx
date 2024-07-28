import { useUnit } from "effector-react";
import { $puzzleList } from "./sudoku.model";
import css from "./PuzzlePage.module.css";
import { all_difficulties } from "./lib/constants";
import {
  getDifficulty,
  getSavedFromLS,
  getWinsFromLS,
  randomFrom,
  removeFromHistoryLS,
} from "./utils";
import { Difficulty } from "./lib";
import { Field } from "./types";
import { Time } from "./Components";

export function SudokuList() {
  const [puzzleList] = useUnit([$puzzleList]);

  let allHistory = getSavedFromLS();

  let wins = getWinsFromLS();

  const newPuzzles = getUnsolvedPuzzles(puzzleList);

  return (
    <div className={css.homePage}>
      <div className={css.newGames}>
        <h2>New puzzle</h2>

        {all_difficulties.map((difficulty) => {
          let puzzleStr = newPuzzles[difficulty].join("");
          return (
            <a
              href={"#puzzle-" + puzzleStr}
              className={css.startNew}
              key={difficulty}
            >
              {difficulty}
            </a>
          );
        })}
        {allHistory.length > 0 && (
          <>
            <h2>Continue</h2>
            {allHistory
              .filter((it) => {
                return !wins[it.puzzle]?.win;
              })
              .map(({ puzzle, time }) => {
                return (
                  <p className={css.continue}>
                    <a href={"#puzzle-" + puzzle}>
                      {getDifficulty(puzzleList, puzzle) ||
                        "unknown difficulty"}{" "}
                      (<Time time={time} />)
                    </a>
                    <button
                      onClick={() => {
                        removeFromHistoryLS(puzzle);
                        setTimeout(() => {
                          location.reload();
                        }, 100);
                      }}
                    >
                      remove
                    </button>
                  </p>
                );
              })}
          </>
        )}
        <h2>Settings</h2>
        <p>language</p>
      </div>
    </div>
  );
}

function getUnsolvedPuzzles(
  all: Record<Difficulty, Field[]>,
): Record<Difficulty, Field> {
  let wins = getWinsFromLS();

  return Object.fromEntries(
    all_difficulties.map((difficulty) => {
      let puzzles = all[difficulty].filter((bbb) => {
        return !wins[bbb.join("")]?.win;
      });

      return [difficulty, (puzzles[0] && randomFrom(puzzles)) || puzzles[0]];
    }),
  ) as Record<Difficulty, Field>;
}
