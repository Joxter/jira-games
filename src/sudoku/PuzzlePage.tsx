import css from "./PuzzlePage.module.css";
import {
  $candidates,
  $currentCell,
  $highLightCells,
  arrowClicked,
  numberWithShiftPressed,
  numberPressed,
  cellClicked,
  undo,
  redo,
  showCellError,
  $field,
  $puzzle,
  addSecToTime,
  seveToPuzzleToLS,
  inputModeChanged,
  $inputMode,
} from "./sudoku.model";
import { useUnit } from "effector-react";
import { useEffect, useRef, useState } from "preact/hooks";
import { fastSolve, getBorders2, getRelated } from "./utils";
import { Cell, NumRow, WinModal } from "./Components";
import { cn } from "../unit";
import { useLocale } from "./locale/locale.model";
import { Field } from "./Field.tsx";
import { Link } from "wouter";

export function PuzzlePage() {
  const [puzzle, field, candidates, current, highLightCells, inputMode] =
    useUnit([
      $puzzle,
      $field,
      $candidates,
      $currentCell,
      $highLightCells,
      $inputMode,
    ]);

  let locale = useLocale();

  // const fieldRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(ev: any) {
      if (
        ev.target.nodeName !== "BUTTON"
        //&& !fieldRef.current!.contains(ev.target)
      ) {
        cellClicked(null);
      }
    }
    document.addEventListener("click", handler);

    return () => document.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    let id = setInterval(() => {
      if (document.visibilityState === "visible") {
        addSecToTime();
      }
    }, 1000);

    document.addEventListener("visibilitychange", seveToPuzzleToLS);

    return () => {
      document.removeEventListener("visibilitychange", seveToPuzzleToLS);
      clearInterval(id);
    };
  }, []);

  const fieldPadding = 5;

  // useEffect(() => {
  //   if (pageRef.current) {
  //     const fieldWrapper =
  //       pageRef.current.getBoundingClientRect().width - fieldPadding;
  //
  //     let cellSize = Math.floor(
  //       (fieldWrapper - fieldPadding * 2 - 10 * borderSize) / 9,
  //     );
  //
  //     setCellSize(cellSize.toString());
  //   }
  // }, []);

  useEffect(() => {
    let unsub = showCellError.watch((nums) => {
      nums.forEach((n) => {
        let cell = document.querySelector("#cell" + n) as HTMLElement;
        if (cell) showErrorAnimation(cell);
      });
    });

    return () => {
      seveToPuzzleToLS();
      unsub();
    };
  }, []);

  if (!candidates || !field) return <p>no field</p>;

  return (
    <div>
      <div>
        <Link href="/new-game">{locale.close}</Link>
      </div>
      <br />

      <WinModal />
      <div style={{ marginTop: "auto" }}>
        <button
          onClick={() => {
            if (!field) return;

            let answer = fastSolve(field);
            if (answer) {
              alert("solvable..");
            } else {
              alert("unsolvable :(");
            }
          }}
        >
          {locale.is_valid}
        </button>
      </div>
      <br />
      <div ref={pageRef} style={{ padding: `0 ${fieldPadding}px` }}>
        <Field cellSize={40} />
        <div className={css.nums} style={{ padding: `0 ${fieldPadding}px` }}>
          <div className={css.numsActions}>
            <button onClick={() => numberPressed(0)}>{locale.clearCell}</button>
            <button onClick={() => undo()}>{locale.undo}</button>
            <button onClick={() => redo()}>{locale.redo}</button>
          </div>
          <NumRow
            onClick={(n) => numberPressed(n)}
            invalidNums={
              current !== null
                ? getRelated(current).map((id) => {
                    return field[id];
                  })
                : null
            }
            doneNums={[1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => {
              return field.filter((a) => a === n).length === 9;
            })}
          />
          <div className={css.numsActions}>
            <button
              className={cn(inputMode === "normal" && css.current)}
              onClick={() => inputModeChanged("normal")}
            >
              {locale.mode.normal}
            </button>
            <button
              className={cn(inputMode === "candidate" && css.current)}
              onClick={() => inputModeChanged("candidate")}
            >
              {locale.mode.candidate}
            </button>
          </div>
        </div>
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
