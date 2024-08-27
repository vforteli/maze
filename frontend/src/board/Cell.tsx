import "./Cell.scss";
import React, { ReactNode } from "react";

export const directions = [0, 90, 180, 270] as const;
export type Direction = (typeof directions)[number];

export const LCell: Direction[] = [0, 90];
export const TCell: Direction[] = [0, 90, 270];
export const ICell: Direction[] = [90, 270];

export type CellProps = {
  openings: readonly Direction[];
  rotation: Direction;
  content?: ReactNode | undefined;
};

const Cell = (props: CellProps) => {
  return (
    <div className="cell-container">
      <div className="content">{props.content}</div>
      <div className="cell" style={{ transform: `rotate(${props.rotation}deg)` }}>
        <div />
        {props.openings.includes(0) ? <div className="road" /> : <div />}
        <div />
        {props.openings.includes(270) ? <div className="road" /> : <div />}
        <div className="road" />
        {props.openings.includes(90) ? <div className="road" /> : <div />}
        <div />
        {props.openings.includes(180) ? <div className="road" /> : <div />}
        <div />
      </div>
    </div>
  );
};

export const CellMemoized = React.memo(Cell);
