import "./Board.scss";
import React, { RefObject, useLayoutEffect, useRef, useState } from "react";
import { TileMemoized } from "./tiles/Tile";
import { BoardState, getRandomBoardTiles, getReachableTiles, MoveDirection, moveTiles, Point, rotatePlayerTile, setupGame } from "./boardUtils";
import { CardStackMemoized } from "./cards/CardStack";
import { animateMany, ChainablePath } from "../utils";

const Edge = ({
  moveDirection,
  moveIndex,
  boardState,
  onClick,
  className,
  direction,
}: {
  moveDirection: MoveDirection | undefined;
  moveIndex: number | undefined;
  className: string;
  direction: MoveDirection;
  boardState: BoardState;
  onClick: (i: number, direction: MoveDirection) => void;
}) => (
  <div className={className}>
    {[...Array(direction === "down" || direction === "up" ? boardState.tiles.length : boardState.tiles[0].length).keys()].map((i) =>
      i % 2 !== 0 ? (
        <div key={i} className="player-tile edge" onClick={() => onClick(i, direction)}>
          <MovableTile direction={direction} move={false} shift={direction === moveDirection && i === moveIndex} onAnimationEnd={() => {}}>
            <TileMemoized {...boardState.playerTile} key={boardState.playerTile.id} />
          </MovableTile>
        </div>
      ) : (
        <div className="edge" key={i} />
      ),
    )}
  </div>
);

const animationOptions: KeyframeAnimationOptions = {
  duration: 500,
  easing: "ease-in-out",
  composite: "replace",
  fill: "forwards",
};

const MovableTile = ({
  shift,
  move,
  targetRef,
  children,
  direction,
  onAnimationEnd,
}: {
  shift: boolean;
  move: boolean;
  direction: MoveDirection | undefined;
  targetRef?: RefObject<HTMLDivElement>;
  children: React.ReactNode;
  onAnimationEnd: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (ref.current !== null) {
      if (shift) {
        const currentRect = ref.current.getBoundingClientRect();

        // figure out how much the tiles should be moved, the magical number 3 is the grid gap...
        const h_shift = currentRect.width + 2;
        const v_shift = currentRect.height + 2;

        const dx_shift = direction === "right" ? h_shift : direction === "left" ? -h_shift : 0;
        const dy_shift = direction === "down" ? v_shift : direction === "up" ? -v_shift : 0;

        const targetRect = targetRef?.current?.getBoundingClientRect();
        const dx_playertile = targetRect ? targetRect.x - currentRect.x : 0;
        const dy_playertile = targetRect ? targetRect.y - currentRect.y : 0;

        const shiftPath: ChainablePath = { options: animationOptions, path: `path("M0,0 L${dx_shift},${dy_shift}")` };
        const movePath: ChainablePath = { options: animationOptions, path: `path("M${dx_shift},${dy_shift} L${dx_playertile},${dy_playertile}")` };

        move ? animateMany(ref.current, [shiftPath, movePath]).then(onAnimationEnd) : animateMany(ref.current, [shiftPath]);
      } else {
        ref.current.style.offsetPath = "";
      }
    }
  }, [targetRef, ref, shift, move, onAnimationEnd, direction]);

  return (
    <div className="movable-tile" ref={ref}>
      {children}
    </div>
  );
};

const Board = () => {
  // just testing...
  const foo = setupGame(4);
  const [boardState, setBoardState] = useState(foo.board);
  const [playerStates, setPlayerStates] = useState(foo.players);

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
