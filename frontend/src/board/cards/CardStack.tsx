import React from "react";
import { CardMemoized } from "./Card";
import "./CardStack.scss";

const CardStack = () => {
  return (
    <div className="card-stack">
      <CardMemoized item="bunny" />
      <CardMemoized item="cow" />
      <CardMemoized item="trex" />
    </div>
  );
};

export const CardStackMemoized = React.memo(CardStack);
