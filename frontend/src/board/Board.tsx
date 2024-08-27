import "./Board.scss";
import React from "react";
import { CellMemoized, CellProps, directions } from "./Cell";
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

const Board = () => {
  const { cells, playerCell } = getRandomBoardCells();
  console.debug(playerCell);

  return (
    <div className="board-container">
      <div className="tile-test">
        <div style={{ width: 100, margin: 20 }}>
          <CellMemoized {...playerCell} />
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
      <div className="board">
        {cells.map((o, i) => (
          <CellMemoized key={i} {...o} />
        ))}
      </div>
    </div>
  );
};

export const BoardMemoized = React.memo(Board);
