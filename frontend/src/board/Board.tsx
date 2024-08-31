import "./Board.scss";
import React, { useCallback, useState } from "react";
import { KeyedTileProps, TileMemoized } from "./tiles/Tile";
import { BoardState, getRandomBoardTiles, MoveDirection, moveTiles, rotatePlayerTile } from "./boardUtils";
import { CardMemoized } from "./cards/Card";

const EdgeTile = (props: { playerTile: KeyedTileProps; onClick: () => void }) => (
  <div className="player-tile movable" onClick={props.onClick}>
    <TileMemoized {...props.playerTile} key={props.playerTile.id} />
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
      <div style={{ width: 100, margin: 20 }}>
        <div className="player-tile" onClick={() => handleRotatePlayerTile()}>
          <TileMemoized {...boardState.playerTile} key={boardState.playerTile.id} />
        </div>
      </div>

      <div className="card-stack">
        <CardMemoized item="bunny" />
        <CardMemoized item="cow" />
        <CardMemoized item="trex" />
      </div>

      <div className="board-frame">
        <Edge className="frame-side left" direction="right" boardState={boardState} onClick={(i) => handleMoveTiles(i, "right")} />
        <Edge className="frame-side right" direction="left" boardState={boardState} onClick={(i) => handleMoveTiles(i, "left")} />
        <Edge className="frame-side top" direction="down" boardState={boardState} onClick={(i) => handleMoveTiles(i, "down")} />
        <Edge className="frame-side bottom" direction="up" boardState={boardState} onClick={(i) => handleMoveTiles(i, "up")} />
        <div className="board">
          {boardState.tiles.flatMap((o, rowIndex) => o.map((o, columnIndex) => <TileMemoized key={`${columnIndex}_${rowIndex}`} {...o} />))}
        </div>
      </div>
    </div>
  );
};

export const BoardMemoized = React.memo(Board);
