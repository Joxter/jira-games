// Solitaire game

export const CardSuits = {
  h: { name: "hearts", char: "♥", emptyChar: "♡", n: 0, color: "red" },
  d: { name: "diamonds", char: "♦", emptyChar: "♢", n: 1, color: "red" },
  c: { name: "clubs", char: "♣", emptyChar: "♧", n: 2, color: "black" },
  s: { name: "spades", char: "♠", emptyChar: "♤", n: 3, color: "black" },
} as const;
// U+2660 ♠ BLACK SPADE SUIT
// U+2661 ♡ WHITE HEART SUIT
// U+2662 ♢ WHITE DIAMOND SUIT
// U+2663 ♣ BLACK CLUB SUIT
// U+2664 ♤ WHITE SPADE SUIT
// U+2665 ♥ BLACK HEART SUIT
// U+2666 ♦ BLACK DIAMOND SUIT
// U+2667 ♧ WHITE CLUB SUIT
export const CardValueToName = {
  0: "-",
  1: "A",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  10: "0",
  11: "J",
  12: "Q",
  13: "K",
};

const CardNameToValue = Object.fromEntries(
  Object.entries(CardValueToName).map(([k, v]) => [
    v,
    +k as keyof typeof CardValueToName,
  ]),
);

export type Card = {
  suit: keyof typeof CardSuits;
  // todo add color?
  // todo add finish id ??
  // todo add name ??
  value: keyof typeof CardValueToName;
  isFaceUp: boolean;
};

export type CardStack = Card[]; // (Card deck)
type Board = [
  CardStack,
  CardStack,
  CardStack,
  CardStack,
  CardStack,
  CardStack,
  CardStack,
];
export type Finish = [CardStack, CardStack, CardStack, CardStack];

export type DestinationFrom = "f0" | "f1" | "f2" | "f3" | "p" | number;
export type DestinationTo = "f" | "f0" | "f1" | "f2" | "f3" | number;

export function generateShuffledCards(): [string, CardStack] {
  const cards: CardStack = [];
  for (const suit of keys(CardSuits)) {
    for (let i = 1; i <= 13; i++) {
      cards.push({ suit, value: i as any, isFaceUp: false });
    }
  }

  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  let initState = cards
    .map((c) => CardValueToName[c.value] + c.suit[0].toLowerCase())
    .join("");

  return [initState, cards] as const;
}

function canPutCard(cardA: Card, cardB: Card) {
  console.log(cardA, cardB);
  if (
    cardA.value + 1 === cardB.value &&
    cardA.value !== 1 &&
    CardSuits[cardA.suit].color !== CardSuits[cardB.suit].color
  ) {
    return true;
  }

  return false;
}

