import css from "./Header.module.css";
import search from "../assets/icons/ic-actions-search.svg";
import icon1 from "../assets/icons/ic-social-behance.svg";
import icon2 from "../assets/icons/ic-places-carousel.svg";
import icon3 from "../assets/icons/ic-mobile-full-wifi.svg";
import { ChevronIcon } from "../ui/ChevronIcon";

export function Header() {
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
          <div
            style={{
              backgroundColor: "#eff0f0",
            }}
          >
            <img src={icon3} alt="" />
          </div>
        </div>
      </div>
      <div class={css.row3}>
        <div class={css.fakeSearch}>
          <img src={search} alt="" />
        </div>
        <Pile />
        {["Version", "Epic", "Label"].map((text) => {
          return (
            <p class={css.fakeAction}>
              {text}
              <ChevronIcon size={18} />
            </p>
          );
        })}
      </div>
    </div>
  );
}

function Pile() {
  // clubs (♣), diamonds (♦), hearts (♥) and spades (♠)
  // types: ['c', 'd', 'h', 's'],
  return (
    <div class={css.pile}>
      {["3♣", "A♥", "9♠", "Q♦", "2♣", "K♠"].slice(3).map((card, i) => {
        return (
          <button
            class={"resetButton"}
            style={{ backgroundColor: i % 2 ? "red" : "black" }}
          >
            {card}
          </button>
        );
      })}
      <button
        class={"resetButton"}
        style={{ backgroundColor: "#999", borderColor: "gray" }}
      >
        +1
      </button>
    </div>
  );
}
