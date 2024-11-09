namespace mazebackend;

public record SomeNestedEventThingy(string NestedEventName);

public record EventThingy(string EventName, string EventType, SomeNestedEventThingy NestedEvent);

public interface IMazeHub
{
    Task Pong(string message);

    Task SomethingHappened(string? message);

    Task SomethingHappenedModel(EventThingy someEvent);

    Task SomethingHappenedModelList(List<EventThingy> someEventsList);
}