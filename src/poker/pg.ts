import { Table, Card, Player } from ".";

const table = new Table();

table.sitDown("Player 1", 1000);
table.sitDown("Player 2", 1000);
table.sitDown("Player 3", 1000);

table.dealCards();

play();

function play() {
  if (!table.currentActor) return;

  // player 1 (dealer) is first to act.
  // Player 2 and 3 posted blinds.
  table.currentActor.callAction();

  // player 2 is first to act on the flop.
  table.currentActor.checkAction();

  // player 3 decides to open the bet on the flop.
  table.currentActor.betAction(20);

  // player 1 raises.
  table.currentActor.raise(40);

  // player 2 calls.
  table.currentActor.call();

  // player 3 calls player 1's raise.
  table.currentActor.call();

  // betting has been met, player 2 is first to act on the turn and all three decide to check.
  table.currentActor.checkAction();
  table.currentActor.checkAction();
  table.currentActor.checkAction();

  // player 2 is first to act on the river and decides
  // to open the bet at $40.
  table.currentActor.betAction(40);

  // player 3 raises to $60.
  table.currentActor.raiseAction(60);

  // player 1 folds.
  table.currentActor.foldAction();

  // Declare winner(s)!

  console.log(table.winners);
}
