import { useState } from "preact/hooks";
import css from "./Left.module.css";
import { ChevronIcon } from "../ui/ChevronIcon";
import { cn } from "../unit";

export function Left() {
  return (
    <div class={css.root}>
      <div class={css.project}>
        <img src="https://placehold.co/30x20" />
        <div class={css.projectCont}>
          <h2>Giftcards Giftcards Giftcards Giftcards Giftcards</h2>
          <p>Software project</p>
        </div>
      </div>

      <h2 class={css.header}>Planning</h2>
      <div>
        <div>
          Giftcards board
          <ChevronIcon />
        </div>
        <p>Timeline</p>
        <p>Backlog</p>
        <p>Canban</p>
        <p>Reports</p>
      </div>

      <p>Issues</p>
      <p>Components [new]</p>

      <h2 class={css.header}>Development</h2>
      <p>Code</p>
      <p>Security</p>

      <p>---------</p>
      <h2 class={css.header}>something</h2>
      <p>Project pages</p>
      <p>-</p>
      <p>-</p>
      <p>-</p>
      <p>-</p>
      <p>-</p>
      <p>-</p>
      <p>-</p>
      <p>-</p>
      <p>-</p>
    </div>
  );
}
