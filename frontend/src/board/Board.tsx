import "./Board.scss";
import React, { useState } from "react";
import { TileMemoized } from "./Tile";
import { getRandomBoardTiles, MoveDirection, moveTiles, rotatePlayerTile } from "./BoardUtils";

export type BoardProps = unknown;

const Board = () => {
  const [boardState, setBoardState] = useState(getRandomBoardTiles());

  const handleMoveTiles = (direction: MoveDirection) => {
    const updatedBoard = moveTiles(boardState, 1, direction);
    setBoardState(updatedBoard);
  };

  const handleRotatePlayerTile = () => {
    setBoardState((s) => rotatePlayerTile(s));
  };

  return (
    <div className="board-container">
      <button onClick={() => handleMoveTiles("left")}>Move row left</button>
      <button onClick={() => handleMoveTiles("right")}>Move row right</button>
      <button onClick={() => handleMoveTiles("up")}>Move column up</button>
      <button onClick={() => handleMoveTiles("down")}>Move column down</button>

      <div className="tile-test">
        <div style={{ width: 100, margin: 20 }}>
          <div className="player-tile" onClick={() => handleRotatePlayerTile()}>
            <TileMemoized {...boardState.playerTile} rotation={boardState.playerTile.rotation} />
          </div>
        </div>
        <div style={{ width: 100, margin: 20 }}>
          <TileMemoized type="T" rotation={0} />
        </div>
        <div style={{ width: 100, margin: 20 }}>
          <TileMemoized type="L" rotation={0} />
        </div>
        <div style={{ width: 100, margin: 20 }}>
          <TileMemoized type="I" rotation={0} />
        </div>
      </div>
      <div className="board-frame">
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
