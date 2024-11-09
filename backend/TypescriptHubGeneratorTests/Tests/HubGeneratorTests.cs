namespace TypescriptHubGeneratorTests.Tests;

public class Tests
{
    [Test]
    public void CreateFromHub()
    {
        const string expected =
            """
            import type { HubConnection } from "@microsoft/signalr";

            export type SomeObjectModel = {
              someBoolean: boolean;
              someNullableBoolean: boolean | null;
              someString: string;
              someNullableString: string | null;
              someInt: number;
              someNullableInt: number | null;
              someDateTime: string;
              someNullableDateTime: string | null;
            };

            export type EventType = "SomeEvent" | "SomeOtherEvent";

            export class TestHubClient {
              readonly connection: HubConnection;
            
              constructor(hubConnection: HubConnection) {
                this.connection = hubConnection;
              }
            
              async doStuffObject(someObject: SomeObjectModel) {
                await this.connection.invoke<SomeObjectModel>("doStuffObject", someObject);
              }
            
              async doStuffObjectNullable(someObject: SomeObjectModel | null) {
                await this.connection.invoke<SomeObjectModel>("doStuffObjectNullable", someObject);
              }
            
              async doStuffNullableInt(number: number | null, otherNumber: number) {
                await this.connection.invoke<number | null>("doStuffNullableInt", number, otherNumber);
              }
            
              async doStuffWithEnum(someNullableEnum: EventType | null, someEnum: EventType) {
                await this.connection.invoke<EventType | null>("doStuffWithEnum", someNullableEnum, someEnum);
              }
            
              addPongHandler(callback: () => void): void {
                this.connection.on("pong", callback);
              }
            
              removePongHandler(callback: () => void): void {
                this.connection.off("pong", callback);
              }
            
              addSomethingHappenedHandler(callback: (message: string | null) => void): void {
                this.connection.on("somethingHappened", callback);
              }
            
              removeSomethingHappenedHandler(callback: (message: string | null) => void): void {
                this.connection.off("somethingHappened", callback);
              }
            
              addSomethingHappenedNullableHandler(callback: (message: string | null) => void): void {
                this.connection.on("somethingHappenedNullable", callback);
              }
            
              removeSomethingHappenedNullableHandler(callback: (message: string | null) => void): void {
                this.connection.off("somethingHappenedNullable", callback);
              }
            
              addSomethingHappenedModelHandler(callback: (someEvent: EventType) => void): void {
                this.connection.on("somethingHappenedModel", callback);
              }
            
              removeSomethingHappenedModelHandler(callback: (someEvent: EventType) => void): void {
                this.connection.off("somethingHappenedModel", callback);
              }
            
              addSomethingHappenedModelListHandler(callback: (someEventsList: EventType[]) => void): void {
                this.connection.on("somethingHappenedModelList", callback);
              }
            
              removeSomethingHappenedModelListHandler(callback: (someEventsList: EventType[]) => void): void {
                this.connection.off("somethingHappenedModelList", callback);
              }
            }

            """;

        var actual = TypescriptHubGenerator.HubGenerator.CreateFromHub(typeof(TestHub));

        Assert.That(actual.HubFile, Is.EqualTo(expected));
    }
}