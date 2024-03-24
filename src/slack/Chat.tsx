import { useEffect, useRef, useState } from "preact/hooks";
import { ChevronIcon } from "../ui/ChevronIcon";
import css from "./Chat.module.css";
import { ComponentChildren } from "preact";
import { Table } from "../poker-engine/src";

// play();

type Logs = Actions[];

type ActionNames = "bet" | "call" | "check" | "fold" | "raise";

type Actions =
  | { name: "call" }
  | { name: "check" }
  | { name: "fold" }
  | { name: "bet"; amount: number }
  | { name: "raise"; amount: number };

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

function suitToSuitChar(s: string) {
  switch (s) {
    case "h":
    case "hearts":
      return "♥";
    case "d":
    case "diamonds":
      return "♦";
    case "c":
    case "clubs":
      return "♣";
    case "s":
    case "spades":
      return "♠";
  }
}

function useGame() {
  let tableRef = useRef(new Table());
  let [logs, setLogs] = useState<Logs>([]);

  useEffect(() => {
    const table = new Table();

    tableRef.current = table;

    table.sitDown("Player 1", 1000);
    table.sitDown("Player 2", 1000);
    table.sitDown("Player 3", 1000);

    let rnd = JSON.parse(
      "[0.43817784602132126,0.5155886113977348,0.8858232954629099,0.12829435743054718,0.10095433313061586,0.21097084996982596,0.8830357527007402,0.4134431381751906,0.8185523036655592,0.24903641882851313,0.5503515802334537,0.4365122289759017,0.5957788204281331,0.18167490419738297,0.571050471780283,0.9789982790093836,0.8567612680077986,0.0520187513590854,0.6384258973460928,0.37139296295738833,0.8827091087403621,0.5046429521903101,0.927423068002698,0.6421612607758935,0.3079921415709743,0.5700157729211037,0.9149944133451987,0.7337071757884066,0.028885542259911023,0.41376926540746506,0.9114281293072545,0.20170008231298342,0.5895031518467407,0.6004739753767374,0.14028779236105005,0.4643172382839468,0.0380416452831982,0.1509940229967912,0.6343907289530871,0.3127469159772073,0.9185778501615486,0.014408037396538176,0.589754896421184,0.9569260688687137,0.7618821957896313,0.1254078227020886,0.5337400170391712,0.2254313532028066,0.4017622688530087,0.904151487651008,0.1841087239458823,0.8651312962665844]",
    );
    table.dealCards(rnd);
    setLogs([]);
  }, []);

  return {
    getLogs: () => logs,
    getDeck: () =>
      tableRef.current.deck.map((card) => `${card.rank}${card.suitChar}`),
    getTableCards: () => {
      // console.log(tableRef.current.communityCards);
      return tableRef.current.communityCards.map(
        (c) => `${c.rank}${suitToSuitChar(c.suit)}`,
      );
    },
    getActions: () => {
      return tableRef.current.currentActor?.legalActions() || [];
    },
    getCurrentPlayerId: () => {
      return tableRef.current.currentActor?.id || null;
    },
    getCurrentPlayerCards: (): string[] => {
      // console.log(tableRef.current.currentActor?.hand);
      return (
        tableRef.current.currentActor?.hand.cards.map(
          (c: any) => `${c.value}${suitToSuitChar(c.suit)}`,
        ) || []
      );
    },
    act: (name: "call" | "check" | "fold") => {
      if (name === "fold") {
        tableRef.current.currentActor!.foldAction();
        setLogs((logs) => [...logs, { name }]);
      } else if (name === "check") {
        tableRef.current.currentActor!.checkAction();
        setLogs((logs) => [...logs, { name }]);
      } else if (name === "call") {
        tableRef.current.currentActor!.callAction();
        setLogs((logs) => [...logs, { name }]);
      }
    },
    actRaise: (amount: number) => {
      tableRef.current.currentActor!.raiseAction(amount);
      setLogs((logs) => [...logs, { name: "raise", amount }]);
    },
    actBet: (amount: number) => {
      tableRef.current.currentActor!.betAction(amount);
      setLogs((logs) => [...logs, { name: "bet", amount }]);
    },
  };
}

export function Chat() {
  // console.log(table.deck.map((card) => `${card.rank}${card.suit}`));

  const g = useGame();

  // console.log(g.getCurrentPlayerCards());

  return (
    <div class={css.root}>
      <h1></h1>
      <p>Deck: {g.getDeck().join(" ")}</p>

      <div>
        <h3>logs:</h3>
        {g.getLogs().map((log) => {
          if (log.name === "bet" || log.name === "raise") {
            return <p>{log.name + " " + log.amount}</p>;
          }
          return <p>{log.name}</p>;
        })}
      </div>
      {g.getTableCards()}
      <br />
      <p>
        player: {g.getCurrentPlayerId()}[
        {g.getCurrentPlayerCards().slice(0, 2).join(", ")}] + [
        {g.getCurrentPlayerCards().slice(2).join(", ")}]
      </p>
      <p>actions: </p>
      <div>
        {g.getActions().map((act) => {
          if (act === "raise") {
            return <button onClick={() => g.actRaise(20)}>{act}</button>;
          }
          if (act === "bet") {
            return <button onClick={() => g.actBet(20)}>{act}</button>;
          }
          return <button onClick={() => g.act(act)}>{act}</button>;
        })}
      </div>
    </div>
  );
}
