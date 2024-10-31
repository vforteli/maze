import { HttpTransportType, HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr";
import { createContext, FC, ReactNode, useEffect, useRef } from "react";
import { MazeHubClient } from "../generated/hubs/MazeHubClient";

const url = "http://localhost:5042/maze";

type MazeHubContextProps = {
  hub: MazeHubClient;
};

export const MazeHubContext = createContext<MazeHubContextProps | undefined>(undefined);

export const MazeHubContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const hubConnection = new HubConnectionBuilder()
    .configureLogging(LogLevel.Debug)
    .withAutomaticReconnect()
    .withUrl(url, { skipNegotiation: true, transport: HttpTransportType.WebSockets })
    .build();

  const messageHubClient = useRef(new MazeHubClient(hubConnection));

  useEffect(() => {
    if (messageHubClient.current.connection.state === HubConnectionState.Disconnected) {
      messageHubClient.current.connection
        .start()
        .then(() => {
          console.debug("connected... i guess");
        })
        .catch((err) => console.error(err));
    }
  }, [messageHubClient.current.connection.state]);

  return <MazeHubContext.Provider value={{ hub: messageHubClient.current }}>{children}</MazeHubContext.Provider>;
};
