import { cn } from "../unit";
import css from "./CartRound.module.css";

// clubs (♣), diamonds (♦), hearts (♥) and spades (♠)
// types: ['c', 'd', 'h', 's'],
let typeToIcon: Record<string, string> = {
  c: "♣",
  d: "♦",
  h: "♥",
  s: "♠",
};

export function CartRound({ type, name }: { type: string; name: string }) {
  let text = "" + name + (typeToIcon[type] || type);
  let color =
    type === "h" || type === "d" || type === "♥" || type === "♦"
      ? "red"
      : "black";

  return (
    <button
      class={cn("resetButton", css.root)}
      style={{ backgroundColor: color }}
    >
      {text}
    </button>
  );
}
