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
import {
  CardValueToName,
  DestinationFrom,
  DestinationTo,
  newGame,
} from "./solitaire";

function useGame() {
  const [gameRef, setGameRef] = useState({
    game: newGame(
      "Js3d0cQs2sQhKs8s0hQc4d4s5c7h3sJc9sKc7c5s8d6d2c2d6sKh3c5d8c6hQd2hKdJh8hJd9h9cAs3hAc5h0d7dAh4h4c0sAd6c7s9d",
    ),
  });

  return {
    game: gameRef.game.game,
    printCard: gameRef.game.printCard,
    move: (
      from: "f0" | "f1" | "f2" | "f3" | "p" | number,
      to: "f" | number,
    ) => {
      let res = gameRef.game.move(from, to);
      if (res) {
        setGameRef({ game: gameRef.game });
        return true;
      }
    },
    openPileCard: () => {
      let res = gameRef.game.openPileCard();
      if (res === true) {
        setGameRef({ game: gameRef.game });
        return true;
      }
    },
    whatPossibleFrom: (from: DestinationFrom) => {
      return gameRef.game.whatPossibleFrom(from);
    },
    newGame: () => {
      return setGameRef({ game: gameRef.game.newGame() });
    },
  };
}

type Destination = "f0" | "f1" | "f2" | "f3" | "p" | number;

export function BacklogPage() {
  let [isOverlayhow, setIsOverlayhow] = useState(false);
  let [opacity, setOpacity] = useState(
    +(sessionStorage.getItem("opacity")! || 100),
  );

  let { openPileCard, newGame, move, whatPossibleFrom, game, printCard } =
    useGame();

  let [possible, setPossible] = useState<{
    from: DestinationFrom | null;
    to: (DestinationTo | "open")[];
  }>({ from: null, to: [] });

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
        {[0, 50, 80, 100].map((val) => {
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
          {/* <p>{JSON.stringify(game.pile)}</p> */}
          <InnerHeader
            finish={game.finish}
            pile={game.pile}
            possible={possible.to}
            onOpenCardClick={() => {
              openPileCard();
              setPossible({ from: null, to: [] });
            }}
            onPileCardClick={() => {
              setPossible({ from: "p", to: whatPossibleFrom("p") });
            }}
            onClick={(to) => {
              move(possible.from!, "f");
              setPossible({ from: null, to: [] });
            }}
          />
          {/* <GrayBox title="Finish desk">
            <div class={css.cards}>
              <Card name="" type="♣" text={"[No club] " + lorem(5, 20)} />
              <Card name="4" type="♥" text={"[4 hearts] " + lorem(5, 20)} />
              <Card name="9" type="♠" text={"[9 spades] " + lorem(5, 20)} />
              <Card name="Q" type="♦" text={"[Q diamonds] " + lorem(5, 20)} />
            </div>
          </GrayBox> */}
          <GrayBox title="Board">
            <p>possible from: {possible.from}</p>
            <p>possible to: {possible.to.join(", ")}</p>
            <div class={css.cards}>
              {[0, 1, 2, 3, 4, 5, 6].map((i) => {
                let card = game.board[i].at(-1);

                let closed = game.board[i].filter((c) => !c.isFaceUp).length;

                let opened = game.board[i]
                  .filter((c) => c.isFaceUp)
                  .map((c) => {
                    return "[" + printCard(c) + "]";
                  })
                  .join(" ");

                let cardsRow = "I".repeat(closed) + " " + opened;

                return (
                  <Card
                    name={card ? CardValueToName[card.value] : "-"}
                    type={card ? card.suit : "-"}
                    text={
                      cardsRow + " "
                      // + lorem(0, 10)
                    }
                    mode={
                      possible.from === i
                        ? "from"
                        : possible.to.includes(i)
                          ? "to"
                          : null
                    }
                    onClick={() => {
                      if (possible.to.includes(i)) {
                        move(possible.from!, i);
                        setPossible({ from: null, to: [] });
                        return;
                      }

                      if (possible.from === i) {
                        setPossible({ from: null, to: [] });
                      } else {
                        setPossible({ from: i, to: whatPossibleFrom(i) });
                      }
                    }}
                  />
                );
              })}
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
  mode,
  onClick,
}: {
  type: string;
  name: string;
  text: string;
  mode: "from" | "to" | null;
  onClick?: () => void;
}) {
  return (
    <div
      class={css.card}
      style={{
        backgroundColor:
          mode === "from" ? "yellow" : mode === "to" ? "green" : "",
      }}
      onClick={() => onClick?.()}
    >
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
