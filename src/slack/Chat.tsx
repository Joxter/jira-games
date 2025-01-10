import { useEffect, useRef, useState } from "react";
import css from "./Chat.module.css";
import { Table } from "../poker-engine/src";

/*

в самом начале до 3х карт:
-  check/fold check call-any
-  fold call call-any

-  fold call60k call-any

*/

const actions = ["bet", "check", "call", "raise", "fold"] as const;

type Logs = Actions[];
type ActionNames = (typeof actions)[number];

type Actions =
  | { name: "call"; player: string }
  | { name: "check"; player: string }
  | { name: "fold"; player: string }
  | { name: "bet"; amount: number; player: string }
  | { name: "raise"; amount: number; player: string };

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
  let [rnd, setRnd] = useState<number[]>(
    JSON.parse(
      "[0.43817784602132126,0.5155886113977348,0.8858232954629099,0.12829435743054718,0.10095433313061586,0.21097084996982596,0.8830357527007402,0.4134431381751906,0.8185523036655592,0.24903641882851313,0.5503515802334537,0.4365122289759017,0.5957788204281331,0.18167490419738297,0.571050471780283,0.9789982790093836,0.8567612680077986,0.0520187513590854,0.6384258973460928,0.37139296295738833,0.8827091087403621,0.5046429521903101,0.927423068002698,0.6421612607758935,0.3079921415709743,0.5700157729211037,0.9149944133451987,0.7337071757884066,0.028885542259911023,0.41376926540746506,0.9114281293072545,0.20170008231298342,0.5895031518467407,0.6004739753767374,0.14028779236105005,0.4643172382839468,0.0380416452831982,0.1509940229967912,0.6343907289530871,0.3127469159772073,0.9185778501615486,0.014408037396538176,0.589754896421184,0.9569260688687137,0.7618821957896313,0.1254078227020886,0.5337400170391712,0.2254313532028066,0.4017622688530087,0.904151487651008,0.1841087239458823,0.8651312962665844]",
    ),
  );

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000");

    socket.onopen = () => {
      console.log("WebSocket Client Connected");
    };
    socket.onclose = () => {
      console.log("WebSocket Client Closed");
    };
    socket.onerror = (error) => {
      console.log("WebSocket error: " + error);
    };
    let i = 0;

    setInterval(() => {
      i++;
      socket.send("Hello " + i);
    }, 2000);

    // Listen for messages
    socket.addEventListener("message", (event) => {
      console.log("Message from server ", event.data);
    });

    const table = new Table();

    tableRef.current = table;

    table.sitDown("Player-1", 1000);
    table.sitDown("Player-2", 1000);
    table.sitDown("Player-3", 1000);

    let rnd: number[] = JSON.parse(
      "[0.43817784602132126,0.5155886113977348,0.8858232954629099,0.12829435743054718,0.10095433313061586,0.21097084996982596,0.8830357527007402,0.4134431381751906,0.8185523036655592,0.24903641882851313,0.5503515802334537,0.4365122289759017,0.5957788204281331,0.18167490419738297,0.571050471780283,0.9789982790093836,0.8567612680077986,0.0520187513590854,0.6384258973460928,0.37139296295738833,0.8827091087403621,0.5046429521903101,0.927423068002698,0.6421612607758935,0.3079921415709743,0.5700157729211037,0.9149944133451987,0.7337071757884066,0.028885542259911023,0.41376926540746506,0.9114281293072545,0.20170008231298342,0.5895031518467407,0.6004739753767374,0.14028779236105005,0.4643172382839468,0.0380416452831982,0.1509940229967912,0.6343907289530871,0.3127469159772073,0.9185778501615486,0.014408037396538176,0.589754896421184,0.9569260688687137,0.7618821957896313,0.1254078227020886,0.5337400170391712,0.2254313532028066,0.4017622688530087,0.904151487651008,0.1841087239458823,0.8651312962665844]",
    );
    table.dealCards(rnd);
    setLogs([]);
    setRnd(rnd.map((n) => (n * 12354) % 1));
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
    getBank: () => {
      return tableRef.current.currentPot.amount;
    },
    getPlayersBet: () => {
      return tableRef.current.actingPlayers.map((p) => p.bet);
    },
    getWinners: () => {
      return tableRef.current.winners?.map((p) => p.id) || [];
    },
    getSeats: () => {
      return tableRef.current.players.map((p, i) => {
        return {
          chair: i,
          name: p ? p.id : null,
          money: p ? p.stackSize : null,
          bet: p ? p.bet : null,
        };
      });
    },
    dealCards: () => {
      tableRef.current.dealCards(rnd);
      setLogs([]);
      setRnd(rnd.map((n) => (n * 12354) % 1));
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
      let player = tableRef.current.currentActor!.id;
      if (name === "fold") {
        tableRef.current.currentActor!.foldAction();
        setLogs((logs) => [...logs, { name, player }]);
      } else if (name === "check") {
        tableRef.current.currentActor!.checkAction();
        setLogs((logs) => [...logs, { name, player }]);
      } else if (name === "call") {
        tableRef.current.currentActor!.callAction();
        setLogs((logs) => [...logs, { name, player }]);
      }
    },
    actRaise: (amount: number) => {
      let player = tableRef.current.currentActor!.id;
      tableRef.current.currentActor!.raiseAction(amount);
      setLogs((logs) => [...logs, { name: "raise", amount, player }]);
    },
    actBet: (amount: number) => {
      let player = tableRef.current.currentActor!.id;
      tableRef.current.currentActor!.betAction(amount);
      setLogs((logs) => [...logs, { name: "bet", amount, player }]);
    },
    getCurrentBet: () => {
      return tableRef.current.currentBet;
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

      <div style={{ display: "flex", gap: "8px" }}>
        <h3>logs:</h3>
        {g.getLogs().map((log) => {
          if (log.name === "bet" || log.name === "raise") {
            return (
              <p>
                {log.name + " " + log.amount} {log.player}
              </p>
            );
          }
          return (
            <p>
              {log.name}[{log.player}]
            </p>
          );
        })}
      </div>
      <p>
        {g.getTableCards()}[{g.getBank()}] bet: {g.getCurrentBet()}
      </p>
      <div>
        seats:{" "}
        {g.getSeats().map((p, i) => {
          if (p.name) {
            return (
              <p
                style={{
                  fontWeight: g.getCurrentPlayerId() === p.name ? "600" : "400",
                }}
              >
                [{p.chair}, {p.name} {p.bet !== null ? <b>{p.bet}</b> : ""}]
                money {p.money}
              </p>
            );
          }

          return <p>[{p.chair} empty]</p>;
        })}
      </div>
      <p>bets: [{g.getPlayersBet().join(", ")}]</p>
      <br />
      <p>
        player: {g.getCurrentPlayerId()}[
        {g.getCurrentPlayerCards().slice(0, 2).join(", ")}] + [
        {g.getCurrentPlayerCards().slice(2).join(", ")}]
      </p>
      <p>actions: </p>
      <div>
        {actions.map((act) => {
          let isOn = g.getActions().includes(act);
          let st = {
            opacity: isOn ? "1" : "0.5",
            pointerEvents: isOn ? "" : "none",
          };

          let amount = (g.getCurrentBet() || 0) + 20;

          if (act === "raise") {
            return (
              <button style={st} onClick={() => g.actRaise(amount)}>
                {act} {amount}
              </button>
            );
          }
          if (act === "bet") {
            return (
              <button style={st} onClick={() => g.actBet(amount)}>
                {act} {amount}
              </button>
            );
          }
          return (
            <button style={st} onClick={() => g.act(act)}>
              {act}
            </button>
          );
        })}
      </div>
      <div>winners: {g.getWinners()}</div>
      <div>
        <button onClick={() => g.dealCards()}>Deal cards</button>
      </div>
    </div>
  );
}
