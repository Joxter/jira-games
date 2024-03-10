import css from "./Center.module.css";
import { ComponentChildren } from "preact";
import iconA from "../assets/icons/ic-actions-add-file.svg";
import iconB from "../assets/icons/ic-media-backward.svg";

export function Center() {
  return (
    <div class={css.root}>
      <div class={css.content}>
        <p>breadcrumbs</p>
        <h2>Story name</h2>
        {Array(20).fill(
          <p>
            lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>,
        )}
        <Comment name="Nikolai" icon={iconA} date="4 march 2023 at 16:03">
          <p>text</p>
        </Comment>
        <Comment
          name="Nikolai Morozov"
          icon={iconB}
          date="14 march 2023 at 15:21"
        >
          <p>text 2</p>
        </Comment>
      </div>
      <div class={css.comments}>
        <p>leave comment</p>
        <textarea name="" id=""></textarea>
      </div>
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
