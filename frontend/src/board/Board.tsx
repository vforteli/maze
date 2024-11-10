import "./Board.scss";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { TileMemoized } from "./tiles/Tile";
import {
  GameState,
  getReachableTiles,
  moveCurrentPlayer,
  MoveDirection,
  moveTiles,
  Point,
  rotatePlayerTile,
  setupGame,
  shouldMove,
  shouldShift,
} from "./boardUtils";
import { CardStackMemoized } from "./cards/CardStack";
import { MovableTileMemoized } from "./tiles/MovableTile";
import { Edge } from "./Edge";
import { useMazeHubClient } from "../generated/hubs/MazeHubClientContextHook";

const Board = () => {
  const mazeHub = useMazeHubClient();
  const [game, setGameState] = useState(setupGame(4));
  const [moveIndex, setMoveIndex] = useState<number | undefined>(undefined);
  const [moveDirection, setMoveDirection] = useState<MoveDirection | undefined>(undefined);
  const [highlightTiles, setHighlightTiles] = useState<Record<number, number | undefined>>({});

  const handleSomethingHappened = useCallback((message: string | null) => {
    console.debug("handleSomethingHappened: board: " + message);
  }, []);

  const handlePong = useCallback((message: string) => {
    console.debug("handlePong: " + message);
  }, []);

  const handleSomethingHappenedModel = useCallback((item: unknown) => {
    console.dir(item);
  }, []);

  useEffect(() => {
    mazeHub.hub.addSomethingHappenedHandler(handleSomethingHappened);
    mazeHub.hub.addSomethingHappenedModelHandler(handleSomethingHappenedModel);
    mazeHub.hub.addPongHandler(handlePong);

    return () => {
      mazeHub.hub.removeSomethingHappenedHandler(handleSomethingHappened);
      mazeHub.hub.removeSomethingHappenedModelHandler(handleSomethingHappenedModel);
      mazeHub.hub.removePongHandler(handlePong);
    };
  }, [handlePong, handleSomethingHappened, handleSomethingHappenedModel, mazeHub.hub]);

  const playerTileRef = useRef<HTMLDivElement>(null);

  const handleMoveTiles = (index: number, direction: MoveDirection) => {
    setMoveIndex(index);
    setMoveDirection(direction);
  };

  const updateHighlights = (gameState: GameState) => {
    setHighlightTiles(getReachableTiles(gameState.board.tiles, gameState.players[gameState.turn.currentPlayer].currentPosition));
  };

  const handleMoveTilesAnimationEnd = () => {
    if (moveIndex !== undefined && moveDirection !== undefined) {
      setGameState((b) => {
        const updatedGameState: GameState = moveTiles(b, moveIndex, moveDirection);
        updateHighlights(updatedGameState);
        return updatedGameState;
      });
    }

    setMoveIndex(undefined);
    setMoveDirection(undefined);
  };

  const handleTileClick = (point: Point) => {
    const updatedGameState = moveCurrentPlayer(game, point);
    setGameState(updatedGameState);
    updateHighlights(updatedGameState);
  };

  const handleRotatePlayerTile = () => {
    setGameState((s) => ({ ...s, board: rotatePlayerTile(s.board) }));
  };

  const doStuff = () => {
    mazeHub.hub.sendMessage({ message: "hello from board!", someId: 7 });
  };

  const sendEvent = () => {
    mazeHub.hub.doStuff(42, 42);
  };

  return (
    <div className="board-container">
      <button onClick={doStuff}>Do stuff</button>
      <button onClick={sendEvent}>send event</button>
      <CardStackMemoized cards={game.players[0].cards} />

      <div className="player-tile-container">
        Player: {game.turn.currentPlayer}
        <br />
        Position: {JSON.stringify(game.players[game.turn.currentPlayer].currentPosition)}
        <br />
        State: {game.turn.currentAction}
        <div style={{ width: 80, margin: 20 }}>
          <div ref={playerTileRef} className="player-tile" onClick={handleRotatePlayerTile}>
            <TileMemoized {...game.board.playerTile} key={game.board.playerTile.id} />
          </div>
        </div>
      </div>

      <div className="board-frame">
        <Edge className="side left" direction="right" boardState={game.board} moveDirection={moveDirection} moveIndex={moveIndex} onClick={handleMoveTiles} />
        <Edge className="side right" direction="left" boardState={game.board} moveDirection={moveDirection} moveIndex={moveIndex} onClick={handleMoveTiles} />
        <Edge className="side top" direction="down" boardState={game.board} moveDirection={moveDirection} moveIndex={moveIndex} onClick={handleMoveTiles} />
        <Edge className="side bottom" direction="up" boardState={game.board} moveDirection={moveDirection} moveIndex={moveIndex} onClick={handleMoveTiles} />
        <div className="board">
          {game.board.tiles.flatMap((tile, rowIndex) =>
            tile.map((tile, columnIndex) => {
              const player = game.players.findIndex((o) => o.currentPosition === tile.id);

              return (
                <MovableTileMemoized
                  direction={moveDirection}
                  move={shouldMove(moveDirection, moveIndex, columnIndex, rowIndex)}
                  shift={shouldShift(moveDirection, moveIndex, columnIndex, rowIndex)}
                  key={`${columnIndex}_${rowIndex}`}
                  targetRef={playerTileRef}
                  onAnimationEnd={handleMoveTilesAnimationEnd}
                >
                  <div className={rowIndex * 7 + columnIndex in highlightTiles ? "highlight" : ""}>
                    <TileMemoized {...tile} player={player >= 0 ? player : undefined} onClick={() => handleTileClick({ x: columnIndex, y: rowIndex })} />
                  </div>
                </MovableTileMemoized>
              );
            }),
          )}
        </div>
      </div>
    </div>
  );
};

export const BoardMemoized = React.memo(Board);
