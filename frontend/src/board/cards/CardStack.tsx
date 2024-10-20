import React from "react";
import { CardMemoized } from "./Card";
import "./CardStack.scss";
import { Thing } from "../tiles/Tiles";

const CardStack = ({ cards }: { cards: Thing[] }) => {
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
