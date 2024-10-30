import React, { useCallback, useEffect } from "react";
import { CardMemoized } from "./Card";
import "./CardStack.scss";
import { Thing } from "../tiles/Tiles";
import { useMazeHub } from "../../mazehub/useMazeHub";

const CardStack = ({ cards }: { cards: Thing[] }) => {
  const mazeHub = useMazeHub();

  const handleSomethingHappened = useCallback((message: string) => {
    console.debug("cardstack: " + message);
  }, []);

  useEffect(() => {
    mazeHub.hub.addSomethingHappenedHandler(handleSomethingHappened);

    return () => {
      mazeHub.hub.removeSomethingHappened(handleSomethingHappened);
    };
  }, [handleSomethingHappened, mazeHub.hub]);

  return (
    <div className="card-stack">
      {cards.map((c) => (
        <CardMemoized key={c} item={c} />
      ))}
      {/* <CardMemoized item="bunny" />
      <CardMemoized item="cow" />
      <CardMemoized item="trex" /> */}
    </div>
  );
};

export const CardStackMemoized = React.memo(CardStack);
