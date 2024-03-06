import { ComponentChildren } from "preact";
import css from "./ui.module.css";

export function Button({
  children,
  onClick,
}: {
  children: ComponentChildren;
  onClick?: (ev: MouseEvent) => void;
}) {
  return (
    <button class={css.button} type="button" onClick={onClick}>
      {children}
    </button>
  );
}
