import { useMemo, useState } from "react";
import "./App.css";
import { useAppDispatch, useAppSelector } from "./store/store";
import { BoardMemoized } from "./board/Board";

function App() {
  const dispatch = useAppDispatch();

  return (
    <>
      <div className="container">
        <div className="wrapper">
          <BoardMemoized />
        </div>
      </div>
    </>
  );
}

export default App;
