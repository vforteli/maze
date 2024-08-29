import "./Tile.scss";
import React, { ReactNode } from "react";

export const directions = [0, 90, 180, 270] as const;
export type Direction = (typeof directions)[number];

export const LTile: Direction[] = [0, 90];
export const TTile: Direction[] = [0, 90, 270];
export const ITile: Direction[] = [90, 270];
export const XTile: Direction[] = [0, 90, 180, 270];

export type TileType = "T" | "L" | "I" | "X";

export type TileProps = {
  type: TileType;
  rotation: Direction;
  content?: ReactNode | undefined;
};

const Tile = (props: TileProps) => {
  return (
    <div className="tile-container" style={{ transform: `translateX(00px)`, transition: "transform 0.5s ease" }}>
      <div className="content">{props.content}</div>
      <div className="tile" style={{ transform: `rotate(${props.rotation}deg)` }}>
        <TileBackground type={props.type} />
      </div>
    </div>
  );
};

const TileBackground = ({ type }: { type: TileType }) => {
  if (type === "T") {
    return (
      <>
        <div className="top-left" />
        <div className="top-right" />
        <div className="bottom" />
      </>
    );
  } else if (type === "L") {
    return (
      <>
        <div className="l-1" />
        <div className="l-2" />
        <div className="l-3" />
      </>
    );
  } else if (type === "X") {
    return (
      <>
        <div className="top-left" />
        <div className="top-right" />
        <div className="bottom-left" />
        <div className="bottom-right" />
      </>
    );
  } else {
    return (
      <>
        <div className="top" />
        <div className="bottom" />
      </>
    );
  }
};

export const TileMemoized = React.memo(Tile);
