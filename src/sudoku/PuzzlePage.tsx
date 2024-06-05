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
  $field,
  $puzzle,
  addSecToTime,
  seveToPuzzleToLS,
} from "./sudoku.model";
import { useUnit } from "effector-react";
import { useEffect, useRef, useState } from "preact/hooks";
import { fastSolve, fieldToLayout, getBorders, getRelated } from "./utils";
import { Cell, NumRow, Time, WinModal } from "./Components";
import { Field } from "./types";

export function PuzzlePage() {
  const [puzzle, field, candidates, current, highLightCells] = useUnit([
    $puzzle,
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
    let id = setInterval(() => {
      if (document.visibilityState === "visible") {
        addSecToTime();
      }
    }, 1000);

    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let unsub = showCellError.watch((nums) => {
      nums.forEach((n) => {
        let cell = fieldRef.current!.querySelector("#cell" + n) as HTMLElement;
        if (cell) showErrorAnimation(cell);
      });
    });

    return () => {
      unsub();
      seveToPuzzleToLS();
    };
  }, []);

  const width = [1, 3]; // thin, thick
  const cellSize = 38;

  return (
    <>
      <div>
        <a href="#list">close</a>
      </div>
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

      <WinModal />
      <div style={{ marginTop: "auto" }}>
        <button
          onClick={() => {
            let answer = fastSolve(field);
            if (answer) {
              alert("solvable..");
            } else {
              alert("unsolvable :(");
            }
          }}
        >
          is valid?
        </button>
      </div>
      <Time />
      <div
        className={css.field2}
        style={{
          width:
            "calc(9 * ${cellSize}px + 4 * ${width[1]}px + 6 * ${width[0]}px)",
          height:
            "calc(9 * ${cellSize}px + 4 * ${width[1]}px + 6 * ${width[0]}px)",
        }}
      >
        {field.map((value, i) => {
          return (
            <div
              style={{
                ...getBorders(width[0], width[1], i),
                width: cellSize + "px",
                height: cellSize + "px",
              }}
            >
              <InnerCell />
              {/*<span>{value}</span>*/}
            </div>
          );
        })}
      </div>
      <br />
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
            ev.preventDefault();
            cellChanged(0);
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
                    isPuzzle={!!puzzle[index]}
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
        <NumRow
          onClick={(n) => cellChanged(n)}
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
          {/*
          <button onClick={() => resetClicked()}>X</button>
*/}
          <button onClick={() => undo()}>{"<-"}</button>
          <button onClick={() => redo()}>{"->"}</button>
        </div>
        <NumRow candidate onClick={(n) => cellCandidateChanged(n)} />
      </div>
    </>
  );
}

function InnerCell() {
  let [size, setSize] = useState("");
  let refCell = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (refCell.current) {
      let rect = refCell.current?.getBoundingClientRect();
      if (rect) {
        setSize(rect.width + "*" + rect.height);
      }
    }
  }, []);

  return (
    <span ref={refCell} className={css.innerCell}>
      {size}
    </span>
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
