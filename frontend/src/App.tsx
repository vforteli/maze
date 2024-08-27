import { useMemo, useState } from "react";
import "./App.css";
import { useAppDispatch, useAppSelector } from "./store/store";

function App() {
  const dispatch = useAppDispatch();

  return (
    <>
      <div className="container">
        <div className="wrapper"></div>
      </div>
    </>
  );
}

export default App;
