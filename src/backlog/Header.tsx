import { useState } from "preact/hooks";
import css from "./Header.module.css";
import { ChevronIcon } from "../ui/ChevronIcon";
import { ComponentChildren } from "preact";
import { Button } from "../ui/Button";
import { cn } from "../unit";

export function Header() {
  return (
    <div class={css.root}>
      <p>Projects / GOftcards / Giftcard boards</p>
      <div>
        <h1>Backlog</h1>
      </div>

      <p></p>
    </div>
  );
}
