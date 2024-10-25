import { shuffleArray, getRandomInteger, chunkArray } from "../utils";
import { KeyedTileProps, TileProps } from "./tiles/Tile";
import { fixedTiles, movableTiles, Thing, things } from "./tiles/Tiles";
import { directions, Direction, TileTypes } from "./tiles/TileTypes";

const BoardSize = 7;

export type TilesType = readonly KeyedTileProps[][];

export type BoardState = {
  tiles: TilesType;
  playerTile: KeyedTileProps;
};

export type PlayerState = {
  cards: Thing[];
  foundCards: Thing[];
  startPosition: Point;
  currentPosition: Point;
};

export type GameState = {
  board: BoardState;
  players: PlayerState[];
  currentPlayer: number;
  currentAction: "MovePiece" | "MoveTile";
};

export type MoveDirection = "left" | "right" | "up" | "down";

export type Point = { x: number; y: number };

export type Neighbour = { direction: Direction } & Point;

export function moveTiles(board: Readonly<BoardState>, index: number, direction: MoveDirection) {
  return direction === "left" || direction === "right" ? moveRowTilesX(board, index, direction) : moveRowTilesY(board, index, direction);
}

export function setupGame(players: number): GameState {
  const startingPositions: Point[] = [
    { x: 0, y: 0 },
    { x: 0, y: 6 },
    { x: 6, y: 0 },
    { x: 6, y: 6 },
  ];

  const game: GameState = {
    currentPlayer: 0,
    currentAction: "MoveTile",
    board: getRandomBoardTiles(),
    players: dealCards(players).map((cards, i) => ({
      cards: cards,
      currentPosition: startingPositions[i],
      foundCards: [],
      startPosition: startingPositions[i],
    })),
  };

  return game;
}

export function moveCurrentPlayer(gameState: Readonly<GameState>, to: Point): GameState {
  const player = gameState.players[gameState.currentPlayer];
  console.debug(player);
  const reachableTiles = getReachableTiles(gameState.board.tiles, player.currentPosition);
  console.debug(reachableTiles);
  console.debug(to);
  const reachable = to.y * 7 + to.x in reachableTiles;

  const updatedPlayers = gameState.players.map((player, i) => (i === gameState.currentPlayer ? { ...player, currentPosition: to } : player));

  if (reachable) {
    return {
      ...gameState,
      currentAction: "MoveTile",
      currentPlayer: (gameState.currentPlayer + 1) % gameState.players.length,
      players: updatedPlayers,
    };
  }

  throw new Error("uh, thats not a legal move?!");
}

export function moveRowTilesX(board: Readonly<BoardState>, rowIndex: number, direction: "left" | "right"): BoardState {
  const updatedTiles = [...board.tiles];
  const row = board.tiles[rowIndex];
  const updatedRow = [...row];

  if (direction === "right") {
    updatedRow.unshift(board.playerTile);
    const playerTile = updatedRow.pop();
    updatedTiles[rowIndex] = updatedRow;

    return { ...board, playerTile: playerTile!, tiles: updatedTiles };
  } else {
    updatedRow.push(board.playerTile);
    const playerTile = updatedRow.shift();
    updatedTiles[rowIndex] = updatedRow;

    return { ...board, playerTile: playerTile!, tiles: updatedTiles };
  }
}

export function moveRowTilesY(board: Readonly<BoardState>, columnIndex: number, direction: "up" | "down"): BoardState {
  const updatedTiles = board.tiles.map((row) => [...row]);

  if (direction === "down") {
    const lastItem = updatedTiles[updatedTiles.length - 1][columnIndex];

    for (let rowIndex = updatedTiles.length - 1; rowIndex > 0; rowIndex--) {
      updatedTiles[rowIndex][columnIndex] = updatedTiles[rowIndex - 1][columnIndex];
    }

    updatedTiles[0][columnIndex] = board.playerTile;

    return { ...board, tiles: updatedTiles, playerTile: lastItem };
  } else {
    const firstItem = updatedTiles[0][columnIndex];

    for (let rowIndex = 0; rowIndex < updatedTiles.length - 1; rowIndex++) {
      updatedTiles[rowIndex][columnIndex] = updatedTiles[rowIndex + 1][columnIndex];
    }

    updatedTiles[updatedTiles.length - 1][columnIndex] = board.playerTile;

    return { ...board, tiles: updatedTiles, playerTile: firstItem };
  }
}

