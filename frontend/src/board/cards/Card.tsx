import React from "react";
import { Thing, ThingIcons } from "../tiles/Tiles";
import "./Card.scss";

export type CardProps = {
  item: Thing;
};

const Card = (props: CardProps) => (
  <div className="card">
    <div className="item-tile">{ThingIcons[props.item]}</div>
  </div>
);

export const CardMemoized = React.memo(Card);
