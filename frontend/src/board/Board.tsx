import "./Board.scss";
import React from "react";
import { CellMemoized, directions } from "./Cell";
import { getRandomInteger, shuffleArray } from "../utils";
import { fixedCells, movableCells } from "./Cells";

export type BoardProps = unknown;

const Board = () => {
  const randomCells = shuffleArray(movableCells);

  return (
    <div className="board">
      {fixedCells.map((o, i) => {
        return o !== undefined ? (
          <CellMemoized key={i} {...o} />
        ) : (
          <CellMemoized key={i} {...randomCells.pop()!} rotation={directions[getRandomInteger(0, 3)]} />
        );
      })}
    </div>
  );
};

export const BoardMemoized = React.memo(Board);
