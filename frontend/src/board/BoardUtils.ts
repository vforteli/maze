import { shuffleArray, getRandomInteger } from "../utils";
import { TileProps, directions, Direction } from "./Tile";
import { fixedTiles, movableTiles } from "./Tiles";

const BoardSize = 7;

export type BoardState = {
  tiles: readonly TileProps[][];
  playerTile: TileProps;
};

export function moveRowTiles(board: BoardState, rowIndex: number, direction: "left" | "right"): BoardState {
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

export function getRandomBoardTiles(): BoardState {
  const height = BoardSize;
  const width = BoardSize;

  if (fixedTiles.length + movableTiles.length !== height * width + 1) {
    throw new Error("Board size and tile count doesnt add up :/");
  }

  const shuffledMovableTiles = shuffleArray(movableTiles);

  const rows = [...Array(height).keys()].map((rowIndex) =>
    [...Array(width).keys()].map((columnIndex) => {
      // get a fixed tile if one exists for coordinates, or pick one of the random tiles
      const fixedTile = fixedTiles.find((o) => o?.x === columnIndex && o.y === rowIndex);
      if (fixedTile !== undefined) {
        return fixedTile;
      } else {
        const randomTile = shuffledMovableTiles.pop();

        if (randomTile === undefined) {
          throw new Error("uh, i guess something is screwed up with the board dimensions?");
        }

        return { ...randomTile, rotation: directions[getRandomInteger(0, 3)] };
      }
    }),
  );

  return { tiles: rows, playerTile: { ...shuffledMovableTiles.pop()!, rotation: 0 } };
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
