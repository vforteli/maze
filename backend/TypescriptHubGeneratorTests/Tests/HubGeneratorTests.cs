namespace TypescriptHubGeneratorTests.Tests;

public class Tests
{
    [Test]
    public void CreateFromHub()
    {
        const string expected =
            """
            import type { HubConnection } from "@microsoft/signalr";

            import type { EventType } from "./types/EventType";
            import type { SomeObjectModel } from "./types/SomeObjectModel";

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
                await this.connection.invoke<number>("doStuffNullableInt", number, otherNumber);
              }
            
              async doStuffWithEnum(someNullableEnum: EventType | null, someEnum: EventType) {
                await this.connection.invoke<EventType>("doStuffWithEnum", someNullableEnum, someEnum);
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

        const string eventTypeExpected = """export type EventType = "SomeEvent" | "SomeOtherEvent";""";

        const string someObjectModelExpected =
            """
            import type { EventType } from "./EventType";

            export type SomeObjectModel = {
              someBoolean: boolean;
              someNullableBoolean: boolean | null;
              someString: string;
              someNullableString: string | null;
              someInt: number;
              someNullableInt: number | null;
              someDateTime: string;
              someNullableDateTime: string | null;
              someEvent: EventType;
            };
            """;

        var actual = TypescriptHubGenerator.HubGenerator.CreateFromHub(typeof(TestHub));

        Assert.Multiple(() =>
        {
            Assert.That(actual.HubFile, Is.EqualTo(expected));
            Assert.That(actual.TypeFiles, Has.Count.EqualTo(2));
            Assert.That(actual.TypeFiles["EventType"], Is.EqualTo(eventTypeExpected));
            Assert.That(actual.TypeFiles["SomeObjectModel"], Is.EqualTo(someObjectModelExpected));
        });
    }
}