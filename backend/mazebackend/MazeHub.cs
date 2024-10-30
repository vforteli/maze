using Microsoft.AspNetCore.SignalR;

namespace mazebackend;

public record SendMessageModel(string Message);

public class MazeHub : Hub<IMazeHub>
{
    public async Task SendMessage(SendMessageModel message)
    {
        await Clients.All.SomethingHappened(message.Message);
    }

    public async Task<string> Ping()
    {
        await Clients.Caller.Pong("pong");
        return "pong";
    }
}
