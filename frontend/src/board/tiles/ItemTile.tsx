import React from "react";
import "./ItemTile.scss";
import { Thing, ThingIcons } from "./Tiles";

const ItemTile = (props: { item: Thing }) => {
  return <div className="item-tile">{ThingIcons[props.item] ?? props.item}</div>;
};

export const ItemTileMemoized = React.memo(ItemTile);
