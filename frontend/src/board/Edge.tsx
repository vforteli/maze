import { BoardState, MoveDirection } from "./boardUtils";
import { MovableTileMemoized } from "./tiles/MovableTile";
import { TileMemoized } from "./tiles/Tile";

export type EdgeProps = {
  moveDirection: MoveDirection | undefined;
  moveIndex: number | undefined;
  className: string;
  direction: MoveDirection;
  boardState: BoardState;
  onClick: (i: number, direction: MoveDirection) => void;
};

export const Edge = ({ moveDirection, moveIndex, boardState, onClick, className, direction }: EdgeProps) => (
  <div className={className}>
    {[...Array(direction === "down" || direction === "up" ? boardState.tiles.length : boardState.tiles[0].length).keys()].map((i) =>
      i % 2 !== 0 ? (
        <div key={i} className="player-tile edge" onClick={() => onClick(i, direction)}>
          <MovableTileMemoized direction={direction} move={false} shift={direction === moveDirection && i === moveIndex} onAnimationEnd={() => {}}>
            <TileMemoized {...boardState.playerTile} key={boardState.playerTile.id} />
          </MovableTileMemoized>
        </div>
      ) : (
        <div className="edge" key={i} />
      ),
    )}
  </div>
);
