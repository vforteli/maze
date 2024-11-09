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
    var hubFiles = HubGenerator.CreateFromHub(hubType);

    await File.WriteAllTextAsync(Path.Combine(outputFolder, $"{hubType.Name}Client.ts"), hubFiles.HubFile);

    Directory.CreateDirectory(Path.Combine(outputFolder, "types"));

    foreach (var file in hubFiles.TypeFiles)
    {
        await File.WriteAllTextAsync(Path.Combine(outputFolder, "types", $"{file.Key}.ts"), file.Value);
    }
}


Console.WriteLine("Done...");