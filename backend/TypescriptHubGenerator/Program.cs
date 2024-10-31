using System.Reflection;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using TypescriptHubGenerator;


var config = new ConfigurationBuilder().AddJsonFile($"appsettings.json", true, true).Build();

var assemblyPath = config["AssemblyPath"] ?? throw new ArgumentNullException("uh oh... no assembly path");
var outputFolder = config["OutputFolder"] ?? throw new ArgumentNullException("uh oh... no output folder");

if (!File.Exists(assemblyPath))
{
    Console.Error.WriteLine("Assembly not found?! Check path and ensure it has been built");
    Environment.Exit(1);
}

var hubTypes = Assembly.LoadFile(assemblyPath)
    .GetTypes()
    .Where(t => t.BaseType?.BaseType ==
                typeof(Hub)); // this will find generic hubs with an interface defined for operations


Directory.CreateDirectory(outputFolder);

foreach (var hubType in hubTypes)
{
    Console.WriteLine($"Found hubtype {hubType.Name}");
    var hubClientName = hubType.Name + "Client";
    var types = new Dictionary<string, string>();

    var callbackMethods = hubType.BaseType?.GenericTypeArguments
        .First()
        .GetMethods(BindingFlags.DeclaredOnly | BindingFlags.Instance | BindingFlags.Public) ?? [];

    var callbackMethodStrings = callbackMethods.Select((m) => HubGenerator.CreateCallback(m, types));

    var hubMethods =
        hubType.GetMethods(BindingFlags.DeclaredOnly | BindingFlags.Instance | BindingFlags.Public);

    var hubMethodStrings = hubMethods.Select((m) => HubGenerator.CreateMethod(m, types));

    var hubClientTs = HubGenerator.CreateHubClient(
        hubClientName,
        string.Join("\n\n", hubMethodStrings),
        string.Join("\n\n", callbackMethodStrings),
        string.Join("\n\n", types.Values));

    await File.WriteAllTextAsync(Path.Combine(outputFolder, $"{hubClientName}.ts"), hubClientTs);
}


Console.WriteLine("Done...");