import css from "./PuzzlePage.module.css";
import {
  $candidates,
  $currentCell,
  $highLightCells,
  arrowClicked,
  numberWithShiftPressed,
  numberPressed,
  cellClicked,
  showCellError,
  $field,
  $puzzle,
  addSecToTime,
  seveToPuzzleToLS,
  $inputMode,
} from "./sudoku.model";
import { useUnit } from "effector-react";
import { useEffect, useMemo, useRef } from "react";
import { Cell } from "./Components";
import { generateFromSchema } from "./puzzle-utils.ts";

export function Field({ cellSize }: { cellSize: number }) {
  const [puzzle, field, candidates, current, highLightCells, inputMode] =
    useUnit([
      $puzzle,
      $field,
      $candidates,
      $currentCell,
      $highLightCells,
      $inputMode,
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

    document.addEventListener("visibilitychange", seveToPuzzleToLS);

    return () => {
      document.removeEventListener("visibilitychange", seveToPuzzleToLS);
      clearInterval(id);
    };
  }, []);

  const borderSize = 2;

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

  const borders = useMemo(() => {
    let schema = `
111222333
111222333
111222333
444555666
444555666
444555666
777888999
777888999
777888999
`;
    return generateFromSchema(schema).getBorders(borderSize, +cellSize);
  }, [borderSize, +cellSize]);

  if (!candidates || !field) return <p>no field</p>;

  return (
    <div
      className={css.field}
      style={{
        gap: `${borderSize}px`,
        "--cell-size": `${cellSize}px`,
        "--border-size": `${borderSize}px`,
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
          numberPressed(0);
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
            numberWithShiftPressed(newVal);
          } else {
            numberPressed(newVal);
          }
        }
      }}
    >
      {borders.map((b, i) => {
        return (
          <div
            key={i}
            style={{
              backgroundColor: "#555",
              position: "absolute",
              left: `${b.left}px`,
              top: `${b.top}px`,
              width: `${b.width}px`,
              height: `${b.height}px`,
              zIndex: 10,
            }}
          />
        );
      })}
      {field.map((value, index) => {
        return (
          <>
            <Cell
              style={{
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
          </>
        );
      })}
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

export function revealAnimation(cell: HTMLElement, correct: boolean) {
  cell.style.position = "relative";
  cell.style.zIndex = "10";

  let animate = cell.animate(
    [{ transform: "scale(1.5)" }, { transform: "scale(1)" }],
    { duration: 300, iterations: 1, easing: "ease-in-out" },
  );
  animate.onfinish = () => {
    cell.style.zIndex = "initial";
  };

  cell.animate(
    [
      {
        boxShadow: correct
          ? "inset 0 0 2px 4px rgba(0, 255, 0, 0.2)"
          : "inset 0 0 2px 4px rgba(255, 0, 0, 0.5)",
        color: correct ? "green" : "red",
      },
      { boxShadow: "none", color: "#213547" },
    ],
    { duration: 1000, iterations: 1, easing: "ease-in-out" },
  );
}
