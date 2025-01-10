import css from "./PuzzlePage.module.css";
import {
  $candidates,
  $currentCell,
  numberPressed,
  cellClicked,
  undo,
  redo,
  $field,
  addSecToTime,
  seveToPuzzleToLS,
  inputModeChanged,
  $inputMode,
  revealNumber,
  $puzzle,
} from "./sudoku.model";
import { useUnit } from "effector-react";
import { useEffect, useRef } from "react";
import { fastSolve, getRelated } from "./utils";
import { NumRow, WinModal } from "./Components";
import { cn } from "../unit";
import { useLocale } from "./locale/locale.model";
import { Field, revealAnimation } from "./Field.tsx";
import { Link } from "wouter";
import { Layout } from "./components/Layout.tsx";

export function PuzzlePage() {
  const [puzzle, field, candidates, current, inputMode] = useUnit([
    $puzzle,
    $field,
    $candidates,
    $currentCell,
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

  if (!candidates || !field) return <p>no field</p>;

  return (
    <Layout>
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
              alert("solvable :)");
            } else {
              alert("unsolvable :(");
            }
          }}
        >
          {locale.is_valid}
        </button>
        <button
          onClick={() => {
            if (!field) return;

            let answer = fastSolve(field);

            if (answer) {
              cellClicked(null);
              answer.forEach((correct, i) => {
                let fieldNum = field[i];

                let cell = document.querySelector("#cell" + i) as HTMLElement;
                setTimeout(() => {
                  revealNumber({ number: correct, pos: i });
                  revealAnimation(cell, fieldNum === correct);
                }, i * 30);
              });
            }
          }}
        >
          всё решить
        </button>
      </div>
      <br />
      <div ref={pageRef} style={{ padding: `0 ${fieldPadding}px` }}>
        <Field cellSize={40} />
        <div className={css.nums} style={{ padding: `0 ${fieldPadding}px` }}>
          <div className={css.numsActions}>
            <button onClick={() => numberPressed(0)}>{locale.clearCell}</button>
            <button
              onClick={() => {
                if (!field || !current) return;

                let answer = fastSolve(puzzle.split("").map((a) => +a));
                if (!answer) return;

                revealNumber({
                  number: answer[current],
                  pos: current,
                });
              }}
            >
              open
            </button>
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
    </Layout>
  );
}
