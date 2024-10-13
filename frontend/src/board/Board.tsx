import "./Board.scss";
import React, { RefObject, useLayoutEffect, useRef, useState } from "react";
import { TileMemoized } from "./tiles/Tile";
import { BoardState, getRandomBoardTiles, getReachableTiles, MoveDirection, moveTiles, rotatePlayerTile } from "./boardUtils";
import { CardStackMemoized } from "./cards/CardStack";

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
  onClick: (i: number) => void;
}) => {
  return (
    <div className={className}>
      {[...Array(direction === "down" || direction === "up" ? boardState.tiles.length : boardState.tiles[0].length).keys()].map((i) =>
        i % 2 !== 0 ? (
          <div key={i} className="player-tile edge" onClick={() => onClick(i)}>
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
  const [path, setPath] = useState<string | undefined>(undefined);

  useLayoutEffect(() => {
    if (ref.current !== null) {
      if (shift) {
        const animationOptions: KeyframeAnimationOptions = {
          duration: 500,
          easing: "ease-in-out",
          composite: "replace",
          fill: "forwards",
        };

        const currentRect = ref.current.getBoundingClientRect();

        // figure out how much the tiles should be moved, the magical number 3 is the grid gap...
        const h_shift = currentRect.width + 2;
        const v_shift = currentRect.height + 2;
        const distance = direction === "right" || direction === "left" ? h_shift : v_shift;

        const dx_shift = direction === "right" ? h_shift : direction === "left" ? -h_shift : 0;
        const dy_shift = direction === "down" ? v_shift : direction === "up" ? -v_shift : 0;

        const targetRect = targetRef?.current?.getBoundingClientRect();
        const dx_playertile = targetRect ? targetRect.x - currentRect.x : 0;
        const dy_playertile = targetRect ? targetRect.y - currentRect.y : 0;

        setPath(`path("M0,0 L${dx_shift},${dy_shift} L${dx_playertile},${dy_playertile}")`);

        ref.current.animate([{ offsetDistance: "0%" }, { offsetDistance: `${distance}px` }], animationOptions).addEventListener(
          "finish",
          () => {
            if (move && ref.current !== null) {
              ref.current
                .animate([{ offsetDistance: `${distance}px` }, { offsetDistance: "100%" }], animationOptions)
                .addEventListener("finish", onAnimationEnd, { once: true });
            }
          },
          { once: true },
        );
      } else {
        setPath(undefined);
      }
    }
  }, [targetRef, ref, shift, move, onAnimationEnd, direction]);

  return (
    <div className="movable-tile" style={{ offsetPath: path }} ref={ref}>
      {children}
    </div>
  );
};

const Board = () => {
  const [boardState, setBoardState] = useState(getRandomBoardTiles());
  const playerTileRef = useRef<HTMLDivElement>(null);
  const [moveIndex, setMoveIndex] = useState<number | undefined>(undefined);
  const [moveDirection, setMoveDirection] = useState<MoveDirection | undefined>(undefined);

  const handleMoveTiles = (index: number, direction: MoveDirection) => {
    setMoveIndex(index);
    setMoveDirection(direction);
  };

  const handleRotatePlayerTile = () => {
    setBoardState((s) => rotatePlayerTile(s));
  };

  const handleMoveTilesAnimationEnd = () => {
    if (moveIndex !== undefined && moveDirection !== undefined) {
      setBoardState((b) => moveTiles(b, moveIndex, moveDirection));
    }

    setMoveIndex(undefined);
    setMoveDirection(undefined);
  };

  return (
    <div className="board-container">
      <CardStackMemoized />

      <div className="player-tile-container">
        <div style={{ width: 80, margin: 20 }}>
          <div ref={playerTileRef} className="player-tile" onClick={() => handleRotatePlayerTile()}>
            <TileMemoized {...boardState.playerTile} key={boardState.playerTile.id} />
          </div>
        </div>
      </div>

      <div className="board-frame">
        <Edge
          className="frame-side left"
          direction="right"
          boardState={boardState}
          moveDirection={moveDirection}
          moveIndex={moveIndex}
          onClick={(i) => handleMoveTiles(i, "right")}
        />
        <Edge
          className="frame-side right"
          direction="left"
          boardState={boardState}
          moveDirection={moveDirection}
          moveIndex={moveIndex}
          onClick={(i) => handleMoveTiles(i, "left")}
        />
        <Edge
          className="frame-side top"
          direction="down"
          boardState={boardState}
          moveDirection={moveDirection}
          moveIndex={moveIndex}
          onClick={(i) => handleMoveTiles(i, "down")}
        />
        <Edge
          className="frame-side bottom"
          direction="up"
          boardState={boardState}
          moveDirection={moveDirection}
          moveIndex={moveIndex}
          onClick={(i) => handleMoveTiles(i, "up")}
        />
        <div className="board">
          {boardState.tiles.flatMap((o, rowIndex) =>
            o.map((o, columnIndex) => {
              const shouldShift =
                ((moveDirection === "up" || moveDirection === "down") && columnIndex === moveIndex) ||
                ((moveDirection === "left" || moveDirection === "right") && rowIndex === moveIndex);

              const shouldMove =
                (shouldShift && moveDirection === "up" && rowIndex === 0) ||
                (shouldShift && moveDirection === "down" && rowIndex === 6) ||
                (shouldShift && moveDirection === "left" && columnIndex === 0) ||
                (shouldShift && moveDirection === "right" && columnIndex === 6);

              return (
                <MovableTile
                  direction={moveDirection}
                  move={shouldMove}
                  shift={shouldShift}
                  key={`${columnIndex}_${rowIndex}`}
                  targetRef={playerTileRef}
                  onAnimationEnd={handleMoveTilesAnimationEnd}
                >
                  <TileMemoized
                    {...o}
                    onClick={() => {
                      const reachableTiles = getReachableTiles(boardState, { x: columnIndex, y: rowIndex });
                      console.debug(`tiles reachable from ${columnIndex}:${rowIndex}`);
                      console.debug(reachableTiles);
                    }}
                  />
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
