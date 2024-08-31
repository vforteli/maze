import { shuffleArray, getRandomInteger } from "../utils";
import { KeyedTileProps } from "./tiles/Tile";
import { fixedTiles, movableTiles } from "./tiles/Tiles";
import { directions, Direction } from "./tiles/TileTypes";

const BoardSize = 7;

export type BoardState = {
  tiles: readonly KeyedTileProps[][];
  playerTile: KeyedTileProps;
};

export type MoveDirection = "left" | "right" | "up" | "down";

export function moveTiles(board: Readonly<BoardState>, index: number, direction: MoveDirection) {
  return direction === "left" || direction === "right" ? moveRowTilesX(board, index, direction) : moveRowTilesY(board, index, direction);
}

function moveRowTilesX(board: Readonly<BoardState>, rowIndex: number, direction: "left" | "right"): BoardState {
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

function moveRowTilesY(board: Readonly<BoardState>, columnIndex: number, direction: "up" | "down"): BoardState {
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

function rotateRight(direction: Direction): Direction {
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
