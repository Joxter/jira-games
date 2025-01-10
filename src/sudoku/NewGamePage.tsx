import { useUnit } from "effector-react";
import { $puzzleList, puzzleSelected } from "./sudoku.model";
import css from "./PuzzlePage.module.css";
import { all_difficulties } from "./lib/constants";
import {
  difToLocale,
  getDifficulty,
  getSavedFromLS,
  getWinsFromLS,
  randomFrom,
  removeFromHistoryLS,
} from "./utils";
import { Difficulty } from "./lib";
import { Field } from "./types";
import { Time } from "./Components";
import { useLocale } from "./locale/locale.model";
import { Link } from "wouter";
import { Layout } from "./components/Layout.tsx";

export function NewGamePage() {
  const [puzzleList] = useUnit([$puzzleList]);

  let wins = getWinsFromLS();
  let allHistory = getSavedFromLS().filter((it) => {
    return !wins[it.puzzle]?.win;
  });
  let locale = useLocale();

  const newPuzzles = getUnsolvedPuzzles(puzzleList);

  return (
    <Layout>
      <div className={css.homePage}>
        <div className={css.newGames}>
          <h2>{locale.new_puzzle}</h2>

          {all_difficulties.map((difficulty) => {
            let puzzleStr = newPuzzles[difficulty].join("");
            let localeKey = difToLocale[difficulty];

            return (
              <Link
                href={"/current-game?puzzle=" + puzzleStr}
                className={css.startNew}
                key={difficulty}
                onClick={() => {
                  puzzleSelected(puzzleStr);
                }}
              >
                {locale.difficulty[localeKey]}
              </Link>
            );
          })}
          {allHistory.length > 0 && (
            <>
              <h2>{locale.unfinished}</h2>
              {allHistory.map(({ puzzle, time }, i) => {
                let localeKey = difToLocale[getDifficulty(puzzleList, puzzle)];
                puzzleSelected(puzzle);

                return (
                  <p className={css.continue} key={i + puzzle}>
                    <Link href={"/current-game?puzzle=" + puzzle}>
                      {locale.difficulty[localeKey] || "unknown difficulty"} (
                      <Time time={time} />)
                    </Link>
                    <button
                      onClick={() => {
                        removeFromHistoryLS(puzzle);
                        setTimeout(() => {
                          location.reload();
                        }, 100);
                      }}
                    >
                      {locale.remove}
                    </button>
                  </p>
                );
              })}
            </>
          )}
        </div>
      </div>
    </Layout>
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
