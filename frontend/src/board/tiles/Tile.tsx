import "./Tile.scss";
import React, { ReactNode } from "react";
import { TileType, Direction } from "./TileTypes";

export type TileKey = number;

export type TileProps = {
  type: TileType;
  rotation: Direction;
  content?: ReactNode | undefined;
  onClick?: () => void;
  player?: number;
};

export type KeyedTileProps = TileProps & {
  id: TileKey;
};

const Tile: React.FC<TileProps> = (props) => (
  <div className="tile-container" onClick={props.onClick}>
    <div className="content">
      {props.player}
      {props.content}
    </div>
    <div className="tile" style={{ transform: `rotate(${props.rotation}deg)` }}>
      <TileBackground type={props.type} />
    </div>
  </div>
);

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
