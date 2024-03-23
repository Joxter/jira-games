import { Table, Card, Player } from ".";

const table = new Table();

table.sitDown("Player 1", 1000);
table.sitDown("Player 2", 1000);
table.sitDown("Player 3", 1000);

table.dealCards();

play();

function play() {
  if (!table.currentActor) return;

  table.currentActor.raiseAction(20);
  table.currentActor.callAction();
  table.currentActor.callAction();
  // table.currentActor.callAction();
  console.log(table.communityCards.map((c) => c.rank + c.suitChar));
  table.currentActor.betAction(30);
  table.currentActor.callAction();
  table.currentActor.callAction();
  console.log(table.communityCards.map((c) => c.rank + c.suitChar));
  table.currentActor.betAction(50);
  table.currentActor.callAction();
  table.currentActor.callAction();
  table.currentActor.checkAction();
  table.currentActor.checkAction();
  table.currentActor.checkAction();
  table.currentActor.checkAction();

  console.log(table.communityCards.map((c) => c.rank + c.suitChar));

  console.log(table.currentActor.legalActions(), table.currentActor.id);
  console.log(table.winners);
}
