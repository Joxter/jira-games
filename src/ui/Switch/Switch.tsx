import css from "./Switch.module.css";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  text?: string;
  value: boolean;
  onChange: (val: boolean) => void;
}>;

export function Switch({ value, children, onChange }: Props) {
  return (
    <label className={css.root}>
      <span className={css.switch}>
        <input
          type="checkbox"
          onChange={() => {
            onChange(!value);
          }}
        />
        <span className={css.slider} />
      </span>
      <span className={css.text}>{children}</span>
    </label>
  );
}
