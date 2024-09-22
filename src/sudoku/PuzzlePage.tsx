import css from "./PuzzlePage.module.css";
import {
  $candidates,
  $currentCell,
  $highLightCells,
  arrowClicked,
  cellCandidateChanged,
  numberClicked,
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
import { fastSolve, getBorders, getRelated } from "./utils";
import { Cell, NumRow, WinModal } from "./Components";
import { cn } from "../unit";
import { useLocale } from "./locale/locale.model";

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

  let [cellSize, setCellSize] = useState("30");

  const fieldRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

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

  const widthSmal = 1;
  const widthBig = 3;
  const fieldPadding = 5;

  useEffect(() => {
    if (pageRef.current) {
      const fieldWrapper =
        pageRef.current.getBoundingClientRect().width - fieldPadding;

      let cellSize = Math.floor(
        (fieldWrapper - fieldPadding * 2 - 4 * widthBig - 6 * widthSmal) / 9,
      );

      setCellSize(cellSize.toString());
    }
  }, []);

  useEffect(() => {
    let unsub = showCellError.watch((nums) => {
      nums.forEach((n) => {
        let cell = fieldRef.current!.querySelector("#cell" + n) as HTMLElement;
        if (cell) showErrorAnimation(cell);
      });
    });

    return () => {
      seveToPuzzleToLS();
      unsub();
    };
  }, []);

  if (!candidates || !field) return <p>??????????</p>;
  return (
    <div>
      <div>
        <a href="#list">{locale.close}</a>
      </div>
      <br />
      {/*
      <button
        onClick={() => {
          let unsolvedCells = field
            .map((n, i) => [n, i])
            .filter(([n]) => n === 0)
            .map(([n, i]) => i);
          let answer = fastSolve(field);

          if (answer) setNumber(answer);

          function setNumber(answer: Field) {
            let cellId = unsolvedCells.pop();
            if (cellId) {
              cellClicked(cellId);
              cellChanged(answer[cellId]);
              setTimeout(() => {
                setNumber(answer);
              }, 50);
            }
          }
        }}
      >
        magic solve
      </button>
*/}
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
        <div
          className={css.field}
          style={{
            "--cell-size": `${cellSize}px`,
            "--width-smal": `${widthSmal}px`,
            "--width-big": `${widthBig}px`,
          }}
          ref={fieldRef}
          onKeyDown={(ev) => {
            if (
              ev.code === "ArrowUp" ||
              ev.code === "ArrowDown" ||
              ev.code === "ArrowLeft" ||
              ev.code === "ArrowRight"
            ) {
              arrowClicked(ev.code);
            } else if (ev.code === "Backspace" || ev.code === "Delete") {
              ev.preventDefault();
              numberClicked(0);
            } else if (
              [
                "Digit0",
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
                numberClicked(newVal);
              }
            }
          }}
        >
          {field.map((value, index) => {
            return (
              <Cell
                style={{
                  ...getBorders(widthSmal, widthBig, index),
                  width: "var(--cell-size)",
                  height: "var(--cell-size)",
                }}
                candidates={candidates[index]}
                key={index}
                index={index}
                isPuzzle={puzzle[index] !== "0"}
                isCurrent={current === index}
                isSame={
                  (value &&
                    current !== null &&
                    current !== index &&
                    field[current] === value) ||
                  false
                }
                isHighLight={highLightCells.includes(index)}
                value={value}
                onClick={() => {
                  cellClicked(index);
                }}
              />
            );
          })}
        </div>
        <div className={css.nums} style={{ padding: `0 ${fieldPadding}px` }}>
          <div className={css.numsActions}>
            <button onClick={() => numberClicked(0)}>{locale.clearCell}</button>
            <button onClick={() => undo()}>{locale.undo}</button>
            <button onClick={() => redo()}>{locale.redo}</button>
          </div>
          <NumRow
            onClick={(n) => numberClicked(n)}
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
