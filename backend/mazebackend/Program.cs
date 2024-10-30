using mazebackend;
using Microsoft.AspNetCore.SignalR;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddCors();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR(hubOptions =>
{
    hubOptions.EnableDetailedErrors = true;
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapGet("/ping", () =>
{
    return "pong";
}).WithOpenApi();

app.UseCors(config => config.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:5173"));
app.MapHub<MazeHub>("/maze");


var hub = app.Services.GetRequiredService<IHubContext<MazeHub, IMazeHub>>();

await using var timer = new Timer(s =>
{
    hub.Clients.All.SomethingHappened($"{DateTime.UtcNow} :: sup?");
}, null, 5000, 5000);


app.Run();
