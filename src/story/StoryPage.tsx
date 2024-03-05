import { useEffect, useState } from "preact/hooks";
import css from "./StoryPage.module.css";
import overlay from "./overlay-img.png";

export function StoryPage() {
  let [isOverlayhow, setIsOverlayhow] = useState(false);
  let [opacity, setOpacity] = useState(
    +(sessionStorage.getItem("opacity")! || 100),
  );

  useEffect(() => {
    // toggle isOverlayhow on press "Q" ion the keyboard

    const onKeyDown = (e: KeyboardEvent) => {
      console.log(e.key);
      if (e.key === "q") {
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
        onClick={() => {
          setIsOverlayhow(!isOverlayhow);
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
        <div class={css.header}>header</div>
        <div class={css.left}>
          {Array(100)
            .fill(0)
            .map((_, i) => {
              return <p>{i}, 123</p>;
            })}
        </div>
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
          {Array(100)
            .fill(0)
            .map((_, i) => {
              return <p>{i}, 123</p>;
            })}
        </div>
      </div>
    </>
  );
}