export function newGame(initCards?: string) {
  let GAME = {
    pile: [] as Card[],
    board: [[], [], [], [], [], [], []] as Board,
    finish: [
      [{ suit: "h", value: 0, isFaceUp: false }],
      [{ suit: "d", value: 0, isFaceUp: false }],
      [{ suit: "c", value: 0, isFaceUp: false }],
      [{ suit: "s", value: 0, isFaceUp: false }],
    ] as Finish,
  };

  const cards = initCards
    ? splitStingBy2(initCards).map((p) => {
        let value = CardNameToValue[p[0]];
        let suit = p[1] as "h" | "d" | "c" | "s";

        return { suit, value, isFaceUp: false };
      })
    : generateShuffledCards()[1];

  GAME.board = [[], [], [], [], [], [], []];

  for (let i = 0; i < 7; i++) {
    for (let j = 0; j <= i; j++) {
      const card = cards.pop();
      if (card) {
        if (j === i) {
          card.isFaceUp = true;
        }
        GAME.board[i].push(card);
      }
    }
  }

  GAME.finish = [
    [{ suit: "h", value: 0, isFaceUp: false }],
    [{ suit: "d", value: 0, isFaceUp: false }],
    [{ suit: "c", value: 0, isFaceUp: false }],
    [{ suit: "s", value: 0, isFaceUp: false }],
  ];

  GAME.pile = cards;

  return {
    game: GAME,
    move,
    newGame,
    renderGame,
    printCard,
    openPileCard,
    whatPossibleFrom,
  };

  function whatPossibleFrom(from: DestinationFrom): (DestinationTo | "open")[] {
    // move cards:
    //   pile -> finish(n)
    //   pile -> board(n)               +
    //   finish(n) -> board(n)
    //   board(row, card) -> board(n)
    //   board(row, card) -> finish(n)
    // open new card                    +

    let res: (DestinationTo | "open")[] = [];

    if (isNumber(from)) {
      // board "from" is col
      let can = canMoveBoardCardToFinish(from);

      if ("card" in can) {
        res.push(("f" + can.finishId) as "f0" | "f1" | "f2" | "f3");
      }

      for (let i = 0; i <= 6; i++) {
        if (i === from) continue;
        let can = canMoveBoardCard(from, i);
        if ("card" in can) {
          res.push(i);
        }
      }
    } else if (from === "p") {
      let can = canOpenPileCard();
      if (can === true) {
        res.push("open");
        for (let i = 0; i <= 6; i++) {
          let can = canPutPileCardToBoard(i);
          if ("card" in can) {
            res.push(i);
          }
        }
      }

      for (let i = 0; i <= 3; i++) {
        let can = canPutPileCardToFinish(i);
        if ("card" in can) {
          res.push(("f" + i) as "f0" | "f1" | "f2" | "f3");
        }
      }
    } else {
      throw new Error(`TODO`);
    }

    return res;
  }

  function move(from: DestinationFrom, to: DestinationTo): boolean | undefined {
    if (from === "p" && to === "f") {
      return putPileCardToFinish();
    } else if (from === "p" && isNumber(to)) {
      return putPileCardToBoard(to);
    } else if (["f0", "f1", "f2", "f3"].includes(from as any) && isNumber(to)) {
      // @ts-ignore
      let fromId = +from[1];
      return moveFinishCardToBoard(fromId, to);
    } else if (isNumber(from) && to === "f") {
      return moveBoardCardToFinish(from);
    } else if (isNumber(from) && isNumber(to)) {
      return moveBoardCard(from, to);
    } else {
      throw new Error(`Inreachable code`);
    }
  }

  function canMoveBoardCard(
    pileA: number,
    pileB: number,
  ): { error: string } | { card: Card } {
    let targetCard = GAME.board[pileB].at(-1);
    let pileACardVal = targetCard ? targetCard.value - 1 : 13;

    let cardN = GAME.board[pileA].findLastIndex(
      (c) => c.isFaceUp && c.value === pileACardVal,
    );

    if (cardN === -1) {
      return { error: "No card to move" };
    }

    let toMove = GAME.board[pileA].slice(cardN);
    let topMoveCard = toMove[0];
    let toPile = GAME.board[pileB];

    if (
      (toPile.length === 0 && topMoveCard.value === 13) ||
      canPutCard(topMoveCard, toPile.at(-1)!)
    ) {
      return { card: topMoveCard };
    }

    return { error: "Can not move" };
  }

  function moveBoardCard(pileA: number, pileB: number) {
    let res = canMoveBoardCard(pileA, pileB);

    if ("card" in res) {
      let cardN = GAME.board[pileA].lastIndexOf(res.card);
      let toMove = GAME.board[pileA].slice(cardN);

      GAME.board[pileA] = GAME.board[pileA].slice(0, cardN);
      if (GAME.board[pileA].at(-1)) {
        GAME.board[pileA].at(-1)!.isFaceUp = true;
      }
      GAME.board[pileB].push(...toMove);
      return true;
    }

    return false;
  }

  function canMoveBoardCardToFinish(
    pileId: number,
  ): { card: Card; finishId: number } | { error: string } {
    let moveCard = GAME.board[pileId].at(-1);
    if (!moveCard) {
      return { error: "No card to move" };
    }

    let finishId = CardSuits[moveCard.suit].n;
    let finishPile = GAME.finish[CardSuits[moveCard.suit].n];
    let lastFinishCard = finishPile.at(-1)!;

    if (
      lastFinishCard.suit === moveCard.suit &&
      moveCard.value === lastFinishCard.value + 1
    ) {
      return { card: moveCard, finishId };
    }

    return { error: "Can't move to finish" };
  }

  function moveBoardCardToFinish(pile: number) {
    let can = canMoveBoardCardToFinish(pile);

    if ("card" in can) {
      GAME.board[pile].pop();
      GAME.finish[CardSuits[can.card.suit].n].push(can.card);

      let newLast = GAME.board[pile].at(-1);
      if (newLast && !newLast.isFaceUp) {
        newLast.isFaceUp = true;
      }
      return true;
    } else {
      cl("Can't move to finish", pile);
    }
  }

  function moveFinishCardToBoard(finishId: number, pileId?: number) {
    let finishPile = GAME.finish[finishId];
    let finishCard = finishPile.at(-1);
    if (!finishCard) {
      cl("No card to move");
      return false;
    }

    if (pileId === undefined) {
      throw new Error(`TODO`);
    } else {
      let toPile = GAME.board[pileId];
      if (
        (toPile.length === 0 && finishCard.value === 13) ||
        (toPile.length > 0 && canPutCard(finishCard, toPile.at(-1)!))
      ) {
        finishPile.pop();
        toPile.push(finishCard);
        return true;
      }
    }

    cl(`Can not move finish card ${finishId} to board`);
    return false;
  }

  function canOpenPileCard(): { error: string } | true {
    if (GAME.pile.length === 0) {
      return { error: "Empty pile" };
    }

    return true;
  }

  function openPileCard() {
    let res = canOpenPileCard();
    if (res !== true) return res;

    let lastClose = -1;
    for (let i = GAME.pile.length - 1; i >= 0; i--) {
      if (!GAME.pile[i].isFaceUp) {
        lastClose = i;
        break;
      }
    }

    if (lastClose === -1) {
      GAME.pile.forEach((card) => (card.isFaceUp = false));
    } else {
      GAME.pile[lastClose].isFaceUp = true;
    }
    return true;
  }

  function getTopOpenPileCard() {
    return GAME.pile.find((c) => c.isFaceUp);
  }

  function canPutPileCardToBoard(
    toPile: number,
  ): { card: Card } | { error: string } {
    let topOpenPileCard = getTopOpenPileCard();
    if (!topOpenPileCard) {
      return { error: "No open pile card" };
    }

    let lastToPileCard = GAME.board[toPile].at(-1);

    if (
      (!lastToPileCard && topOpenPileCard.value === 13) ||
      (lastToPileCard && canPutCard(topOpenPileCard, lastToPileCard))
    ) {
      return { card: topOpenPileCard };
    }

    return {
      error: `Can not put ${printCard(topOpenPileCard)} to ${printCard(lastToPileCard!)}`,
    };
  }

  function putPileCardToBoard(toPile: number) {
    let can = canPutPileCardToBoard(toPile);

    if ("card" in can) {
      removeItem(GAME.pile, can.card);
      GAME.board[toPile].push(can.card);
      return true;
    } else {
      cl(can.error);
    }
  }

  function canPutPileCardToFinish(
    finishId: number,
  ): { card: Card } | { error: string } {
    let moveCard = getTopOpenPileCard();
    if (!moveCard) {
      return { error: "No open pile card" };
    }

    let finishPileCard = GAME.finish[finishId].at(-1)!;
    if (
      finishPileCard.suit !== moveCard.suit ||
      moveCard.value != finishPileCard.value + 1
    ) {
      return { error: `Can not put ${printCard(moveCard)} to the finish` };
    }

    return { card: moveCard };
  }

  function putPileCardToFinish() {
    let finishIds = [0, 1, 2, 3];

    for (let id of finishIds) {
      let can = canPutPileCardToFinish(id);
      if ("card" in can) {
        removeItem(GAME.pile, can.card);
        GAME.finish[id].push(can.card);
        return true;
      }
    }

    cl(`Can not put pile to the finish`);
  }

  function renderGame() {
    let closedPile = GAME.pile.filter((c) => !c.isFaceUp).length;
    let openPile = GAME.pile.length - closedPile;
    let lastOpenCard = getTopOpenPileCard();

    let f0 = printCard(GAME.finish[0].at(-1));
    let f1 = printCard(GAME.finish[1].at(-1));
    let f2 = printCard(GAME.finish[2].at(-1));
    let f3 = printCard(GAME.finish[3].at(-1));

    cl(
      closedPile,
      printCard(lastOpenCard),
      openPile,
      " " + [f0, f1, f2, f3].join(" "),
    );

    renderBoard();

    cl("");

    function renderBoard() {
      cl(" 0  1  2  3  4  5  6");

      for (let i = 0; i < 100; i++) {
        let row = "";

        for (let j = 0; j < 7; j++) {
          let card = GAME.board[j][i];
          if (card) {
            row += card.isFaceUp ? `${printCard(card)} ` : "XX ";
          } else {
            row += "   ";
          }
        }
        if (row.trim() === "") break;
        cl(row);
      }
    }
  }
}

export function printCard(card?: Card) {
  if (!card || card.value === 0) return `--`;
  return `${CardValueToName[card.value]}${CardSuits[card.suit].char}`;
}

// =============================

function cl(...args: any) {
  console.log(...args);
}

function keys<O extends {}>(obj: O) {
  return Object.keys(obj) as (keyof O)[];
}

function splitStingBy2(str: string) {
  return str.match(/.{1,2}/g)!;
}

function isNumber(n: any): n is number {
  return typeof n === "number";
}

function removeItem<T>(arr: T[], it: T): void {
  let i = arr.indexOf(it);
  if (i !== -1) {
    arr.splice(i, 1);
  }
}
