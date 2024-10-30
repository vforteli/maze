import "./App.css";
import { BoardMemoized } from "./board/Board";
import { MazeHubContextProvider } from "./mazehub/MazeHubContext";

function App() {
  return (
    <MazeHubContextProvider>
      <div className="container">
        <div className="wrapper">
          <BoardMemoized />
        </div>
      </div>
    </MazeHubContextProvider>
  );
}

export default App;
