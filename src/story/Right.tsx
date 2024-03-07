import css from "./Right.module.css";
import { ChevronIcon } from "../ui/ChevronIcon";
import { cn } from "../unit";
import { ComponentChildren } from "preact";
import iconA from "../assets/icons/ic-devices-ipad.svg";
import iconB from "../assets/icons/ic-emoji-quite-ok.svg";
import iconC from "../assets/icons/ic-actions-add-ribbon.svg";
import iconD from "../assets/icons/ic-media-volume.svg";
import moreIcon from "../assets/icons/ic-actions-more-1.svg";
import { Button } from "../ui/Button";
import { useState } from "preact/hooks";

export function Right() {
  return (
    <div class={css.root}>
      <div class={css.topIcons}>
        <img src={iconA} alt="" />
        <img src={iconB} alt="" />
        <img src={iconC} alt="" />
        <img src={iconD} alt="" />
        <img src={moreIcon} alt="" />
      </div>

      <div class={css.mainActions}>
        <Button>ready for development</Button>
        <Button>actions</Button>
      </div>

      <Dropdown title="Delails" isOpen>
        <InfoBlock title="Assignee">
          <Person icon="" name="Nikolai Morozov" />
          <button class={cn("resetButton", css.linkButton)}>
            Assign to me
          </button>
        </InfoBlock>
        <InfoBlock title="Reporter">
          <Person icon="" name="Some very long naaaaaame" />
        </InfoBlock>
        <InfoBlock title="Development">foo</InfoBlock>
        <InfoBlock title="Priority">foo</InfoBlock>
      </Dropdown>

      <Dropdown
        title={
          <div
            style={`  
            display: grid;
            gap: 8px;
            grid-auto-flow: column;
            `}
          >
            <h2>more fields</h2>
            <img src={iconB} alt="" style={`width: 24px`} />
            <p class="textOverflow">some delails elepsysssssss</p>
          </div>
        }
      >
        hidden content
      </Dropdown>

      <div
        style={`
        padding: 12px;
      `}
      >
        <p class={css.grayText}>Created 23 may 2025 at 12:55</p>
        <p class={css.grayText}>Updated 3 may 2015 at 16:17</p>
      </div>

      <div style={{ height: "00px" }}></div>
    </div>
  );
}

function Dropdown({
  children,
  title,
  isOpen,
}: {
  children?: ComponentChildren;
  title: ComponentChildren;
  isOpen?: boolean;
}) {
  let [open, setOpen] = useState(isOpen);

  return (
    <div class={css.dropdown}>
      <button
        class={cn("resetButton", css.ddHeader)}
        onClick={() => setOpen(!open)}
      >
        {title}
        <ChevronIcon isOpen={open} />
      </button>
      {open && <div class={css.ddContent}>{children}</div>}
    </div>
  );
}

function InfoBlock({
  title,
  children,
}: {
  title: string;
  children: ComponentChildren;
}) {
  return (
    <div class={css.infoBlock}>
      <div class={css.ibTitle}>{title}</div>
      <div>{children}</div>
    </div>
  );
}

function Person({ icon, name }: { icon: string; name: string }) {
  return (
    <div class={css.person}>
      <div class={css.pIcon}>{icon || "EV"}</div>
      <p class="textOverflow">{name}</p>
    </div>
  );
}
