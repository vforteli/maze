import { HttpTransportType, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import "./App.css";
import { BoardMemoized } from "./board/Board";
import { MazeHubClientContextProvider } from "./generated/hubs/MazeHubClientContext";

function App() {
  const hubConnection = new HubConnectionBuilder()
    .configureLogging(LogLevel.Debug)
    .withAutomaticReconnect()
    .withUrl("http://localhost:5042/maze", { skipNegotiation: true, transport: HttpTransportType.WebSockets })
    .build();

  return (
    <MazeHubClientContextProvider hubConnection={hubConnection}>
      <div className="container">
        <div className="wrapper">
          <BoardMemoized />
        </div>
      </div>
    </MazeHubClientContextProvider>
  );
}

export default App;
