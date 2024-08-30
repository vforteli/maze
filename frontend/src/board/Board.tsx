import "./Board.scss";
import React, { useCallback, useState } from "react";
import { TileMemoized, TileProps } from "./Tile";
import { BoardState, getRandomBoardTiles, MoveDirection, moveTiles, rotatePlayerTile } from "./BoardUtils";

const EdgeTile = (props: { playerTile: TileProps; onClick: () => void }) => (
  <div className="player-tile movable" onClick={props.onClick}>
    <TileMemoized {...props.playerTile} />
  </div>
);

const Edge = ({
  direction,
  boardState,
  onClick,
  className,
}: {
  className: string;
  direction: MoveDirection;
  boardState: BoardState;
  onClick: (i: number) => void;
}) => {
  const count = direction === "down" || direction === "up" ? boardState.tiles.length : boardState.tiles[0].length;

  return (
    <div className={className}>
      {[...Array(count).keys()].map((i) =>
        i % 2 !== 0 ? <EdgeTile key={i} playerTile={boardState.playerTile} onClick={() => onClick(i)} /> : <div key={i} />,
      )}
    </div>
  );
};

const Board = () => {
  const [boardState, setBoardState] = useState(getRandomBoardTiles());

  const handleMoveTiles = useCallback((index: number, direction: MoveDirection) => {
    setBoardState((b) => moveTiles(b, index, direction));
  }, []);

  const handleRotatePlayerTile = () => {
    setBoardState((s) => rotatePlayerTile(s));
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
        <Edge className="frame-side left" direction="right" boardState={boardState} onClick={(i) => handleMoveTiles(i, "right")} />
        <Edge className="frame-side right" direction="left" boardState={boardState} onClick={(i) => handleMoveTiles(i, "left")} />
        <Edge className="frame-side top" direction="down" boardState={boardState} onClick={(i) => handleMoveTiles(i, "down")} />
        <Edge className="frame-side bottom" direction="up" boardState={boardState} onClick={(i) => handleMoveTiles(i, "up")} />

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
