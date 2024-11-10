import React, { useCallback, useEffect } from "react";
import { CardMemoized } from "./Card";
import "./CardStack.scss";
import { Thing } from "../tiles/Tiles";
import { useMazeHubClient } from "../../generated/hubs/MazeHubClientContextHook";

const CardStack = ({ cards }: { cards: Thing[] }) => {
  const mazeHub = useMazeHubClient();

  const handleSomethingHappened = useCallback((message: string | null) => {
    console.debug("cardstack: " + message);
  }, []);

  useEffect(() => {
    mazeHub.hub.addSomethingHappenedHandler(handleSomethingHappened);

    return () => {
      mazeHub.hub.removeSomethingHappenedHandler(handleSomethingHappened);
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
