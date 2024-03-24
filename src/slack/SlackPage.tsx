import { useEffect, useState } from "preact/hooks";
import css from "./SlackPage.module.css";
import overlay from "./image.png";
import { Left } from "./Left";
import { Chat } from "./Chat";

type Moves = [];

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

// function useGame() {
//   let [initState, setInitState] = useState<string | null>(null);
//   let [moves, setMoves] = useState<Moves>([]);

//   const [gameRef, setGameRef] = useState({ game: newGame() });

//   useEffect(() => {
//     let loaded = loadFromLS();
//     if (loaded) {
//       let [initCards, moves] = loaded;
//       setInitState(initCards);
//       setMoves(moves);
//       let game = newGame(initCards);
//       moves.forEach((move) => {
//         if (move === "openPile") {
//           game.openPileCard();
//         } else {
//           game.move(move[0], move[1]);
//         }
//       });
//       setGameRef({ game });
//     }
//   }, []);

//   return {
//     inided: !!initState,
//     newGame: () => {
//       let newCards = generateShuffledCards()[0];
//       setInitState(newCards);
//       setMoves([]);
//       setGameRef({ game: newGame(newCards) });
//       saveToLS(newCards, []);
//     },
//     resetGame: () => {
//       if (initState) {
//         setGameRef({ game: newGame(initState) });
//         setMoves([]);
//         saveToLS(initState, []);
//       }
//     },
//     game: gameRef.game.game,
//     printCard: gameRef.game.printCard,
//     move: (
//       from: "f0" | "f1" | "f2" | "f3" | "p" | number,
//       to: "f" | number,
//     ) => {
//       let res = gameRef.game.move(from, to);
//       if (res) {
//         let newMoves = [...moves, [from, to]] as Moves;
//         setMoves(newMoves);
//         saveToLS(initState!, newMoves);
//         setGameRef({ game: gameRef.game });
//         return true;
//       }
//     },
//     openPileCard: () => {
//       let res = gameRef.game.openPileCard();
//       if (res === true) {
//         let newMoves = [...moves, "openPile"] as Moves;
//         setMoves(newMoves);
//         saveToLS(initState!, newMoves);
//         setGameRef({ game: gameRef.game });
//         return true;
//       }
//     },
//     whatPossibleFrom: (from: DestinationFrom) => {
//       return gameRef.game.whatPossibleFrom(from);
//     },
//   };
// }

export function SlackPage() {
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
        <div class={css.content}>
          <Left />
          <Chat />
        </div>
      </div>
    </>
  );
}
