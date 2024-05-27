import { useUnit } from "effector-react";
import { $puzzleList } from "./sudoku.model";
import { useEffect, useRef } from "preact/hooks";
import css from "./PuzzlePage.module.css";
import { all_difficulties } from "./lib/constants";

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
                return (
                  <a href={"#puzzle-" + puzzle.join("")} key={i}>
                    Puzzle {i}
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
