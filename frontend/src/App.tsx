import { HttpTransportType, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import "./App.css";
import { BoardMemoized } from "./board/Board";
import { MazeHubContextProvider } from "./mazehub/MazeHubContext";

function App() {
  const hubConnection = new HubConnectionBuilder()
    .configureLogging(LogLevel.Debug)
    .withAutomaticReconnect()
    .withUrl("http://localhost:5042/maze", { skipNegotiation: true, transport: HttpTransportType.WebSockets })
    .build();

  return (
    <MazeHubContextProvider hubConnection={hubConnection}>
      <div className="container">
        <div className="wrapper">
          <BoardMemoized />
        </div>
      </div>
    </MazeHubContextProvider>
  );
}

export default App;
