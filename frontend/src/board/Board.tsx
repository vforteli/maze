import "./Board.scss";
import React, { useRef, useState } from "react";
import { TileMemoized } from "./tiles/Tile";
import { BoardState, getReachableTiles, MoveDirection, moveTiles, Point, rotatePlayerTile, setupGame } from "./boardUtils";
import { CardStackMemoized } from "./cards/CardStack";
import { MovableTile } from "./tiles/MovableTile";
import { Edge } from "./Edge";

const Board = () => {
  // just testing...
  const game = setupGame(4);
  const [boardState, setBoardState] = useState(game.board);
  const [playerStates, setPlayerStates] = useState(game.players);

  const [moveIndex, setMoveIndex] = useState<number | undefined>(undefined);
  const [moveDirection, setMoveDirection] = useState<MoveDirection | undefined>(undefined);
  const [highlightTiles, setHighlightTiles] = useState<Record<number, number | undefined>>({});

  const playerTileRef = useRef<HTMLDivElement>(null);

  const handleMoveTiles = (index: number, direction: MoveDirection) => {
    setMoveIndex(index);
    setMoveDirection(direction);
  };

  const handleMoveTilesAnimationEnd = () => {
    if (moveIndex !== undefined && moveDirection !== undefined) {
      setBoardState((b) => {
        const updatedBoard = moveTiles(b, moveIndex, moveDirection);
        setHighlightTiles(getReachableTiles(updatedBoard, playerStates[0].currentPosition));
        return updatedBoard;
      });
    }

    setMoveIndex(undefined);
    setMoveDirection(undefined);
  };

  const handleTileClick = (point: Point) => {
    const reachableTiles = getReachableTiles(boardState, playerStates[0].currentPosition);
    setHighlightTiles(reachableTiles);
  };

  return (
    <div className="board-container">
      <CardStackMemoized cards={playerStates[0].cards} />

      <div className="player-tile-container">
        <div style={{ width: 80, margin: 20 }}>
          <div ref={playerTileRef} className="player-tile" onClick={() => setBoardState((s) => rotatePlayerTile(s))}>
            <TileMemoized {...boardState.playerTile} key={boardState.playerTile.id} />
          </div>
        </div>
      </div>

      <div className="board-frame">
        <Edge className="side left" direction="right" boardState={boardState} moveDirection={moveDirection} moveIndex={moveIndex} onClick={handleMoveTiles} />
        <Edge className="side right" direction="left" boardState={boardState} moveDirection={moveDirection} moveIndex={moveIndex} onClick={handleMoveTiles} />
        <Edge className="side top" direction="down" boardState={boardState} moveDirection={moveDirection} moveIndex={moveIndex} onClick={handleMoveTiles} />
        <Edge className="side bottom" direction="up" boardState={boardState} moveDirection={moveDirection} moveIndex={moveIndex} onClick={handleMoveTiles} />
        <div className="board">
          {boardState.tiles.flatMap((tile, rowIndex) =>
            tile.map((tile, columnIndex) => {
              const shouldShift =
                ((moveDirection === "up" || moveDirection === "down") && columnIndex === moveIndex) ||
                ((moveDirection === "left" || moveDirection === "right") && rowIndex === moveIndex);

              const shouldMove =
                shouldShift &&
                ((moveDirection === "up" && rowIndex === 0) ||
                  (moveDirection === "down" && rowIndex === 6) ||
                  (moveDirection === "left" && columnIndex === 0) ||
                  (moveDirection === "right" && columnIndex === 6));

              const index = rowIndex * 7 + columnIndex;

              return (
                <MovableTile
                  direction={moveDirection}
                  move={shouldMove}
                  shift={shouldShift}
                  key={`${columnIndex}_${rowIndex}`}
                  targetRef={playerTileRef}
                  onAnimationEnd={handleMoveTilesAnimationEnd}
                >
                  <div className={index in highlightTiles ? "highlight" : ""}>
                    <TileMemoized {...tile} onClick={() => handleTileClick({ x: columnIndex, y: rowIndex })} />
                  </div>
                </MovableTile>
              );
            }),
          )}
        </div>
      </div>
    </div>
  );
};

export const BoardMemoized = React.memo(Board);
