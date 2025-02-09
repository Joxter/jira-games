import { useUnit } from "effector-react";
import {
  $puzzleList,
  $currentLayout,
  puzzleSelected,
  layoutSelected,
} from "./sudoku.model";
import css from "./PuzzlePage.module.css";
import { all_difficulties } from "./lib/constants";
import {
  difToLocale,
  getDifficulty,
  getSavedFromLS,
  getWinsFromLS,
  prefix,
  randomFrom,
  removeFromHistoryLS,
} from "./utils";
import { Difficulty } from "./lib";
import { Field, Layouts } from "./types";
import { Time } from "./Components";
import { useLocale } from "./locale/locale.model";
import { Link } from "wouter";
import { Layout } from "./components/Layout.tsx";
import { Button } from "../ui/Button.tsx";

export function NewGamePage() {
  const [puzzleList, currentLayout] = useUnit([$puzzleList, $currentLayout]);

  let wins = getWinsFromLS();
  let allHistory = getSavedFromLS().filter((it) => {
    return !wins[it.puzzle]?.win;
  });
  let locale = useLocale();

  return (
    <Layout>
      <div className={css.homePage}>
        <div>
          <h2>Layout</h2>
          <div
            style={{
              display: "flex",
              gap: "4px",
              marginTop: "8px",
            }}
          >
            {Object.values(Layouts).map(({ schema, name }) => {
              return (
                <Button
                  selected={currentLayout === name}
                  onClick={() => {
                    layoutSelected(name);
                  }}
                >
                  {name}
                </Button>
              );
            })}
          </div>
        </div>
        <div className={css.newGames}>
          <h2>{locale.select_difficulty}</h2>

          {all_difficulties.map((difficulty) => {
            let puzzleStr = randomFrom(
              puzzleList[currentLayout][difficulty],
            ).join("");
            let localeKey = difToLocale[difficulty];

            return (
              <Link
                href={prefix + "/current-game?puzzle=" + puzzleStr}
                className={css.startNew}
                key={difficulty}
                onClick={() => {
                  puzzleSelected({ puzzle: puzzleStr, layout: currentLayout });
                }}
              >
                {locale.difficulty[localeKey]}
              </Link>
            );
          })}
          {allHistory.length > 0 && (
            <>
              <h2>{locale.unfinished}</h2>
              {allHistory.map(({ puzzle, time, layout }, i) => {
                let localeKey =
                  difToLocale[getDifficulty(puzzleList[currentLayout], puzzle)];
                puzzleSelected({ puzzle, layout: "classic9" });

                return (
                  <p className={css.continue} key={i + puzzle}>
                    <Link href={prefix + "/current-game?puzzle=" + puzzle}>
                      {layout}{" "}
                      {locale.difficulty[localeKey] || "unknown difficulty"}
                      (
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