export function dealCards(players: number): Thing[][] {
  if (things.length % players !== 0) {
    throw new Error("uhhh, players should be an even divisor of thing count");
  }

  return chunkArray(shuffleArray(things), things.length / players);
}

export function getRandomBoardTiles(): BoardState {
  const height = BoardSize;
  const width = BoardSize;

  if (fixedTiles.length + movableTiles.length !== height * width + 1) {
    throw new Error("Board size and tile count doesnt add up :/");
  }

  const shuffledMovableTiles = shuffleArray(movableTiles);

  let id = 0;

  const rows = [...Array(height).keys()].map((rowIndex) =>
    [...Array(width).keys()].map((columnIndex) => {
      // get a fixed tile if one exists for coordinates, or pick one of the random tiles
      const fixedTile = fixedTiles.find((o) => o?.x === columnIndex && o.y === rowIndex);
      if (fixedTile !== undefined) {
        return { ...fixedTile, id: id++ };
      } else {
        const randomTile = shuffledMovableTiles.pop();

        if (randomTile === undefined) {
          throw new Error("uh, i guess something is screwed up with the board dimensions?");
        }

        return { ...randomTile, rotation: directions[getRandomInteger(0, 3)], id: id++ };
      }
    }),
  );

  return { tiles: rows, playerTile: { ...shuffledMovableTiles.pop()!, rotation: 0, id: id++ } };
}

export function rotatePlayerTile(board: BoardState): BoardState {
  return { ...board, playerTile: { ...board.playerTile, rotation: rotateRight(board.playerTile.rotation) } };
}

export function rotateRight(direction: Direction): Direction {
  switch (direction) {
    case 0:
      return 90;
    case 90:
      return 180;
    case 180:
      return 270;
    case 270:
      return 0;
  }
}

export function getRotatedDirections(tile: TileProps) {
  return TileTypes[tile.type].map((o) => (o + tile.rotation) % 360);
}

/**
 * Get neighbour coordinates taking board bounds into consideration
 */
export function getNeighbours(point: Point, height: number, width: number): Neighbour[] {
  const neighbourMatrix: readonly Neighbour[] = [
    { y: -1, x: 0, direction: 0 },
    { y: 0, x: 1, direction: 90 },
    { y: 1, x: 0, direction: 180 },
    { y: 0, x: -1, direction: 270 },
  ];

  return neighbourMatrix
    .map((o) => ({ y: point.y + o.y, x: point.x + o.x, direction: o.direction }))
    .filter((o) => o.x >= 0 && o.x < width && o.y >= 0 && o.y < height);
}

/**
 * Get reachable neighbours from specified tile
 */
export function getReachableNeighbours(tiles: readonly KeyedTileProps[][], from: Point): Point[] {
  const height = tiles.length;
  const width = tiles[0].length;

  const boardWithRotatedTiles = tiles.map((row) => row.map((column) => ({ ...column, openings: getRotatedDirections(column) })));
  const fromTile = boardWithRotatedTiles[from.y][from.x];

  return getNeighbours(from, height, width).filter(
    (n) => fromTile.openings.includes(n.direction) && boardWithRotatedTiles[n.y][n.x].openings.includes((n.direction + 180) % 360),
  );
}

/**
 * Get all tiles reachable from specified tile
 */
export function getReachableTiles(tiles: readonly KeyedTileProps[][], from: Point) {
  const height = tiles.length;
  const width = tiles[0].length;

  const pointToIndex = (point: Point) => point.y * width + point.x;

  const closedSet: Record<number, number | undefined> = {}; // this is not dijkstra or a*, we dont care about distance

  const getReachableTilesRecursive = (tiles: readonly KeyedTileProps[][], from: Point) => {
    for (const currentTile of getReachableNeighbours(tiles, from)) {
      const currentKey = pointToIndex(currentTile);

      if (currentKey in closedSet) {
        continue;
      }

      closedSet[currentKey] = pointToIndex(from);
      getReachableTilesRecursive(tiles, currentTile);
    }
  };

  closedSet[pointToIndex(from)] = undefined;

  getReachableTilesRecursive(tiles, from);

  return closedSet;
}
