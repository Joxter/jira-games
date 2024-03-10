import { useEffect, useState } from "preact/hooks";
import css from "./BacklogPage.module.css";
import overlay from "./image.png";
import { Left } from "../story/Left";
import { Header } from "../story/Header";
import { Header as InnerHeader } from "./Header";
import { ComponentChildren } from "preact";
import { ChevronIcon } from "../ui/ChevronIcon";

export function BacklogPage() {
  let [isOverlayhow, setIsOverlayhow] = useState(false);
  let [opacity, setOpacity] = useState(
    +(sessionStorage.getItem("opacity")! || 100),
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "z") {
        setIsOverlayhow((val) => !val);
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <>
      {isOverlayhow && (
        <img
          class={css.overlay}
          style={{
            opacity: String(+opacity / 100),
          }}
          src={overlay}
        />
      )}
      <label
        style={{
          position: "fixed",
          zIndex: 1,
          bottom: "5px",
          padding: "8px 12px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          background: "#fff",
        }}
      >
        <input
          type="checkbox"
          checked={isOverlayhow}
          onChange={() => {
            setIsOverlayhow(!isOverlayhow);
          }}
        />
        overlay
      </label>
      <div
        style={{
          position: "fixed",
          bottom: "50px",
          zIndex: 1,
          background: "#fff",
          display: "flex",
          gap: "12px",
          padding: "8px 12px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      >
        {[0, 10, 25, 50, 80, 100].map((val) => {
          return (
            <label>
              <input
                type="radio"
                name="opacity"
                checked={opacity === val}
                onClick={() => {
                  setOpacity(val);
                  sessionStorage.setItem("opacity", String(val));
                }}
              />
              {val}
            </label>
          );
        })}
      </div>
      <div class={css.root}>
        <div class={css.header}>
          <Header />
        </div>
        <div class={css.left}>
          <Left />
        </div>
        <div class={css.content}>
          <InnerHeader />
          <GrayBox title="Finish desk">
            <p>foo</p>
          </GrayBox>
          <GrayBox title="Board">
            <p>foo</p>
          </GrayBox>
        </div>
      </div>
    </>
  );
}

function GrayBox({
  children,
  title,
}: {
  children: ComponentChildren;
  title: string;
}) {
  return (
    <div class={css.greyBox}>
      <div class={css.greyHeader}>
        <p>
          <ChevronIcon size={16} />
          {title}
        </p>
        <div class={css.greyStats}>
          <span style={{ backgroundColor: "gray" }}>4</span>
          <span style={{ backgroundColor: "red" }}>10</span>
          <span style={{ backgroundColor: "green" }}>0</span>
        </div>
      </div>
      <div class={css.greyContent}>{children}</div>
    </div>
  );
}
