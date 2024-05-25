import css from "./Sudoku.module.css";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { cn } from "../unit";
import { generate } from "./lib";
import { all_difficulties } from "./lib/constants";

type Field = number[];

function saveFieldsToLS(field: Field) {
  try {
    localStorage.setItem("sudoku_WIP", JSON.stringify(field));
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

function getFieldsFromLS(): Field {
  try {
    let rawField = localStorage.getItem("sudoku_WIP") || "";
    let field = JSON.parse(rawField) as any as any[];

    if (
      field.every((it) => {
        return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(it);
      }) &&
      field.length === 81
    ) {
      return field as number[];
    }
    return Array(81).fill(0);
  } catch (err) {
    console.error(err);
    return Array(81).fill(0);
  }
}

export function SudokuPage() {
  const [field, setField] = useState<number[] | null>(null);
  const [stage, setStage] = useState<"generating" | "generated">("generated");
  const [candidates, setCandidates] = useState<number[][]>(
    Array(81)
      .fill(0)
      .map(() => []),
  );

  const [current, setCurrent] = useState<null | number>(null);

  useEffect(() => {
    setField(getFieldsFromLS());
  }, []);

  const highLightCells = useMemo(() => {
    let res: number[] = [];

    // if (!current) return res;
    // [0, 1, 2, 3, 4, 5, 6, 7, 8].forEach((n) => {
    //   res.push(`${current[0]},${n}`);
    // });
    // [0, 1, 2, 3, 4, 5, 6, 7, 8].forEach((n) => {
    //   res.push(`${n},${current[1]}`);
    // });
    // let f = Math.floor(current[0] / 3) * 3;
    // for (let i = f; i < f + 3; i++) {
    //   let ff = Math.floor(current[1] / 3) * 3;
    //   for (let j = ff; j < ff + 3; j++) {
    //     res.push(`${i},${j}`);
    //   }
    // }
    return res;
  }, [current]);

  function startGenerate(d: (typeof all_difficulties)[number]) {
    if (stage === "generating") return;

    setStage("generating");
    setField(null);

    generate(d)
      .then((f) => {
        let newField = f.map((it) => it || 0);
        setField(newField);
        saveFieldsToLS(newField);
      })
      .finally(() => {
        setStage("generated");
      });
  }

  return (
    <div className={css.root}>
      <p>sudoku</p>
      <p>
        generate:
        {all_difficulties.map((d) => {
          return (
            <button
              style={{
                pointerEvents: stage === "generating" ? "none" : "initial",
                opacity: stage === "generating" ? 0.5 : 1,
              }}
              onClick={() => {
                startGenerate(d);
              }}
            >
              {d}
            </button>
          );
        })}
      </p>

      <div className={css.field}>
        {!field ? (
          <p>loading</p>
        ) : (
          fieldToLayout(field).map((small, i) => {
            return (
              <div className={css.smalBox} key={i}>
                {small.map(([val, index]) => {
                  return (
                    <Cell
                      onArrowClick={(dir) => {
                        if (!current) return;
                        let newPos = {
                          ArrowUp: current - 9,
                          ArrowDown: current + 9,
                          ArrowLeft: current - 1,
                          ArrowRight: current + 1,
                        }[dir];

                        if (
                          newPos !== undefined &&
                          newPos >= 0 &&
                          newPos < 81
                        ) {
                          setCurrent(newPos);
                        }
                      }}
                      candidates={candidates[index]}
                      key={index}
                      isCurrent={current === index}
                      isHighLight={highLightCells.includes(index)}
                      value={val}
                      onClick={() => {
                        setCurrent(index);
                      }}
                      onChange={(val) => {
                        const newField = [...field];
                        newField[index] = val;
                        setField(newField);
                        saveFieldsToLS(newField);

                        const newCandidates = [...candidates];
                        newCandidates[index] = [];
                        setCandidates(newCandidates);
                      }}
                      onCandidateChange={(val) => {
                        // console.log(val);
                        const newCandidates = [...candidates];
                        newCandidates[index] = val;
                        setCandidates(newCandidates);
                      }}
                    />
                  );
                })}
              </div>
            );
          })
        )}
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
  onChange: (val: number) => void;
  onCandidateChange: (candidates: number[]) => void;
  onArrowClick: (dir: string) => void;
  candidates: number[];
};

function Cell({
  value,
  isCurrent,
  isHighLight,
  onClick,
  onChange,
  onCandidateChange,
  onArrowClick,
  candidates,
}: CellProps) {
  const clearCand = [...new Set(candidates)];
  return (
    <label
      className={cn(
        css.cell,
        isCurrent && css.cellCurrent,
        isHighLight && css.cellHighLight,
      )}
    >
      {candidates.length > 0 ? (
        <div className={css.candidates}>
          {clearCand.map((val) => {
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
      <input
        onFocus={() => {
          onClick();
        }}
        onKeyDown={(ev) => {
          // console.log(ev.key, ev.code, ev.shiftKey);
          if (
            ev.code === "ArrowUp" ||
            ev.code === "ArrowDown" ||
            ev.code === "ArrowLeft" ||
            ev.code === "ArrowRight"
          ) {
            onArrowClick(ev.code);
          } else if (ev.code === "Backspace" || ev.code === "Delete") {
            onChange(0);
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
              if (clearCand.includes(newVal)) {
                onCandidateChange(clearCand.filter((it) => it !== newVal));
              } else {
                onCandidateChange([...clearCand, newVal]);
              }
            } else {
              onChange(newVal);
            }
          }
        }}
      />
    </label>
  );
}
