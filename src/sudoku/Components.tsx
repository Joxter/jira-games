import { cn } from "../unit";
import css from "./PuzzlePage.module.css";
import { formatTime, viewCandidates } from "./utils";
import { useEffect, useRef } from "preact/hooks";
import { $currentLogs, openWinModal, winCloseClicked } from "./sudoku.model";
import { useUnit } from "effector-react/effector-react.umd";

type CellProps = {
  value: number;
  borders: Record<any, any>[];
  index: number;
  isCurrent: boolean;
  isSame: boolean;
  isPuzzle: boolean;
  isHighLight: boolean;
  onClick: () => void;
  candidates: number;
  style: any;
};

export function Cell({
  value,
  borders,
  isCurrent,
  isSame,
  isHighLight,
  isPuzzle,
  onClick,
  candidates,
  index,
  style,
}: CellProps) {
  return (
    <>
      {borders.map((styles) => {
        return <div style={{ ...styles }} />;
      })}
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
        style={style}
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
    </>
  );
}

export function NumRow({
  onClick,
  candidate,
  invalidNums,
  doneNums,
}: {
  onClick: (value: number) => void;
  candidate?: boolean;
  invalidNums?: number[] | null;
  doneNums?: number[] | null;
}) {
  return (
    <div className={css.numRow}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
        let isInvalid = invalidNums && invalidNums.includes(n);
        let isDone = doneNums && doneNums.includes(n);

        let borderRadius: Record<string, string> = {
          1: "11px 0 0 0",
          3: "0 11px 0 0",
          7: "0 0 0 11px",
          9: "0 0 11px 0",
        };

        return (
          <button
            style={{
              borderRadius: borderRadius[n] || "",
            }}
            onClick={() => onClick(n)}
            className={cn(
              (isDone && css.done) || (isInvalid && css.invalid),
              candidate && css.numCandidate,
            )}
          >
            {doneNums && doneNums.includes(n) ? ":)" : n}
          </button>
        );
      })}
    </div>
  );
}

export function Time({ time: propsTime }: { time?: number }) {
  let [logs] = useUnit([$currentLogs]);
  let t = propsTime ?? logs?.time;

  return (
    <span style={{ fontVariantNumeric: "tabular-nums" }}>
      {t ? formatTime(t) : ""}
    </span>
  );
}

export function WinModal() {
  let dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    let unsub = openWinModal.watch(() => {
      dialogRef.current?.showModal();
    });
    let unsub2 = winCloseClicked.watch(() => {
      location.hash = "#list";
      dialogRef.current?.close();
    });

    return () => {
      unsub();
      unsub2();
    };
  }, []);

  return (
    <dialog ref={dialogRef} className={css.winModal}>
      <h1>win!</h1>
      <p>
        Your time: <Time />
      </p>
      <button
        onClick={() => {
          winCloseClicked();
        }}
      >
        close
      </button>
    </dialog>
  );
}
