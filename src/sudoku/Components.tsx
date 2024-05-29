import { cn } from "../unit";
import css from "./PuzzlePage.module.css";
import { viewCandidates } from "./utils";

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
