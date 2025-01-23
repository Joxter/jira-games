import css from "./PuzzlePage.module.css";
import {
  $currentCell,
  numberPressed,
  undo,
  redo,
  $field,
  inputModeChanged,
  $inputMode,
  revealNumber,
  $solved,
} from "./sudoku.model";
import { useUnit } from "effector-react";
import { getRelated } from "./utils";
import { NumRow } from "./Components";
import { cn } from "../unit";
import { useLocale } from "./locale/locale.model";

export function FooterControls() {
  const [solved, field, current, inputMode] = useUnit([
    $solved,
    $field,
    $currentCell,
    $inputMode,
  ]);

  let locale = useLocale();

  const fieldPadding = 12;

  return (
    <div className={css.nums} style={{ padding: `0 ${fieldPadding}px` }}>
      <div className={css.numsActions}>
        <button onClick={() => numberPressed(0)}>{locale.clearCell}</button>
        <button
          onClick={() => {
            if (current) {
              revealNumber({ number: solved![current], pos: current });
            }
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
                return field![id];
              })
            : []
        }
        doneNums={[1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => {
          return field!.filter((a) => a === n).length === 9;
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
  );
}
