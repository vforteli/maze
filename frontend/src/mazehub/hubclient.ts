import type { HubConnection } from "@microsoft/signalr";

export class MessageHubClient {
  readonly connection;

  constructor(hubConnection: HubConnection) {
    this.connection = hubConnection;
  }

  addSomethingHappenedHandler(callback: (message: string) => void): void {
    this.connection.on("somethingHappened", callback);
  }

  removeSomethingHappened(callback: (message: string) => void): void {
    this.connection.off("somethingHappened", callback);
  }

  ping(): Promise<string> {
    return this.connection.invoke<string>("ping");
  }

  sendMessage(message: string): Promise<void> {
    return this.connection.invoke("sendMessage", { message: message });
  }
}
