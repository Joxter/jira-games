import { useState } from "preact/hooks";
import css from "./Header.module.css";
import { ChevronIcon } from "../ui/ChevronIcon";
import { ComponentChildren } from "preact";
import { Button } from "../ui/Button";
import { cn } from "../unit";

export function Header() {
  return (
    <div class={css.root}>
      <Icon9 size={18} />
      <img
        style={{
          border: "1px solid #333",
        }}
        src={
          "https://placehold.co/180x40/fdcf39/000?font=raleway&text=Woolsocks"
        }
      />
      <NavigationItem>Your work</NavigationItem>
      <NavigationItem isCurrent>Projects</NavigationItem>
      <NavigationItem>Folters</NavigationItem>
      <NavigationItem>Dashboards</NavigationItem>
      <NavigationItem>More</NavigationItem>
      <Button>Create</Button>
    </div>
  );
}

function Icon9({ size = 24 }: { size?: number }) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "13%",
      }}
    >
      <div style={{ backgroundColor: "#000" }}></div>
      <div style={{ backgroundColor: "#000" }}></div>
      <div style={{ backgroundColor: "#000" }}></div>
      <div style={{ backgroundColor: "#000" }}></div>
      <div style={{ backgroundColor: "#000" }}></div>
      <div style={{ backgroundColor: "#000" }}></div>
      <div style={{ backgroundColor: "#000" }}></div>
      <div style={{ backgroundColor: "#000" }}></div>
      <div style={{ backgroundColor: "#000" }}></div>
    </div>
  );
}

function NavigationItem({
  children,
  isCurrent,
}: {
  children: ComponentChildren;
  isCurrent?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <button
      type="button"
      class={cn(css.navItem, isCurrent && css.currentNav)}
      onClick={() => {
        setOpen((val) => !val);
      }}
    >
      {children}
      <ChevronIcon size={16} isOpen={open} />
    </button>
  );
}
