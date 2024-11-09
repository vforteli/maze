using System.Reflection;
using Microsoft.AspNetCore.SignalR;
using TypescriptModelGenerator;

namespace TypescriptHubGenerator;

public record HubFiles(Dictionary<string, string> TypeFiles, string HubFile);

public static class HubGenerator
{
    /// <summary>
    /// Create typescript client from hub
    /// </summary>
    /// <param name="hubType"></param>
    /// <returns></returns>
    public static HubFiles CreateFromHub(Type hubType)
    {
        if (!typeof(Hub).IsAssignableFrom(hubType))
        {
            throw new ArgumentException($"Type '{hubType.Name}' is not a subclass of Hub.");
        }

        var types = new Dictionary<string, string>();

        var callbackMethods = hubType.BaseType?.GenericTypeArguments
            .First()
            .GetMethods(BindingFlags.DeclaredOnly | BindingFlags.Instance | BindingFlags.Public) ?? [];

        var callbackMethodStrings = callbackMethods.Select((m) => CreateCallback(m, types));

        var hubMethods =
            hubType.GetMethods(BindingFlags.DeclaredOnly | BindingFlags.Instance | BindingFlags.Public);

        var hubMethodStrings = hubMethods.Select((m) => CreateMethod(m, types));

        return new HubFiles(types,
            CreateHubClient(
                $"{hubType.Name}Client",
                string.Join("\n\n", hubMethodStrings),
                string.Join("\n\n", callbackMethodStrings)));
    }

    /// <summary>
    /// Create the callback functions for a Hub, ie the functions to be called on the client side
    /// </summary>
    private static string CreateCallback(MethodInfo method, Dictionary<string, string> processedTypes)
    {
        const string callbackTemplate =
            """
              add{{methodName}}Handler(callback: ({{invokeParameters}}) => void): void {
                this.connection.on("{{callbackName}}", callback);
              }
            
              remove{{methodName}}Handler(callback: ({{invokeParameters}}) => void): void {
                this.connection.off("{{callbackName}}", callback);
              }
            """;

        var parameters = string.Join(", ",
            method.GetParameters()
                .Select(p =>
                    $"{p.Name?.ToCamelCase()}: {TypeScriptModelGenerator.ParseParameterInfo(p, processedTypes)}"
                ));

        return callbackTemplate
            .Replace("{{methodName}}", method.Name)
            .Replace("{{callbackName}}", method.Name.ToCamelCase())
            .Replace("{{invokeParameters}}", parameters);
    }


    /// <summary>
    /// Create the invokable hub methods
    /// </summary>
    private static string CreateMethod(MethodInfo method, Dictionary<string, string> processedTypes)
    {
        const string methodTemplate =
            """
              async {{methodName}}({{methodParameters}}) {
                await this.connection.invoke{{returnTypeParameter}}({{invokeParameters}});
              }
            """;

        var methodName = method.Name.ToCamelCase();

        var parameters = string.Join(", ",
            method.GetParameters()
                .Select(p =>
                    $"{p.Name?.ToCamelCase()}: {TypeScriptModelGenerator.ParseParameterInfo(p, processedTypes)}"));

        var invokeParameters =
            new List<string> { $"\"{methodName}\"" }.Concat(method.GetParameters().Select(p => p.Name!.ToCamelCase()));

        var invokeParametersString = string.Join(", ", invokeParameters);

        // so, should we treat all references types as nullable since this cannot be determined...
        var returnTypeString = method.ReturnType.BaseType == typeof(Task)
            ? $"<{TypeScriptModelGenerator.ParseTypeRecursively(method.ReturnType.GenericTypeArguments.First(), processedTypes, false)}>"
            : "";

        var methodTypeScript = methodTemplate
            .Replace("{{methodParameters}}", parameters)
            .Replace("{{methodName}}", methodName)
            .Replace("{{invokeParameters}}", invokeParametersString)
            .Replace("{{returnTypeParameter}}", returnTypeString);

        return methodTypeScript;
    }


    /// <summary>
    /// Create the actual hub client
    /// </summary>
    private static string CreateHubClient(string hubName, string methods, string callbacks)
    {
        const string hubClientTemplate =
            """
            import type { HubConnection } from "@microsoft/signalr";

            export class {{hubClientName}} {
              readonly connection: HubConnection;
            
              constructor(hubConnection: HubConnection) {
                this.connection = hubConnection;
              }

            {{methods}}

            {{callbacks}}
            }

            """;

        return hubClientTemplate
            .Replace("{{hubClientName}}", hubName)
            .Replace("{{methods}}", methods)
            .Replace("{{callbacks}}", callbacks);
    }
}