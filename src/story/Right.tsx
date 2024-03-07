import css from "./Right.module.css";
import { ChevronIcon } from "../ui/ChevronIcon";
import { cn } from "../unit";
import { ComponentChildren } from "preact";
import iconA from "../assets/icons/ic-devices-ipad.svg";
import iconB from "../assets/icons/ic-emoji-quite-ok.svg";
import iconC from "../assets/icons/ic-actions-add-ribbon.svg";
import iconD from "../assets/icons/ic-media-volume.svg";

export function Right() {
  return (
    <div class={css.root}>
      <div>icons</div>

      <p>ready for development</p>
      <p>actions</p>

      <div class={css.dropdown}>
        <h2>Details</h2>
        <p>Assigne []</p>
        <p>Reporter</p>
        <p>Development</p>
        <p>priority</p>
      </div>
      <div class={css.dropdown}>
        <h2>more fields</h2>
        <p>some delails elepsys</p>
      </div>

      <p>created 23 may 2025</p>
      <p>updated 23 may 2025</p>

      <p>Configure</p>

      <div style={{ height: "300px" }}></div>
    </div>
  );
}
