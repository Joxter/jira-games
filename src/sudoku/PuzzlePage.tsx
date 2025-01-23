import {
  $candidates,
  $field,
  addSecToTime,
  cellClicked,
  revealNumber,
  seveToPuzzleToLS,
} from "./sudoku.model";
import { useUnit } from "effector-react";
import { useEffect, useRef } from "react";
import { fastSolve } from "./utils";
import { WinModal } from "./Components";
import { useLocale } from "./locale/locale.model";
import { Field, revealAnimation } from "./Field.tsx";
import { Link } from "wouter";
import { Layout } from "./components/Layout.tsx";
import { FooterControls } from "./FooterControls.tsx";

export function PuzzlePage() {
  const [field, candidates] = useUnit([$field, $candidates]);

  let locale = useLocale();

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

  const fieldPadding = 12;

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
        <Field />
        <FooterControls />
      </div>
    </Layout>
  );
}
