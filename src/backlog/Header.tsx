import css from "./Header.module.css";
import search from "../assets/icons/ic-actions-search.svg";
import icon1 from "../assets/icons/ic-social-behance.svg";
import icon2 from "../assets/icons/ic-places-carousel.svg";
import icon3 from "../assets/icons/ic-mobile-full-wifi.svg";
import { DestinationTo, Finish, CardSuits, Card, printCard } from "./solitaire";

export function Header({
  finish,
  pile,
  possible,
  onClick,
  onOpenCardClick,
  onPileCardClick,
}: {
  finish: Finish;
  pile: Card[];
  possible: (DestinationTo | "open")[];
  onClick: (to: "f0" | "f1" | "f2" | "f3") => void;
  onOpenCardClick: () => void;
  onPileCardClick: () => void;
}) {
  return (
    <div class={css.root}>
      <p class={css.breadCrumbs}>Projects / Giftcards / Giftcard boards</p>
      <div class={css.row2}>
        <h1>Backlog</h1>
        <div class={css.row2actions}>
          <div>
            <img src={icon1} alt="" />
          </div>
          <div>
            <img src={icon2} alt="" />
          </div>
          <div style={{ backgroundColor: "#eff0f0" }}>
            <img src={icon3} alt="" />
          </div>
        </div>
      </div>
      <div class={css.row3}>
        <div class={css.fakeSearch}>
          <img src={search} alt="" />
        </div>
        <div class={css.pile}>
          {pile
            .filter((c) => c.isFaceUp)
            .slice(0, 3)
            .reverse()
            .map((card) => {
              return (
                <button
                  class={"resetButton"}
                  style={{
                    backgroundColor:
                      CardSuits[card.suit].color === "red"
                        ? "#AE2E24"
                        : "#172B4D",
                  }}
                  onClick={() => {
                    onPileCardClick();
                  }}
                >
                  {printCard(card)}
                </button>
              );
            })}
          <button
            class={"resetButton"}
            style={{ backgroundColor: "#999", borderColor: "gray" }}
            onClick={() => {
              onOpenCardClick();
            }}
          >
            +1
          </button>
        </div>
        {finish.map((stack, i) => {
          let last = stack.at(-1)!;
          let isPossible = possible.includes(("f" + i) as any);

          let suit = CardSuits[last.suit];

          return (
            <p
              class={css.fakeAction}
              style={{
                backgroundColor: isPossible ? "green" : "",
                color: suit.color,
              }}
              onClick={() => {
                if (isPossible) {
                  onClick(("f" + i) as any);
                }
              }}
            >
              {last ? printCard(last)[0] : "-"} {suit.char}
            </p>
          );
        })}
      </div>
    </div>
  );
}
