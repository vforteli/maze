import "./Board.scss";
import React, { useMemo, useState } from "react";
import { TileMemoized, TileProps, Direction, directions } from "./Tile";
import { getRandomInteger, shuffleArray } from "../utils";
import { fixedTiles, movableTiles } from "./Tiles";

export type BoardState = {
  tiles: readonly TileProps[][];
  playerTile: TileProps;
};

export type BoardProps = unknown;
const BoardSize = 7;

function getRandomBoardTiles(): BoardState {
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

const Board = () => {
  const { tiles, playerTile } = useMemo(() => getRandomBoardTiles(), []);
  const [playerTileDirection, setPlayerTileDirection] = useState<Direction>(0);

  return (
    <div className="board-container">
      <div className="tile-test">
        <div style={{ width: 100, margin: 20 }}>
          <div onClick={() => setPlayerTileDirection(rotateRight(playerTileDirection))}>
            <TileMemoized {...playerTile} rotation={playerTileDirection} />
          </div>
        </div>
        <div style={{ width: 100, margin: 20 }}>
          <TileMemoized type="T" rotation={0} />
        </div>
        <div style={{ width: 100, margin: 20 }}>
          <TileMemoized type="L" rotation={0} />
        </div>
        <div style={{ width: 100, margin: 20 }}>
          <TileMemoized type="I" rotation={0} />
        </div>
      </div>
      <div className="board-frame">
        <div className="board">
          {tiles
            .flatMap((o) => o)
            .map((o, i) => (
              <TileMemoized key={i} {...o} />
            ))}
        </div>
      </div>
    </div>
  );
};

export const BoardMemoized = React.memo(Board);
