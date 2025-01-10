import { PropsWithChildren, useState } from "react";
import { ChevronIcon } from "../ui/ChevronIcon";
import css from "./Left.module.css";

export function Left() {
  return (
    <div class={css.root}>
      <div style={{ display: "flex" }}>
        <p>my games</p>
        <p>[filter]</p>
        <p>[edit]</p>
      </div>
      <DrobdownList title="Chanels">items</DrobdownList>
      <DrobdownList title="Direct messages">items</DrobdownList>
    </div>
  );
}

export function DrobdownList({
  title,
  children,
}: PropsWithChildren<{ title: string }>) {
  let [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <div
        style={{ display: "flex" }}
        onClick={() => {
          setIsOpen((val) => !val);
        }}
      >
        <ChevronIcon isOpen={!isOpen} />
        <p>{title}</p>
      </div>
      <div>{isOpen && children}</div>
    </div>
  );
}
