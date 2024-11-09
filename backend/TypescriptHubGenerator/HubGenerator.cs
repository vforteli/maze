using System.Collections.Immutable;
using System.Reflection;
using Microsoft.AspNetCore.SignalR;
using TypescriptModelGenerator;

namespace TypescriptHubGenerator;

public record HubFiles(Dictionary<string, string> TypeFiles, string HubFile);

public static class HubGenerator
{
    private const string Import = """import type { {{typeName}} } from "./types/{{typeName}}";""";

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

        if (hubType.BaseType == null)
        {
            throw new ArgumentNullException("Hub is not generic... nothing to do here...");
        }

        var types = new Dictionary<string, string>();

        var callbackMethods = hubType.BaseType.GenericTypeArguments
            .First()
            .GetMethods(BindingFlags.DeclaredOnly | BindingFlags.Instance | BindingFlags.Public)
            .Select((m) => CreateCallback(m, types))
            .ToImmutableList();

        var hubMethodStrings = hubType
            .GetMethods(BindingFlags.DeclaredOnly | BindingFlags.Instance | BindingFlags.Public)
            .Select((m) => CreateMethod(m, types));


        var imports = callbackMethods
            .SelectMany(o => o.imports)
            .DistinctBy(o => o.Name)
            .Select(o => Import.Replace("{{typeName}}", o.Name)).ToImmutableList();

        return new HubFiles(types,
            CreateHubClient(
                $"{hubType.Name}Client",
                string.Join("\n\n", hubMethodStrings),
                string.Join("\n\n", callbackMethods.Select(o => o.callbacks)),
                string.Join("\n", imports)));
    }

    /// <summary>
    /// Create the callback functions for a Hub, ie the functions to be called on the client side
    /// </summary>
    private static (ImmutableList<ComplexType> imports, string callbacks) CreateCallback(MethodInfo method,
        Dictionary<string, string> processedTypes)
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

        var parameters = method.GetParameters()
            .Select(o =>
                new KeyValuePair<string, TsType>(
                    o.Name?.ToCamelCase() ??
                    throw new ArgumentNullException("Cannot have parameters without name here..."),
                    TypeScriptModelGenerator.ParseParameterInfo(o, processedTypes)))
            .ToImmutableList();

        var parametersString = string.Join(", ", parameters.Select(p => $"{p.Key}: {p.Value}"));

        var imports = parameters.Select(o => o.Value).OfType<ComplexType>().ToImmutableList();

        return (imports, callbackTemplate
            .Replace("{{methodName}}", method.Name)
            .Replace("{{callbackName}}", method.Name.ToCamelCase())
            .Replace("{{invokeParameters}}", parametersString));
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
    private static string CreateHubClient(string hubName, string methods, string callbacks, string imports)
    {
        const string hubClientTemplate =
            """
            import type { HubConnection } from "@microsoft/signalr";

            {{imports}}

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
            .Replace("{{imports}}", imports)
            .Replace("{{methods}}", methods)
            .Replace("{{callbacks}}", callbacks);
    }
}