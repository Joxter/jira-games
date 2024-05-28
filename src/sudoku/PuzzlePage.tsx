import css from "./PuzzlePage.module.css";
import {
  $candidates,
  $currentCell,
  $highLightCells,
  arrowClicked,
  cellCandidateChanged,
  cellChanged,
  cellClicked,
  undo,
  redo,
  showCellError,
  resetClicked,
  $field,
} from "./sudoku.model";
import { useUnit } from "effector-react";
import { useEffect, useRef } from "preact/hooks";
import { fieldToLayout } from "./utils";
import { Cell, NumRow } from "./Components";

export function PuzzlePage() {
  const [field, candidates, current, highLightCells] = useUnit([
    $field,
    $candidates,
    $currentCell,
    $highLightCells,
  ]);

  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(ev: any) {
      if (
        ev.target.nodeName !== "BUTTON" &&
        !fieldRef.current!.contains(ev.target)
      ) {
        cellClicked(null);
      }
    }
    document.addEventListener("click", handler);

    return () => document.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    let unsub = showCellError.watch((nums) => {
      nums.forEach((n) => {
        let cell = fieldRef.current!.querySelector("#cell" + n) as HTMLElement;
        if (cell) showErrorAnimation(cell);
      });
    });

    return () => unsub();
  }, []);

  return (
    <div>
      <div
        ref={fieldRef}
        className={css.field}
        onKeyDown={(ev) => {
          if (
            ev.code === "ArrowUp" ||
            ev.code === "ArrowDown" ||
            ev.code === "ArrowLeft" ||
            ev.code === "ArrowRight"
          ) {
            arrowClicked(ev.code);
          } else if (ev.code === "Backspace" || ev.code === "Delete") {
            cellChanged(0);
          } else if (
            [
              "Digit1",
              "Digit2",
              "Digit3",
              "Digit4",
              "Digit5",
              "Digit6",
              "Digit7",
              "Digit8",
              "Digit9",
            ].includes(ev.code)
          ) {
            const newVal = +ev.code.slice(5);

            if (ev.shiftKey) {
              cellCandidateChanged(newVal);
            } else {
              cellChanged(newVal);
            }
          }
        }}
      >
        {fieldToLayout(field).map((small, i) => {
          return (
            <div className={css.smalBox} key={i}>
              {small.map(([val, index]) => {
                return (
                  <Cell
                    candidates={candidates[index]}
                    key={index}
                    index={index}
                    isCurrent={current === index}
                    isSame={
                      (val &&
                        current !== null &&
                        current !== index &&
                        field[current] === val) ||
                      false
                    }
                    isHighLight={highLightCells.includes(index)}
                    value={val}
                    onClick={() => {
                      cellClicked(index);
                    }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      <br />
      <div className={css.nums}>
        <NumRow onClick={(n) => cellChanged(n)} />
        <div className={css.numsActions}>
          <button onClick={() => resetClicked()}>X</button>
          <button onClick={() => undo()}>undo</button>
          <button onClick={() => redo()}>redo</button>
        </div>
        <NumRow candidate onClick={(n) => cellCandidateChanged(n)} />
      </div>
    </div>
  );
}

function showErrorAnimation(cell: HTMLElement) {
  cell.style.position = "relative";
  cell.style.zIndex = "10";

  let animate = cell.animate(
    [{ transform: "scale(1)" }, { transform: "scale(1.3)" }],
    {
      duration: 50,
      iterations: 2,
      direction: "alternate",
    },
  );
  animate.onfinish = () => {
    cell.style.zIndex = "initial";
  };

  cell.animate(
    [
      { borderColor: "red", color: "red" },
      { borderColor: "#d5d5cd", color: "#213547" },
    ],
    {
      duration: 1500,
      iterations: 1,
    },
  );
}
