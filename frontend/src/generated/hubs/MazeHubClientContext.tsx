import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import { createContext, ReactNode, useEffect, useRef } from "react";
import { MazeHubClient } from "./MazeHubClient";

export type MazeHubClientContextProviderProps = {
  children: ReactNode;
  hubConnection: HubConnection | (() => HubConnection);
};

export const MazeHubClientContext = createContext<{ hub: MazeHubClient } | undefined>(undefined);

export const MazeHubClientContextProvider = ({ children, hubConnection }: MazeHubClientContextProviderProps) => {
  const connection = typeof hubConnection === "function" ? hubConnection() : hubConnection;

  const mazeHubClient = useRef(new MazeHubClient(connection));

  useEffect(() => {
    if (mazeHubClient.current.connection.state === HubConnectionState.Disconnected) {
      mazeHubClient.current.connection.start().catch((err) => console.error(err));
    }
  }, [mazeHubClient.current.connection.state]);

  return <MazeHubClientContext.Provider value={{ hub: mazeHubClient.current }}>{children}</MazeHubClientContext.Provider>;
};
