using Microsoft.AspNetCore.SignalR;

namespace mazebackend;

public record SendMessageModel(string Message, int SomeId);

public record SendMessageResponseModel(int SomeId, string Status);

public record DoStuffObjectModel
{
    public required bool SomeBoolean { get; init; }
    public required bool? SomeNullableBoolean { get; init; }
    public required string SomeString { get; init; }
    public required string? SomeNullableString { get; init; }
    public required int SomeInt { get; init; }
    public required int? SomeNullableInt { get; init; }
    public required DateTime SomeDateTime { get; init; }
    public required DateTime? SomeNullableDateTime { get; init; }
}

public enum DoStuffEnum
{
    Herp,
    Derp,
    Hurr,
    Durr,
}

public class MazeHub : Hub<IMazeHub>
{
    public async Task<DoStuffObjectModel> DoStuffObject(DoStuffObjectModel someObject)
    {
        await Task.CompletedTask;
        return someObject;
    }

    public async Task<DoStuffObjectModel?> DoStuffObjectNullable(DoStuffObjectModel? someObject)
    {
        await Task.CompletedTask;
        return someObject;
    }

    public async Task<string?> DoStuffNullableString(string? someString)
    {
        await Task.CompletedTask;
        return someString;
    }

    public async Task<int> DoStuff(int number, int otherNumber)
    {
        var result = number + otherNumber;
        await Clients.Caller.SomethingHappened(result.ToString());
        return result;
    }

    public async Task<int?> DoStuffNullableInt(int? number, int otherNumber)
    {
        var result = number + otherNumber;
        await Clients.Caller.SomethingHappened(result.ToString());
        return result;
    }

    public async Task<DoStuffEnum?> DoStuffWithEnum(DoStuffEnum? someNullableEnum, DoStuffEnum someEnum)
    {
        await Task.CompletedTask;
        return null;
    }


    public async Task<SendMessageResponseModel> SendMessage(SendMessageModel message)
    {
        await Clients.All.SomethingHappened(message.Message);

        return new SendMessageResponseModel(42, "ack");
    }

    public async Task SendEvent()
    {
        await Clients.All.SomethingHappenedModel(new EventThingy("some_name", "some_type",
            new SomeNestedEventThingy("some_nested_name")));
    }

    public async Task<string> Ping()
    {
        await Clients.Caller.Pong("pong");
        return "pong";
    }

    public async Task<List<EventThingy>> SendSomeList(List<EventThingy> list)
    {
        await Clients.Caller.SomethingHappenedModelList(list);
        return list;
    }
}