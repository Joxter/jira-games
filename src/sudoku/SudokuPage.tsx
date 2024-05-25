import css from "./Sudoku.module.css";
import { cn } from "../unit";
import { all_difficulties } from "./lib/constants";
import {
  $field,
  $candidates,
  $currentCell,
  $highLightCells,
  arrowClicked,
  cellCandidateChanged,
  cellChanged,
  cellClicked,
  diffClicked,
  resetClicked,
} from "./sudoku.model";
import { useUnit } from "effector-react";
import { useEffect, useRef } from "preact/hooks";

export function SudokuPage() {
  const [field, candidates, current, highLightCells] = useUnit([
    $field,
    $candidates,
    $currentCell,
    $highLightCells,
  ]);

  const fieldRef = useRef<any>(null);

  useEffect(() => {
    function h(ev: any) {
      if (!fieldRef.current!.contains(ev.target)) {
        cellClicked(null);
      }
    }
    document.addEventListener("click", h);

    return () => document.removeEventListener("click", h);
  }, []);

  return (
    <div className={css.root}>
      <p>
        <button
          onClick={() => {
            resetClicked();
          }}
        >
          reset
        </button>
      </p>
      <p>
        generate:
        {all_difficulties.map((d) => {
          return (
            <button
              onClick={() => {
                diffClicked(d);
              }}
            >
              {d}
            </button>
          );
        })}
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
                    isCurrent={current === index}
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
  isCurrent: boolean;
  isHighLight: boolean;
  onClick: () => void;
  candidates: number[];
};

function Cell({
  value,
  isCurrent,
  isHighLight,
  onClick,
  candidates,
}: CellProps) {
  return (
    <button
      onClick={() => {
        onClick();
      }}
      className={cn(
        css.cell,
        isCurrent && css.cellCurrent,
        isHighLight && css.cellHighLight,
      )}
    >
      {candidates.length > 0 ? (
        <div className={css.candidates}>
          {candidates.map((val) => {
            return (
              <span
                className={css.candidate}
                style={{ gridArea: "c" + val }}
                key={val}
              >
                {val}
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
