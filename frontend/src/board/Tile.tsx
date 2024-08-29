import "./Tile.scss";
import React, { ReactNode } from "react";

export const directions = [0, 90, 180, 270] as const;
export type Direction = (typeof directions)[number];

export const LTile: Direction[] = [0, 90];
export const TTile: Direction[] = [0, 90, 270];
export const ITile: Direction[] = [90, 270];

export type TileType = "T" | "L" | "I";

export type TileProps = {
  type: TileType;
  rotation: Direction;
  content?: ReactNode | undefined;
};

const Tile = (props: TileProps) => {
  return (
    <div className="tile-container">
      <div className="content">{props.content}</div>
      <div className="tile" style={{ transform: `rotate(${props.rotation}deg)` }}>
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

export const TileMemoized = React.memo(Tile);
