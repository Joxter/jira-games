import css from "./ui.module.css";
import { PropsWithChildren } from "react";

export function Button({
  children,
  onClick,
}: PropsWithChildren<{ onClick?: (ev: MouseEvent) => void }>) {
  return (
    <button class={css.button} type="button" onClick={onClick}>
      {children}
    </button>
  );
}
