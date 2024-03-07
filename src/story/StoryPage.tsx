import { useEffect, useState } from "preact/hooks";
import css from "./StoryPage.module.css";
import overlay from "./overlay-img.png";
import overlay2 from "./overlay-img-2.png";
import { Header } from "./Header";
import { Right } from "./Right";
import { Left } from "./Left";
import { Center } from "./Center";

export function StoryPage() {
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
          src={overlay2}
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
          <Center />
        </div>
        <div class={css.right}>
          <Right />
        </div>
      </div>
    </>
  );
}
