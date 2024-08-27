import React from "react";
import "./StartingCell.scss";

const StartingCell = (props: { color: string }) => {
  return (
    <div className="starting-cell">
      <div className="circle" style={{ backgroundColor: `${props.color}` }}></div>
    </div>
  );
};

export const StartingCellMemoized = React.memo(StartingCell);
