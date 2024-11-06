import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import { createContext, ReactNode, useEffect, useRef } from "react";
import { MazeHubClient } from "../generated/hubs/MazeHubClient";

export type MazeHubContextProviderProps = {
  children: ReactNode;
  hubConnection: HubConnection | (() => HubConnection);
};

export const MazeHubContext = createContext<{ hub: MazeHubClient } | undefined>(undefined);

export const MazeHubContextProvider = ({ children, hubConnection }: MazeHubContextProviderProps) => {
  const connection = typeof hubConnection === "function" ? hubConnection() : hubConnection;

  const messageHubClient = useRef(new MazeHubClient(connection));

  useEffect(() => {
    if (messageHubClient.current.connection.state === HubConnectionState.Disconnected) {
      messageHubClient.current.connection.start().catch((err) => console.error(err));
    }
  }, [messageHubClient.current.connection.state]);

  return <MazeHubContext.Provider value={{ hub: messageHubClient.current }}>{children}</MazeHubContext.Provider>;
};
