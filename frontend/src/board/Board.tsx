import "./Board.scss";
import React, { RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import { TileMemoized } from "./tiles/Tile";
import { BoardState, getRandomBoardTiles, MoveDirection, moveTiles, rotatePlayerTile } from "./boardUtils";
import { CardStackMemoized } from "./cards/CardStack";

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
  return (
    <div className={className}>
      {[...Array(direction === "down" || direction === "up" ? boardState.tiles.length : boardState.tiles[0].length).keys()].map((i) =>
        i % 2 !== 0 ? (
          <div key={i} className="player-tile movable" onClick={() => onClick(i)}>
            <TileMemoized {...boardState.playerTile} key={boardState.playerTile.id} />
          </div>
        ) : (
          <div key={i} />
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
  onAnimationEnd,
}: {
  shift: boolean;
  move: boolean;
  targetRef: RefObject<HTMLDivElement>;
  children: React.ReactNode;
  onAnimationEnd: () => void;
}) => {
  // all of this seems highly inefficient, although i guess if efficiency was a thing i wouldnt be doing this in css and react :D
  const ref = useRef<HTMLDivElement>(null);
  const [path, setPath] = useState<string | undefined>(undefined);

  useLayoutEffect(() => {
    if (ref.current !== null && targetRef.current !== null) {
      if (shift) {
        const animationOptions: KeyframeAnimationOptions = {
          duration: 1000,
          easing: "ease-in-out",
          composite: "replace",
          fill: "forwards",
        };

        const currentRect = ref.current.getBoundingClientRect();
        const targetRect = targetRef.current?.getBoundingClientRect();

        // offsets to move the piece one piece length in... some direction
        // obviously this should check direction... using right for testing
        const dx_shift = Math.round(currentRect.width + 3);
        const dy_shift = 0;

        // these are the offset from the current tile to the player tile
        const dx_playertile = Math.round(targetRect.x - currentRect.x);
        const dy_playertile = Math.round(targetRect.y - currentRect.y);

        setPath(`path("M0,0 L${dx_shift},${dy_shift} L${dx_playertile},${dy_playertile}")`);

        const shiftAnimation = ref.current.animate([{ offsetDistance: "0%" }, { offsetDistance: `${dx_shift}px` }], { ...animationOptions, duration: 500 });
        shiftAnimation.addEventListener("finish", () => {
          if (move) {
            const moveAnimation = ref.current!.animate([{ offsetDistance: `${dx_shift}px` }, { offsetDistance: "100%" }], animationOptions);
            moveAnimation.addEventListener("finish", () => {
              onAnimationEnd();
            });
          }
        });
      } else {
        setPath(undefined);
      }
    }
  }, [targetRef, ref, shift, move, onAnimationEnd]);

  return (
    <div className="movable-tile" style={{ offsetPath: path }} ref={ref}>
      {children}
    </div>
  );
};

const Board = () => {
  const [boardState, setBoardState] = useState(getRandomBoardTiles());
  const playerTileRef = useRef<HTMLDivElement>(null);
  const [moveRowIndex, setMoveRowIndex] = useState<number | undefined>(undefined);

  const handleMoveTiles = (index: number, direction: MoveDirection) => {
    setMoveRowIndex(direction === "right" ? index : undefined);
  };

  const handleRotatePlayerTile = () => {
    setBoardState((s) => rotatePlayerTile(s));
  };

  const handleMoveTilesAnimationEnd = (index: number, direction: MoveDirection) => {
    setMoveRowIndex(undefined);
    setBoardState((b) => moveTiles(b, index, direction));
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
        <Edge className="frame-side left" direction="right" boardState={boardState} onClick={(i) => handleMoveTiles(i, "right")} />
        <Edge className="frame-side right" direction="left" boardState={boardState} onClick={(i) => handleMoveTiles(i, "left")} />
        <Edge className="frame-side top" direction="down" boardState={boardState} onClick={(i) => handleMoveTiles(i, "down")} />
        <Edge className="frame-side bottom" direction="up" boardState={boardState} onClick={(i) => handleMoveTiles(i, "up")} />
        <div className="board">
          {boardState.tiles.flatMap((o, rowIndex) =>
            o.map((o, columnIndex) => {
              return (
                <MovableTile
                  move={moveRowIndex === rowIndex && columnIndex === 6}
                  shift={moveRowIndex === rowIndex}
                  key={`${columnIndex}_${rowIndex}`}
                  targetRef={playerTileRef}
                  onAnimationEnd={() => handleMoveTilesAnimationEnd(rowIndex, "right")}
                >
                  <TileMemoized {...o} />
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
