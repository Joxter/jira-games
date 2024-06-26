import css from "./Left.module.css";
import { ChevronIcon } from "../ui/ChevronIcon";
import { cn } from "../unit";
import { ComponentChildren } from "preact";
import iconA from "../assets/icons/ic-actions-add-file.svg";
import iconB from "../assets/icons/ic-media-backward.svg";
import iconC from "../assets/icons/ic-chevron-left-right.svg";
import iconD from "../assets/icons/ic-devices-controller.svg";

export function Left() {
  return (
    <div class={css.root}>
      <div class={css.project}>
        <img src="https://placehold.co/30x20" />
        <div class={css.projectCont}>
          <h2>{"Giftcards".repeat(1)}</h2>
          <p>Software project</p>
        </div>
      </div>

      <h2 class={css.header}>Planning</h2>
      <div class={css.grayBox}>
        <div class={css.gbHeader}>
          <div>
            <h3>Giftcards board</h3>
            <p>Board</p>
          </div>
          <ChevronIcon />
        </div>
        <NavLink>
          <img src={iconA} alt="" />
          Timeline
        </NavLink>
        <NavLink>
          <img src={iconB} alt="" />
          Backlog
        </NavLink>
        <NavLink>
          <img src={iconC} alt="" />
          Canban
        </NavLink>
        <NavLink>
          <img src={iconD} alt="" />
          Reports
        </NavLink>
      </div>

      <NavLink isCurrent>
        <img src={iconA} alt="" />
        Issues
      </NavLink>

      <p>Components [new]</p>

      <h2 class={css.header}>Development</h2>
      <NavLink isCurrent>
        <img src={iconD} alt="" />
        Code
      </NavLink>
      <NavLink>
        <img src={iconB} alt="" />
        Security
      </NavLink>

      <div class={css.separator}></div>
      <h2 class={css.header}>something</h2>
      <NavLink>
        <img src={iconC} alt="" />
        Security
      </NavLink>
      <div style={{ height: "300px" }}></div>
    </div>
  );
}

function NavLink({
  href,
  isCurrent,
  children,
}: {
  href?: string;
  isCurrent?: boolean;
  children: ComponentChildren;
}) {
  return (
    <a href={href || "#"} class={cn(css.navLink, isCurrent && css.current)}>
      {children}
    </a>
  );
}
