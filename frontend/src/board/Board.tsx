import "./Board.scss";
import React, { useState } from "react";
import { TileMemoized } from "./Tile";
import { getRandomBoardTiles, MoveDirection, moveTiles, rotatePlayerTile } from "./BoardUtils";

export type BoardProps = unknown;

const Board = () => {
  const [boardState, setBoardState] = useState(getRandomBoardTiles());

  const handleMoveTiles = (index: number, direction: MoveDirection) => {
    setBoardState(moveTiles(boardState, index, direction));
  };

  const handleRotatePlayerTile = () => {
    setBoardState((s) => rotatePlayerTile(s));
  };

  const FrameTile = (props: { onClick: () => void }) => {
    return (
      <div className="player-tile movable" onClick={props.onClick}>
        <TileMemoized {...boardState.playerTile} rotation={boardState.playerTile.rotation} />
      </div>
    );
  };

  const Edge = ({ direction }: { direction: MoveDirection }) => {
    const count = direction === "down" || direction === "up" ? boardState.tiles.length : boardState.tiles[0].length;
    return [...Array(count).keys()].map((i) => (i % 2 !== 0 ? <FrameTile onClick={() => handleMoveTiles(i, direction)} /> : <div />));
  };

  return (
    <div className="board-container">
      <div className="tile-test">
        <div style={{ width: 100, margin: 20 }}>
          <div className="player-tile" onClick={() => handleRotatePlayerTile()}>
            <TileMemoized {...boardState.playerTile} rotation={boardState.playerTile.rotation} />
          </div>
        </div>
      </div>
      <div className="board-frame">
        <div className="frame-side left">
          <Edge direction="right" />
        </div>
        <div className="frame-side right">
          <Edge direction="left" />
        </div>
        <div className="frame-side top">
          <Edge direction="down" />
        </div>
        <div className="frame-side bottom">
          <Edge direction="up" />
        </div>
        <div className="board">
          {boardState.tiles
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
