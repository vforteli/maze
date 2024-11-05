import type { HubConnection } from "@microsoft/signalr";

export type DoStuffObjectModel = {
  someBoolean: boolean;
  someNullableBoolean: boolean | null;
  someString: string;
  someNullableString: string | null;
  someInt: number;
  someNullableInt: number | null;
  someDateTime: string;
  someNullableDateTime: string | null;
};

export type SendMessageModel = {
  message: string;
  someId: number;
};

export type SendMessageResponseModel = {
  someId: number;
  status: string;
};

export type EventThingy = {
  eventName: string;
  eventType: string;
};

export class MazeHubClient {
  readonly connection: HubConnection;

  constructor(hubConnection: HubConnection) {
    this.connection = hubConnection;
  }

  async doStuffObject(someObject: DoStuffObjectModel) {
    await this.connection.invoke<DoStuffObjectModel>("doStuffObject", someObject);
  }

  async doStuffObjectNullable(someObject: DoStuffObjectModel | null) {
    await this.connection.invoke<DoStuffObjectModel>("doStuffObjectNullable", someObject);
  }

  async doStuffNullableString(someString: string | null) {
    await this.connection.invoke<string>("doStuffNullableString", someString);
  }

  async doStuff(number: number, otherNumber: number) {
    await this.connection.invoke<number>("doStuff", number, otherNumber);
  }

  async doStuffNullableInt(number: number | null, otherNumber: number) {
    await this.connection.invoke<number | null>("doStuffNullableInt", number, otherNumber);
  }

  async sendMessage(message: SendMessageModel) {
    await this.connection.invoke<SendMessageResponseModel>("sendMessage", message);
  }

  async sendEvent() {
    await this.connection.invoke("sendEvent");
  }

  async ping() {
    await this.connection.invoke<string>("ping");
  }

  async sendSomeList(list: EventThingy[]) {
    await this.connection.invoke<EventThingy[]>("sendSomeList", list);
  }

  addPongHandler(callback: (message: string) => void): void {
    this.connection.on("somethingHappened", callback);
  }

  removePongHandler(callback: (message: string) => void): void {
    this.connection.off("somethingHappened", callback);
  }

  addSomethingHappenedHandler(callback: (message: string | null) => void): void {
    this.connection.on("somethingHappened", callback);
  }

  removeSomethingHappenedHandler(callback: (message: string | null) => void): void {
    this.connection.off("somethingHappened", callback);
  }

  addSomethingHappenedModelHandler(callback: (someEvent: EventThingy) => void): void {
    this.connection.on("somethingHappened", callback);
  }

  removeSomethingHappenedModelHandler(callback: (someEvent: EventThingy) => void): void {
    this.connection.off("somethingHappened", callback);
  }

  addSomethingHappenedModelListHandler(callback: (someEventsList: EventThingy[]) => void): void {
    this.connection.on("somethingHappened", callback);
  }

  removeSomethingHappenedModelListHandler(callback: (someEventsList: EventThingy[]) => void): void {
    this.connection.off("somethingHappened", callback);
  }
}
