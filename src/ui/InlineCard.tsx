import css from "./ui.module.css";
import { cn } from "../unit";
import { CardSuits } from "../backlog/solitaire";

let cardRankToName: Record<number, string> = {
  // 0: "-",
  1: "A",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  10: "0",
  11: "J",
  12: "Q",
  13: "K",
};

export function InlineCard({
  rank,
  suit,
  border,
  onClick,
}: {
  rank?: number;
  suit?: keyof typeof CardSuits;
  border?: string;
  onClick?: (ev: MouseEvent) => void;
}) {
  if (!rank || !suit || !cardRankToName[rank]) {
    return (
      <span
        class={cn("resetButton", css.inlineCard)}
        style={{
          color: "#44546F",
          backgroundColor: "#fff",
          boxShadow: border ? "inset 0 0 0 1px " + border : "",
        }}
        type="button"
        onClick={onClick}
      >
        XX
      </span>
    );
  }

  let suitData = CardSuits[suit];

  let aa = {
    red: { color: "#AE2E24", bg: "#FFD5D2" },
    black: { color: "#172B4D", bg: "#f0f1f4" },
  };

  return (
    <button
      class={cn("resetButton", css.inlineCard)}
      style={{
        color: aa[suitData.color].color,
        // backgroundColor: aa[suitData.color].bg,
        boxShadow: border ? "inset 0 0 0 1px " + border : "",
      }}
      type="button"
      onClick={onClick}
    >
      {cardRankToName[rank]} {suitData.char}
    </button>
  );
}
