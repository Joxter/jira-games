import { PropsWithChildren, useEffect, useState } from "react";
import css from "./BacklogPage.module.css";
import overlay from "./image.png";
import { Left } from "../story/Left";
import { Header } from "../story/Header";
import user from "../assets/icons/ic-users-info.svg";
import { Header as InnerHeader } from "./Header";
import { ChevronIcon } from "../ui/ChevronIcon";
import { CartRound } from "./CartRound";
import { cn, lorem, random } from "../unit";
import {
  CardValueToName,
  DestinationFrom,
  DestinationTo,
  newGame,
  generateShuffledCards,
} from "./solitaire";
import { InlineCard } from "../ui/InlineCard";

function saveToLS(initCards: string, moves: Moves) {
  try {
    localStorage.setItem("cards", initCards);
    localStorage.setItem("moves", JSON.stringify(moves));
  } catch (e) {
    console.error(e);
  }
}

function loadFromLS(): [string, Moves] | undefined {
  let initCards = localStorage.getItem("cards");
  let moves = localStorage.getItem("moves");

  if (initCards && moves) {
    return [initCards, JSON.parse(moves)] as const;
  }
}

type Moves = Array<
  | "openPile"
  | [from: "f0" | "f1" | "f2" | "f3" | "p" | number, to: "f" | number]
>;

function useGame() {
  let [initState, setInitState] = useState<string | null>(null);
  let [moves, setMoves] = useState<Moves>([]);

  const [gameRef, setGameRef] = useState({ game: newGame() });

  useEffect(() => {
    let loaded = loadFromLS();
    if (loaded) {
      let [initCards, moves] = loaded;
      setInitState(initCards);
      setMoves(moves);
      let game = newGame(initCards);
      moves.forEach((move) => {
        if (move === "openPile") {
          game.openPileCard();
        } else {
          game.move(move[0], move[1]);
        }
      });
      setGameRef({ game });
    }
  }, []);

  return {
    inided: !!initState,
    newGame: () => {
      let newCards = generateShuffledCards()[0];
      setInitState(newCards);
      setMoves([]);
      setGameRef({ game: newGame(newCards) });
      saveToLS(newCards, []);
    },
    resetGame: () => {
      if (initState) {
        setGameRef({ game: newGame(initState) });
        setMoves([]);
        saveToLS(initState, []);
      }
    },
    game: gameRef.game.game,
    printCard: gameRef.game.printCard,
    move: (
      from: "f0" | "f1" | "f2" | "f3" | "p" | number,
      to: "f" | number,
    ) => {
      let res = gameRef.game.move(from, to);
      if (res) {
        let newMoves = [...moves, [from, to]] as Moves;
        setMoves(newMoves);
        saveToLS(initState!, newMoves);
        setGameRef({ game: gameRef.game });
        return true;
      }
    },
    openPileCard: () => {
      let res = gameRef.game.openPileCard();
      if (res === true) {
        let newMoves = [...moves, "openPile"] as Moves;
        setMoves(newMoves);
        saveToLS(initState!, newMoves);
        setGameRef({ game: gameRef.game });
        return true;
      }
    },
    whatPossibleFrom: (from: DestinationFrom) => {
      return gameRef.game.whatPossibleFrom(from);
    },
  };
}

export function BacklogPage() {
  let [isOverlayhow, setIsOverlayhow] = useState(false);
  let [opacity, setOpacity] = useState(
    +(sessionStorage.getItem("opacity")! || 100),
  );

  let {
    inided,
    openPileCard,
    resetGame,
    newGame,
    move,
    whatPossibleFrom,
    game,
    printCard,
  } = useGame();

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
          <GrayBox title="Board">
            <p>
              <button
                onClick={() => {
                  newGame();
                  setPossible({ from: null, to: [] });
                }}
              >
                new game
              </button>
              <button
                onClick={() => {
                  resetGame();
                  setPossible({ from: null, to: [] });
                }}
              >
                reset game
              </button>
            </p>
            {inided && (
              <div class={css.cards}>
                {[0, 1, 2, 3, 4, 5, 6].map((i) => {
                  let card = game.board[i].at(-1);

                  let closed = game.board[i].filter((c) => !c.isFaceUp).length;

                  return (
                    <Pile
                      name={card ? CardValueToName[card.value] : "-"}
                      type={card ? card.suit : "-"}
                      text={
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <span style={{ display: "inline-flex", gap: "8px" }}>
                            {Array(closed)
                              .fill(0)
                              .map(() => lorem(1))}
                          </span>
                          <span
                            style={{
                              display: "inline-flex",
                              gap: "2px",
                            }}
                          >
                            {game.board[i]
                              .filter((c) => c.isFaceUp)
                              .reverse()
                              .map((c) => {
                                return (
                                  <InlineCard rank={c.value} suit={c.suit} />
                                );
                              })}
                          </span>
                        </div>
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
            )}
          </GrayBox>
        </div>
      </div>
    </>
  );
}

function GrayBox({
  children,
  title,
}: PropsWithChildren<{
  title: string;
}>) {
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

function Pile({
  type,
  name,
  text,
  mode,
  onClick,
}: {
  type: string;
  name: string;
  text: any;
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
