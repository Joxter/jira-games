import { cn } from "../unit";
import css from "./PuzzlePage.module.css";
import { viewCandidates } from "./utils";
import { useEffect, useRef } from "preact/hooks";
import { $history, openWinModal } from "./sudoku.model";
import { useUnit } from "effector-react/effector-react.umd";

type CellProps = {
  value: number;
  index: number;
  isCurrent: boolean;
  isSame: boolean;
  isPuzzle: boolean;
  isHighLight: boolean;
  onClick: () => void;
  candidates: number;
};

export function Cell({
  value,
  isCurrent,
  isSame,
  isHighLight,
  isPuzzle,
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
        isPuzzle && css.cellPuzzle,
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

export function NumRow({
  onClick,
  candidate,
}: {
  onClick: (value: number) => void;
  candidate?: boolean;
}) {
  return (
    <div className={css.numRow} style={{ opacity: candidate ? 0.7 : 1 }}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
        return <button onClick={() => onClick(n)}>{n}</button>;
      })}
    </div>
  );
}

export function Time() {
  let [{ time }] = useUnit([$history]);
  let hour = Math.floor(time / 360);
  let min = Math.floor((time - hour * 60) / 360);
  let sec = time % 60;

  return (
    <span style={{ fontVariantNumeric: "tabular-nums" }}>
      {[hour, min, sec].map((it) => it.toString().padStart(2, "0")).join(":")}
    </span>
  );
}

export function WinModal() {
  let dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    let unsub = openWinModal.watch((nums) => {
      dialogRef.current?.showModal();
    });

    return () => unsub();
  }, []);

  return (
    <dialog ref={dialogRef} className={css.winModal}>
      <h1>win!</h1>
      <p>
        Your time: <Time />
      </p>
      <button
        onClick={() => {
          dialogRef.current?.close();
        }}
      >
        close
      </button>
    </dialog>
  );
}
