import type { HubConnection } from "@microsoft/signalr";

import type { EventThingy } from "./types/EventThingy";
import type { DoStuffObjectModel } from "./types/DoStuffObjectModel";
import type { DoStuffEnum } from "./types/DoStuffEnum";
import type { SendMessageModel } from "./types/SendMessageModel";
import type { SendMessageResponseModel } from "./types/SendMessageResponseModel";

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
    await this.connection.invoke<number>("doStuffNullableInt", number, otherNumber);
  }

  async doStuffWithEnum(someNullableEnum: DoStuffEnum | null, someEnum: DoStuffEnum) {
    await this.connection.invoke<DoStuffEnum>("doStuffWithEnum", someNullableEnum, someEnum);
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
    await this.connection.invoke<EventThingy>("sendSomeList", list);
  }

  addPongHandler(callback: (message: string) => void): void {
    this.connection.on("pong", callback);
  }

  removePongHandler(callback: (message: string) => void): void {
    this.connection.off("pong", callback);
  }

  addSomethingHappenedHandler(callback: (message: string | null) => void): void {
    this.connection.on("somethingHappened", callback);
  }

  removeSomethingHappenedHandler(callback: (message: string | null) => void): void {
    this.connection.off("somethingHappened", callback);
  }

  addSomethingHappenedModelHandler(callback: (someEvent: EventThingy) => void): void {
    this.connection.on("somethingHappenedModel", callback);
  }

  removeSomethingHappenedModelHandler(callback: (someEvent: EventThingy) => void): void {
    this.connection.off("somethingHappenedModel", callback);
  }

  addSomethingHappenedModelListHandler(callback: (someEventsList: EventThingy[]) => void): void {
    this.connection.on("somethingHappenedModelList", callback);
  }

  removeSomethingHappenedModelListHandler(callback: (someEventsList: EventThingy[]) => void): void {
    this.connection.off("somethingHappenedModelList", callback);
  }
}
