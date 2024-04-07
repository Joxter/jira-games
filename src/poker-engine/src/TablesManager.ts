import { Table } from "./Table";

let MAX_TABLES = 10;
let STATUS: "ok" | "closing_down" | "idle" = "idle";

type ErrorString = string;

type TableParams = {
  buyIn: number;
  smallBlind: number;
  bigBlind: number;
};

export class TableManager {
  // todo
}

class Game {
  private tableRef: Table;

  constructor(params: TableParams) {
    this.tableRef = new Table(params.buyIn, params.smallBlind, params.bigBlind);
  }

  hasFreeChair(): boolean {
    return this.tableRef.hasFreeChair();
  }

  sitDown(playerId: string, buyIn: number): number | ErrorString {
    try {
      return this.tableRef.sitDown(playerId, buyIn);
    } catch (err: any) {
      console.error(err);
      if ("message" in err) {
        return err.message;
      }
      return "Unknown error";
    }
  }

  leaveTable(id: string): true | ErrorString {
    try {
      this.tableRef.standUp(id);
      this.tableRef.cleanUp();
      return true;
    } catch (err: any) {
      console.error(err);
      if ("message" in err) {
        return err.message;
      }
      return "Unknown error";
    }
  }

  onHandFinished(): any {
    console.log("onHandFinished");
  }
}

type TableInnter = {
  id: string;
  status: "idle" | "handing" | "last_game";
  params: TableParams;
  game: Game;
};

let tables: Map<string, TableInnter> = new Map();
let playersConnections: Map<string, { connection: any; table: string }> =
  new Map(); // WS connection

export function setMaxTables(n: number) {
  if (n < 0) n = 0;
  if (n > 100_000) n = 100_000;
  MAX_TABLES = Math.floor(n);
}

export function setGameStatus(status: "ok" | "closing_down" | "idle") {
  STATUS = status;
}

export function newTable(params?: TableParams): TableInnter {
  return {
    id: Math.random().toString(36).slice(2),
    status: "idle",
    params: params || { smallBlind: 10, bigBlind: 20, buyIn: 1000 },
    game: {} as Game, // todo
  };
}

export function initTables() {
  while (tables.size < MAX_TABLES) {
    let table = newTable();

    if (!tables.has(table.id)) {
      tables.set(table.id, table);
    }
  }
}

export function sitDownPlayer(
  player: { id: string; connection: any },
  params: TableParams,
): true | ErrorString {
  if (STATUS !== "ok") return "Game is not available";

  for (let [id, table] of tables) {
    if (
      table.params.smallBlind === params.smallBlind &&
      table.params.bigBlind === params.bigBlind &&
      table.params.buyIn === params.buyIn &&
      table.game.hasFreeChair()
    ) {
      table.game.sitDown(player.id, params.buyIn);
      playersConnections.set(player.id, {
        connection: player.connection,
        table: id,
      });

      return true;
    }
  }

  return "No tables available";
}

export function leaveTheTable(playerId: string): true | ErrorString {
  const playerData = playersConnections.get(playerId);

  if (playerData) {
    let { table, connection } = playerData;

    let t = tables.get(table);
    if (t) {
      t.game.leaveTable(playerId);
      playersConnections.delete(playerId);
      console.log("close", connection);
      return true;
    }

    return "Table not found";
  }

  return "Player not found";
}
