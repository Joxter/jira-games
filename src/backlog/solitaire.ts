// Solitaire game

const CardSuits = {
  h: { name: "hearts", char: "♥", n: 0, color: "red" },
  d: { name: "diamonds", char: "♦", n: 1, color: "red" },
  c: { name: "clubs", char: "♣", n: 2, color: "black" },
  s: { name: "spades", char: "♠", n: 3, color: "black" },
} as const;

// move cards:
//   pile -> finish(n)
//   pile -> board(n)
//   finish(n) -> board(n)
//   board(n) -> board(n)
//   board(n) -> finish(n)
// open new card

const CardValueToName = {
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

type Card = {
  suit: keyof typeof CardSuits;
  // todo add color?
  // todo add finish id ??
  value: keyof typeof CardValueToName;
  isFaceUp: boolean;
};

type CardStack = Card[]; // (Card deck)
type Board = [
  CardStack,
  CardStack,
  CardStack,
  CardStack,
  CardStack,
  CardStack,
  CardStack,
];
type Finish = [CardStack, CardStack, CardStack, CardStack];

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

function generateShuffledCards() {
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

  cl(
    cards
      .map((c) => CardValueToName[c.value] + c.suit[0].toLowerCase())
      .join(""),
  );

  return cards;
}

function canPutCard(cardA: Card, cardB: Card) {
  if (
    cardA.value + 1 === cardB.value &&
    CardSuits[cardA.suit].color !== CardSuits[cardB.suit].color
  ) {
    return true;
  }

  return false;
}

function newGame(initCards?: string) {
  GAME = {
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
    : generateShuffledCards();

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
}

function printCard(card?: Card) {
  if (!card || card.value === 0) return `--`;
  return `${CardValueToName[card.value]}${CardSuits[card.suit].char}`;
}

function move(
  from: "f0" | "f1" | "f2" | "f3" | "p" | number,
  to: "f" | number,
) {
  if (from === "p" && to === "f") {
    putPileCardToFinish();
  } else if (from === "p" && isNumber(to)) {
    putPileCardToBoard(to);
  } else if (["f0", "f1", "f2", "f3"].includes(from as any) && isNumber(to)) {
    // @ts-ignore
    let fromId = +from[1];
    moveFinishCardToBoard(fromId, to);
  } else if (isNumber(from) && to === "f") {
    moveBoardCardToFinish(from);
  } else if (isNumber(from) && isNumber(to)) {
    moveBoardCard(from, to);
  } else {
    throw new Error(`Inreachable code`);
  }
}

function moveBoardCard(pileA: number, pileB: number) {
  let targetCard = GAME.board[pileB].at(-1);
  let pileACardVal = targetCard ? targetCard.value - 1 : 13;

  let cardN = GAME.board[pileA].findLastIndex(
    (c) => c.isFaceUp && c.value === pileACardVal,
  );

  if (cardN === -1) {
    cl("No card to move", pileA, pileB);
    return false;
  }

  let toMove = GAME.board[pileA].slice(cardN);
  let topMoveCard = toMove[0];
  let toPile = GAME.board[pileB];

  cl("Move card", printCard(topMoveCard), printCard(toPile.at(-1)));

  if (
    (toPile.length === 0 && topMoveCard.value === 13) ||
    canPutCard(topMoveCard, toPile.at(-1)!)
  ) {
    GAME.board[pileA] = GAME.board[pileA].slice(0, cardN);
    if (GAME.board[pileA].at(-1)) {
      GAME.board[pileA].at(-1)!.isFaceUp = true;
    }
    toPile.push(...toMove);
    return true;
  }

  cl("Can not move", pileA, pileB);
  return false;
}

function canMoveBoardCardToFinish(
  pileId: number,
): { card: Card } | { error: string } {
  let moveCard = GAME.board[pileId].at(-1);
  if (!moveCard) {
    return { error: "No card to move" };
  }

  let finishPile = GAME.finish[CardSuits[moveCard.suit].n];
  let lastFinishCard = finishPile.at(-1)!;

  if (
    lastFinishCard.suit === moveCard.suit &&
    moveCard.value === lastFinishCard.value + 1
  ) {
    return { card: moveCard };
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

  cl(`'Can not move finish card ${finishId} to board'`);
  return false;
}

function openPileCard() {
  if (GAME.pile.length === 0) {
    cl("Empty pile");
    return false;
  }

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

// =============================

function cl(...args: any) {
  console.log(...args);
}

function keys<O extends {}>(obj: O) {
  return Object.keys(obj) as (keyof O)[];
}

function randomWithSeed(seed: number) {
  let value = seed;

  return function rand() {
    value = (value * 16807) % 2147483647;
    return value;
  };
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

// ===========================

newGame(
  "Js3d0cQs2sQhKs8s0hQc4d4s5c7h3sJc9sKc7c5s8d6d2c2d6sKh3c5d8c6hQd2hKdJh8hJd9h9cAs3hAc5h0d7dAh4h4c0sAd6c7s9d",
);
renderGame();

move(4, 3);
move(4, "f");
move(4, 2);
move(4, "f");
move(2, 4);
move(4, 1);
move(0, 2);
openPileCard();
openPileCard();
move("p", "f");
openPileCard();
openPileCard();
move("p", 3);
openPileCard();
openPileCard();
move("p", 3);
openPileCard();
move("p", 0);
openPileCard();
openPileCard();
openPileCard();
openPileCard();
openPileCard();
openPileCard();
openPileCard();
openPileCard();
openPileCard();
openPileCard();
move("p", 2);
openPileCard();
openPileCard();
move("p", 0);
openPileCard();
move("p", "f");
openPileCard();
openPileCard();
openPileCard();
openPileCard();
move("p", 0);
move(3, 0);
move(3, 2);
move(3, "f");
move(5, "f");
move(1, "f");
move(5, 4);
move(1, 2);
move(3, "f");
move("p", 2);
move("p", 5);
move("p", 4);
move(5, 4);
move(1, 5);
move("p", 1);
openPileCard();
openPileCard();
openPileCard();
move("p", 5);
openPileCard();
openPileCard();
openPileCard();
openPileCard();
move("p", "f");
openPileCard();
openPileCard();
move("p", 5);
openPileCard();
move("p", "f");
openPileCard();
move("p", 5);
openPileCard();
openPileCard();
openPileCard();
openPileCard();
openPileCard();
move("p", "f");
move(6, "f");
move(6, 3);
move(6, 5);
move(2, 6);
move(2, "f");
move(5, "f");
move(6, 2);
openPileCard();
openPileCard();
openPileCard();
move("p", 6);
openPileCard();
move("p", 3);
openPileCard();
move(5, 0);
move(5, "f");
openPileCard();
openPileCard();
openPileCard();

renderGame();
