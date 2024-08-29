import React from "react";
import "./StartingTile.scss";

const StartingTile = (props: { color: string }) => {
  return (
    <div className="starting-tile">
      <div className="circle" style={{ backgroundColor: `${props.color}` }}></div>
    </div>
  );
};

export const StartingTileMemoized = React.memo(StartingTile);
