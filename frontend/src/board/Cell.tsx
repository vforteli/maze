import "./Cell.scss";
import React, { ReactNode } from "react";

export const directions = [0, 90, 180, 270] as const;
export type Direction = (typeof directions)[number];

export const LCell: Direction[] = [0, 90];
export const TCell: Direction[] = [0, 90, 270];
export const ICell: Direction[] = [90, 270];

export type CellType = "T" | "L" | "I";

export type CellProps = {
  type: CellType;
  rotation: Direction;
  content?: ReactNode | undefined;
};

const Cell = (props: CellProps) => {
  return (
    <div className="cell-container">
      <div className="content">{props.content}</div>
      <div className="cell" style={{ transform: `rotate(${props.rotation}deg)` }}>
        {props.type === "T" && (
          <>
            <div className="top-left" />
            <div className="top-right" />
            <div className="bottom" />
          </>
        )}
        {props.type === "L" && (
          <>
            <div className="l-1" />
            <div className="l-2" />
            <div className="l-3" />
          </>
        )}
        {props.type === "I" && (
          <>
            <div className="top" />
            <div className="bottom" />
          </>
        )}
      </div>
    </div>
  );
};

export const CellMemoized = React.memo(Cell);
