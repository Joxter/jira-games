// Solitaire game

const CardSuits = {
  HEARTS: { name: "hearts", char: "♥", n: 0, color: "red" },
  DIAMONDS: { name: "diamonds", char: "♦", n: 1, color: "red" },
  CLUBS: { name: "clubs", char: "♣", n: 2, color: "black" },
  SPADES: { name: "spades", char: "♠", n: 3, color: "black" },
} as const;

const SuitNtoSuit = {
  h: "HEARTS",
  d: "DIAMONDS",
  c: "CLUBS",
  s: "SPADES",
} as const;

const CardValueToName = {
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
  value: keyof typeof CardValueToName;
  isFaceUp: boolean;
};

type CardStack = Card[]; // (Card deck)

let pile: Card[] = [];

let board: [
  CardStack,
  CardStack,
  CardStack,
  CardStack,
  CardStack,
  CardStack,
  CardStack,
] = [[], [], [], [], [], [], []];

let finish: [CardStack, CardStack, CardStack, CardStack] = [[], [], [], []];

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

function getCardColor(card: Card) {
  return CardSuits[card.suit].color;
}

function canCardFollow(cardA: Card, cardB: Card) {
  if (cardA.value + 1 === cardB.value) {
    if (getCardColor(cardA) !== getCardColor(cardB)) {
      return true;
    }
  }

  return false;
}

function newGame(initCards?: string) {
  const cards = initCards
    ? splitStingBy2(initCards).map((p) => {
        let value = CardNameToValue[p[0]];
        let suit = SuitNtoSuit[p[1] as "h" | "d" | "c" | "s"];

        return { suit, value, isFaceUp: false };
      })
    : generateShuffledCards();

  board = [[], [], [], [], [], [], []];

  for (let i = 0; i < 7; i++) {
    for (let j = 0; j <= i; j++) {
      const card = cards.pop();
      if (card) {
        if (j === i) {
          card.isFaceUp = true;
        }
        board[i].push(card);
      }
    }
  }

  pile = cards;
}

function printCard(card?: Card) {
  if (!card) return `--`;
  return `${CardValueToName[card.value]}${CardSuits[card.suit].char}`;
}

function isNumber(n: any): n is number {
  return typeof n === "number";
}

function move(from: "p" | number, to: "f" | number) {
  if (from === "p" && to === "f") {
    putPileCardToFinish();
  } else if (from === "p" && isNumber(to)) {
    putPileCardToBoard(to);
  } else if (isNumber(from) && to === "f") {
    moveBoardCardToFinish(from);
  } else if (isNumber(from) && isNumber(to)) {
    moveBoardCard(from, to);
  } else {
    throw new Error(`Inreachable move`);
  }
}

function moveBoardCard(pileA: number, pileB: number) {
  let targetCard = board[pileB].at(-1);
  let pileACardVal = targetCard ? targetCard.value - 1 : 13;

  let cardN = board[pileA].findLastIndex(
    (c) => c.isFaceUp && c.value === pileACardVal,
  );

  if (cardN === -1) {
    cl("No card to move", pileA, pileB);
    return false;
  }

  let toMove = board[pileA].slice(cardN);
  let topMoveCard = toMove[0];

  let toPile = board[pileB];
  cl("Move card", printCard(topMoveCard), printCard(toPile.at(-1)));

  if (
    (toPile.length === 0 && topMoveCard.value === 13) ||
    canCardFollow(topMoveCard, toPile.at(-1)!)
  ) {
    board[pileA] = board[pileA].slice(0, cardN);
    if (board[pileA].at(-1)) {
      board[pileA].at(-1)!.isFaceUp = true;
    }
    toPile.push(...toMove);
    return true;
  }

  cl("Can not move", pileA, pileB);
  return false;
}

