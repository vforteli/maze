namespace mazebackend;

public record EventThingy(string EventName, string EventType);

public interface IMazeHub
{
    Task Pong(string message);

    Task SomethingHappened(string? message);

    Task SomethingHappenedModel(EventThingy someEvent);

    Task SomethingHappenedModelList(List<EventThingy> someEventsList);
}