import React from "react";
import "./ItemTile.scss";
import { Thing } from "./Tiles";

const ItemTile = (props: { item: Thing }) => {
  return <div className="item-tile">{props.item}</div>;
};

export const ItemTileMemoized = React.memo(ItemTile);
