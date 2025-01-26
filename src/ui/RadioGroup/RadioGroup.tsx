import css from "./RadioGroup.module.css";
import { PropsWithChildren } from "react";

type Props<T> = PropsWithChildren<{
  label?: string;
  options: { label: string; value: T }[];
  value: T;
  onChange: (val: T) => void;
}>;

export function RadioGroup<T extends string>({
  value,
  options,
  onChange,
  label,
}: Props<T>) {
  return (
    <div className={css.root}>
      {label && <span className={css.label}>{label}</span>}
      <div className={css.optionsContainer}>
        {options.map((option) => (
          <label key={option.value} className={css.option}>
            <span className={css.radioSwitch}>
              <input
                type="radio"
                name="radio-group"
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
              />
              <span className={css.slider} />
            </span>
            <span className={css.text}>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
