import css from "./Center.module.css";
import { ChevronIcon } from "../ui/ChevronIcon";
import { cn } from "../unit";
import { ComponentChildren } from "preact";
import iconA from "../assets/icons/ic-actions-add-file.svg";
import iconB from "../assets/icons/ic-media-backward.svg";
import iconC from "../assets/icons/ic-chevron-left-right.svg";
import iconD from "../assets/icons/ic-devices-controller.svg";

export function Center() {
  return (
    <div class={css.root}>
      <p>breadcrumbs</p>
      <h2>Story name</h2>
      <p>
        lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>
      <Comment name="Nikolai" icon={iconA} date="4 march 2023 at 16:03">
        <p>text</p>
      </Comment>
      <Comment
        name="Nikolai Morozov"
        icon={iconB}
        date="14 march 2023 at 15:21"
      >
        <p>text</p>
      </Comment>
    </div>
  );
}

export function Comment({
  name,
  icon,
  date,
  children,
}: {
  name: string;
  icon: string;
  date: string;
  children: ComponentChildren;
}) {
  return (
    <div>
      <p>{name}</p>
      <p>{icon}</p>
      <p>{date}</p>
      {children}
    </div>
  );
}
