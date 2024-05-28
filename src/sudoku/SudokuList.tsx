import { useUnit } from "effector-react";
import { $puzzleList } from "./sudoku.model";
import css from "./PuzzlePage.module.css";
import { all_difficulties } from "./lib/constants";
import { getSavedFromLS } from "./utils";

export function SudokuList() {
  const [puzzleList] = useUnit([$puzzleList]);

  let [lastField] = getSavedFromLS();
  let lastFieldStr = lastField.join("");

  return (
    <div>
      <h1>Sudoku List</h1>
      <div>
        {all_difficulties.map((difficulty) => {
          return (
            <div className={css.puzzleList}>
              <h2>{difficulty}</h2>
              {puzzleList[difficulty].map((puzzle, i) => {
                let unfinished = lastFieldStr === puzzle.join("");

                return (
                  <a href={"#puzzle-" + puzzle.join("")} key={i}>
                    Puzzle {i} {unfinished && "(unfinished)"}
                  </a>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