function moveBoardCardToFinish(pile: number) {
  let moveCard = board[pile].at(-1);

  if (!moveCard) {
    cl("No card to move (no)", pile);
    return false;
  }

  let finishPile = finish[CardSuits[moveCard.suit].n];

  if (finishPile.length === 0) {
    if (moveCard.value === 1) {
      board[pile].pop();
      finishPile.push(moveCard);

      let newLast = board[pile].at(-1);
      if (newLast && newLast.isFaceUp === false) {
        newLast.isFaceUp = true;
      }

      return true;
    } else {
      cl("Can not move (not Ace)", moveCard);
      return false;
    }
  }

  let lastFinishCard = finishPile.at(-1)!;

  if (
    lastFinishCard.suit === moveCard.suit &&
    lastFinishCard.value + 1 === moveCard.value
  ) {
    board[pile].pop();
    finishPile.push(moveCard);

    let newLast = board[pile].at(-1);
    if (newLast && newLast.isFaceUp === false) {
      newLast.isFaceUp = true;
    }

    return true;
  }

  cl("Can not move (no match)", printCard(moveCard), printCard(lastFinishCard));
  return false;
}

function openPileCard() {
  if (pile.length === 0) {
    cl("Empty pile");
    return false;
  }

  let lastClose = -1;
  for (let i = pile.length - 1; i >= 0; i--) {
    if (!pile[i].isFaceUp) {
      lastClose = i;
      break;
    }
  }

  if (lastClose > -1) {
    pile[lastClose].isFaceUp = true;
    return;
  }

  pile.forEach((card) => {
    card.isFaceUp = false;
  });
  pile.at(-1)!.isFaceUp = true;
}

function putPileCardToBoard(toPile: number) {
  let topOpenPileCardId = pile.findIndex((c) => c.isFaceUp);

  if (topOpenPileCardId === -1) {
    cl("No open pile card");
    return false;
  }

  let topOpenPileCard = pile[topOpenPileCardId];

  let toPileCards = board[toPile];

  if (toPileCards.length === 0) {
    if (topOpenPileCard.value === 13) {
      pile.splice(topOpenPileCardId, 1);
      toPileCards.push(topOpenPileCard);
      return true;
    }

    cl(`Can not put ${printCard(topOpenPileCard)} to empty pile`);
    return false;
  }

  let lastToPileCard = toPileCards.at(-1);

  if (canCardFollow(topOpenPileCard, lastToPileCard!)) {
    pile.splice(topOpenPileCardId, 1);
    toPileCards.push(topOpenPileCard);
    return true;
  }

  cl(
    `Can not put ${printCard(topOpenPileCard)} to ${printCard(lastToPileCard!)}`,
  );
}

function putPileCardToFinish() {
  let topOpenPileCardId = pile.findIndex((c) => c.isFaceUp);

  if (topOpenPileCardId === -1) {
    cl("No open pile card");
    return false;
  }

  let topOpenPileCard = pile[topOpenPileCardId];

  let finishPile = finish[CardSuits[topOpenPileCard.suit].n];

  if (finishPile.length === 0) {
    if (topOpenPileCard.value === 1) {
      pile.splice(topOpenPileCardId, 1);
      finishPile.push(topOpenPileCard);
      return true;
    }

    cl(`Can not put ${printCard(topOpenPileCard)} to empty pile`);
    return false;
  }

  let lastFinishCard = finishPile.at(-1);

  if (
    lastFinishCard &&
    lastFinishCard.suit === topOpenPileCard.suit &&
    lastFinishCard.value + 1 === topOpenPileCard.value
  ) {
    pile.splice(topOpenPileCardId, 1);
    finishPile.push(topOpenPileCard);
    return true;
  }

  cl(
    `Can not put ${printCard(topOpenPileCard)} to ${printCard(lastFinishCard)}`,
  );
}

function renderGame() {
  let closedPile = pile.filter((c) => !c.isFaceUp).length;
  let openPile = pile.length - closedPile;
  let lastOpenCard = pile.find((c) => c.isFaceUp);

  let f0 = printCard(finish[0].at(-1));
  let f1 = printCard(finish[1].at(-1));
  let f2 = printCard(finish[2].at(-1));
  let f3 = printCard(finish[3].at(-1));

  cl(
    closedPile,
    printCard(lastOpenCard),
    openPile,
    " " + [f0, f1, f2, f3].join(" "),
  );

  renderBoard();

  cl("");
}

function renderBoard() {
  cl(" 0  1  2  3  4  5  6");

  for (let i = 0; i < 100; i++) {
    let row = "";

    for (let j = 0; j < 7; j++) {
      let card = board[j][i];
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
