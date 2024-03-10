import { useEffect, useState } from "preact/hooks";
import css from "./BacklogPage.module.css";
import overlay from "./image.png";
import { Left } from "../story/Left";
import { Header } from "../story/Header";
import user from "../assets/icons/ic-users-info.svg";
import { Header as InnerHeader } from "./Header";
import { ComponentChildren } from "preact";
import { ChevronIcon } from "../ui/ChevronIcon";
import { CartRound } from "./CartRound";
import { cn, lorem, random } from "../unit";

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
          {/* <GrayBox title="Finish desk">
            <div class={css.cards}>
              <Card name="" type="♣" text={"[No club] " + lorem(5, 20)} />
              <Card name="4" type="♥" text={"[4 hearts] " + lorem(5, 20)} />
              <Card name="9" type="♠" text={"[9 spades] " + lorem(5, 20)} />
              <Card name="Q" type="♦" text={"[Q diamonds] " + lorem(5, 20)} />
            </div>
          </GrayBox> */}
          <GrayBox title="Board">
            <div class={css.cards}>
              <Card name="3" type="♣" text={"I " + lorem(random(10, 20))} />
              <Card name="A" type="♥" text={"II " + lorem(random(10, 20))} />
              <Card name="9" type="♦" text={"III " + lorem(random(10, 20))} />
              <Card name="Q" type="♠" text={"IIII " + lorem(random(10, 20))} />
              <Card
                name="3"
                type="♣"
                text={"IIIII " + lorem(random(10, 20))}
              />
              <Card
                name="A"
                type="♠"
                text={"IIIIII " + lorem(random(10, 20))}
              />
              <Card
                name="9"
                type="♥"
                text={"IIIIIII " + lorem(random(10, 20))}
              />
            </div>
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

function Card({
  type,
  name,
  text,
}: {
  type: string;
  name: string;
  text: string;
}) {
  return (
    <div class={css.card}>
      <div class={css.cardIcon}>
        <CartRound type={type} name={name} />
      </div>
      <p class={css.cardCode}>SCRU-{random(10, 5000)}</p>
      <p class={cn(css.cardText, "textOverflow")}>{text}</p>
      <p class={cn(css.cardLabel, "textOverflow")}>ready to development</p>
      <img class={css.cardPerson} src={user} alt="" />
    </div>
  );
}
