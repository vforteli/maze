namespace mazebackend;

public interface IMazeHub
{
    Task Pong(string message);

    Task SomethingHappened(string message);
}
