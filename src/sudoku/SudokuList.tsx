import { useUnit } from "effector-react";
import { $puzzleList } from "./sudoku.model";
import css from "./PuzzlePage.module.css";
import { all_difficulties } from "./lib/constants";
import { getFieldsFromLS } from "./utils";

let [lastField] = getFieldsFromLS();

let lastFieldStr = lastField.join("");

export function SudokuList() {
  const [puzzleList] = useUnit([$puzzleList]);

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
                    Puzzle {i} unfinished {unfinished && "(unfinished)"}
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
