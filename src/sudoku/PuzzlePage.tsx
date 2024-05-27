import css from "./PuzzlePage.module.css";
import { cn } from "../unit";
import {
  $candidates,
  $currentCell,
  $highLightCells,
  arrowClicked,
  cellCandidateChanged,
  cellChanged,
  cellClicked,
  $puzzle,
  undo,
  redo,
  showCellError,
} from "./sudoku.model";
import { useUnit } from "effector-react";
import { useEffect, useRef } from "preact/hooks";
import { viewCandidates } from "./utils";

export function PuzzlePage() {
  const [field, candidates, current, highLightCells] = useUnit([
    $puzzle,
    $candidates,
    $currentCell,
    $highLightCells,
  ]);

  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function h(ev: any) {
      if (
        ev.target.nodeName !== "BUTTON" &&
        !fieldRef.current!.contains(ev.target)
      ) {
        cellClicked(null);
      }
    }
    document.addEventListener("click", h);

    return () => document.removeEventListener("click", h);
  }, []);

  useEffect(() => {
    let unsub = showCellError.watch((n) => {
      let cell = fieldRef.current!.querySelector("#cell" + n) as HTMLElement;
      if (!cell) return;
      cell.style.position = "relative";
      cell.style.zIndex = "10";

      let animate = cell.animate(
        [{ transform: "scale(1)" }, { transform: "scale(1.1)" }],
        {
          duration: 50,
          iterations: 2,
          direction: "alternate",
        },
      );
      animate.onfinish = () => {
        cell.style.position = "initial";
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
    });

    return () => unsub();
  }, []);

  return (
    <div className={css.page}>
      <p>
        <button
          onClick={() => {
            localStorage.removeItem("sudoku_history");
            localStorage.removeItem("sudoku_field");
            location.reload();
          }}
        >
          reset
        </button>
      </p>
      <p>
        <button onClick={() => undo()}>undo</button>
        <button onClick={() => redo()}>redo</button>
      </p>

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
      <NumRow
        candidate
        onClick={(n) => {
          cellCandidateChanged(n);
        }}
      />
      <NumRow
        onClick={(n) => {
          cellChanged(n);
        }}
      />
    </div>
  );
}

function fieldToLayout(field: number[]): [number, number][][] {
  //            [ value,  index]
  const layout: [number, number][][] = Array(9)
    .fill(0)
    .map(() => Array(9));

  field.forEach((val, _i) => {
    const rowI = Math.floor(_i / 9);

    const outer = {
      i: Math.floor(rowI / 3) * 3,
      j: (rowI % 3) * 3,
    };

    const colJ = _i % 9;

    const i = outer.i + Math.floor(colJ / 3);
    const j = outer.j + (colJ % 3);

    layout[i][j] = [val, _i];
  });

  return layout;
}

type CellProps = {
  value: number;
  index: number;
  isCurrent: boolean;
  isSame: boolean;
  isHighLight: boolean;
  onClick: () => void;
  candidates: number;
};

function Cell({
  value,
  isCurrent,
  isSame,
  isHighLight,
  onClick,
  candidates,
  index,
}: CellProps) {
  return (
    <button
      id={"cell" + index}
      onClick={() => {
        onClick();
      }}
      className={cn(
        css.cell,
        isCurrent && css.cellCurrent,
        isHighLight && css.cellHighLight,
        isSame && css.sameNumber,
      )}
    >
      {candidates > 0 ? (
        <div className={css.candidates}>
          {viewCandidates(candidates).map((n) => {
            return (
              <span
                className={css.candidate}
                style={{ gridArea: "c" + n }}
                key={n}
              >
                {n}
              </span>
            );
          })}
        </div>
      ) : (
        <span>{value === 0 ? "" : value}</span>
      )}
    </button>
  );
}

function NumRow({
  onClick,
  candidate,
}: {
  onClick: (value: number) => void;
  candidate?: boolean;
}) {
  return (
    <div className={css.numRow} style={{ opacity: candidate ? 0.7 : 1 }}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => {
        return <button onClick={() => onClick(n)}>{n || "X"}</button>;
      })}
    </div>
  );
}
