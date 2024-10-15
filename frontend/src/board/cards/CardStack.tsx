import React from "react";
import { CardMemoized } from "./Card";
import "./CardStack.scss";
import { dealCards } from "../boardUtils";

const CardStack = () => {
  // todo well obviously we shouldnt show all the cards at once.. just testing
  const cards = dealCards(2);

  return (
    <div className="card-stack">
      {cards[0].cards.map((c) => (
        <CardMemoized key={c} item={c} />
      ))}
      {/* <CardMemoized item="bunny" />
      <CardMemoized item="cow" />
      <CardMemoized item="trex" /> */}
    </div>
  );
};

export const CardStackMemoized = React.memo(CardStack);
