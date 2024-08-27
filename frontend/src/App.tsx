import "./App.css";
import { BoardMemoized } from "./board/Board";

function App() {
  return (
    <div className="container">
      <div className="wrapper">
        <BoardMemoized />
      </div>
    </div>
  );
}

export default App;
