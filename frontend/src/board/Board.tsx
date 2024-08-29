import "./Board.scss";
import React, { useState } from "react";
import { TileMemoized } from "./Tile";
import { getRandomBoardTiles, MoveDirection, moveTiles, rotatePlayerTile } from "./BoardUtils";

export type BoardProps = unknown;

const Board = () => {
  const [boardState, setBoardState] = useState(getRandomBoardTiles());

  const handleMoveTiles = (index: number, direction: MoveDirection) => {
    const updatedBoard = moveTiles(boardState, index, direction);
    setBoardState(updatedBoard);
  };

  const handleRotatePlayerTile = () => {
    setBoardState((s) => rotatePlayerTile(s));
  };

  function FrameTile(props: { onClick: () => void }) {
    return (
      <div className="player-tile movable" onClick={props.onClick}>
        <TileMemoized {...boardState.playerTile} rotation={boardState.playerTile.rotation} />
      </div>
    );
  }

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
          {[...Array(boardState.tiles.length).keys()].map((i) => (i % 2 !== 0 ? <FrameTile onClick={() => handleMoveTiles(i, "right")} /> : <div />))}
        </div>
        <div className="frame-side right">
          {[...Array(boardState.tiles.length).keys()].map((i) => (i % 2 !== 0 ? <FrameTile onClick={() => handleMoveTiles(i, "left")} /> : <div />))}
        </div>
        <div className="frame-side top">
          {[...Array(boardState.tiles.length).keys()].map((i) => (i % 2 !== 0 ? <FrameTile onClick={() => handleMoveTiles(i, "down")} /> : <div />))}
        </div>
        <div className="frame-side bottom">
          {[...Array(boardState.tiles.length).keys()].map((i) => (i % 2 !== 0 ? <FrameTile onClick={() => handleMoveTiles(i, "up")} /> : <div />))}
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
