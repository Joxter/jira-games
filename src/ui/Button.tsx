import css from "./ui.module.css";
import { PropsWithChildren } from "react";
import { cn } from "../unit.ts";

type Props = PropsWithChildren<{
  onClick?: (ev: MouseEvent) => void;
  selected?: boolean;
}>;

export function Button({ children, onClick, selected }: Props) {
  return (
    <button
      class={cn(css.button, selected && css.selected)}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
