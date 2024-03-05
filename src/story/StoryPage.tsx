import { useState } from "preact/hooks";
import css from "./StoryPage.module.css";
import overlay from "./overlay-img.png";

export function StoryPage() {
  let [isOverlayhow, setIsOverlayhow] = useState(false);
  let [opacity, setOpacity] = useState(sessionStorage.getItem("opacity")!);

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
      <button
        style={{
          position: "fixed",
          zIndex: 1,
          bottom: "5px",
        }}
        onClick={() => {
          setIsOverlayhow(!isOverlayhow);
        }}
      >
        overlay
      </button>
      <div
        style={{
          position: "fixed",
          bottom: "30px",
          zIndex: 1,
          background: "#fff",
          display: "flex",
          gap: "12px",
          padding: "8px 12px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      >
        {[10, 25, 50, 80].map((val) => {
          return (
            <label>
              <input
                type="radio"
                name="opacity"
                onClick={() => {
                  setOpacity(String(val));
                  sessionStorage.setItem("opacity", String(val));
                }}
              />
              {val}
            </label>
          );
        })}
      </div>
      <div class={css.root}>
        <div class={css.header}>header</div>
        <div class={css.left}>left</div>
        <div class={css.content}>
          <h1>Stpry page</h1>
          {Array(100)
            .fill(0)
            .map((_, i) => {
              return <p>{i}, 123</p>;
            })}
        </div>
        <div class={css.right}>
          <h2>ready for development</h2>
          <div class={css.rightBox}>datails</div>
        </div>
      </div>
    </>
  );
}
