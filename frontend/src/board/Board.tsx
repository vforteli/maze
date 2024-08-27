import "./Board.scss";
import React, { useMemo, useState } from "react";
import { CellMemoized, CellProps, Direction, directions } from "./Cell";
import { getRandomInteger, shuffleArray } from "../utils";
import { fixedCells, movableCells } from "./Cells";

export type BoardProps = unknown;

function getRandomBoardCells(): { cells: CellProps[]; playerCell: CellProps } {
  const randomCells = shuffleArray(movableCells);

  const cells = fixedCells.map((o) => {
    if (o !== undefined) {
      return o;
    } else {
      const randomCell = randomCells.pop();

      if (randomCell === undefined) {
        throw new Error("uh, i guess something is screwed up with the board dimensions?");
      }

      return { ...randomCell, rotation: directions[getRandomInteger(0, 3)] };
    }
  });

  return { cells: cells, playerCell: { ...randomCells.pop()!, rotation: 0 } };
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
  const { cells, playerCell } = useMemo(() => getRandomBoardCells(), []);
  const [playerCellDirection, setPlayerCellDirection] = useState<Direction>(0);

  return (
    <div className="board-container">
      <div className="tile-test">
        <div style={{ width: 100, margin: 20 }}>
          <div onClick={() => setPlayerCellDirection(rotateRight(playerCellDirection))}>
            <CellMemoized {...playerCell} rotation={playerCellDirection} />
          </div>
        </div>
        <div style={{ width: 100, margin: 20 }}>
          <CellMemoized type="T" rotation={0} />
        </div>
        <div style={{ width: 100, margin: 20 }}>
          <CellMemoized type="L" rotation={0} />
        </div>
        <div style={{ width: 100, margin: 20 }}>
          <CellMemoized type="I" rotation={0} />
        </div>
      </div>
      <div className="board-frame">
        <div className="board">
          {cells.map((o, i) => (
            <CellMemoized key={i} {...o} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const BoardMemoized = React.memo(Board);
