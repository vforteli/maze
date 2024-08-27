import React from "react";
import "./ItemCell.scss";
import { Thing } from "./Cells";

const ItemCell = (props: { item: Thing }) => {
  return <div className="item-cell">{props.item}</div>;
};

export const ItemCellMemoized = React.memo(ItemCell);
