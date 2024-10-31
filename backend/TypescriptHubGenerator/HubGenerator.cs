using System.Reflection;
using TypescriptModelGenerator;

namespace TypescriptHubGenerator;

public static class HubGenerator
{
    /// <summary>
    /// Create the callback functions for a Hub, ie the functions to be called on the client side
    /// </summary>
    public static string CreateCallback(MethodInfo method, Dictionary<string, string> processedTypes)
    {
        const string methodTemplate = """
                                        add{{methodName}}Handler(callback: ({{invokeParameters}}) => void): void {
                                          this.connection.on("somethingHappened", callback);
                                        }
                                      
                                        remove{{methodName}}Handler(callback: ({{invokeParameters}}) => void): void {
                                          this.connection.off("somethingHappened", callback);
                                        }
                                      """;

        var parameters = string.Join(", ",
            method.GetParameters()
                .Select(p =>
                    $"{p.Name?.ToCamelCase()}: {TypeScriptModelGenerator.ParseParameterInfo(p, processedTypes)}"
                ));

        var returnTypeString = method.ReturnType.BaseType == typeof(Task)
            ? "<foo>"
            : "";

        return methodTemplate
            .Replace("{{methodName}}", method.Name.ToCamelCase())
            .Replace("{{invokeParameters}}", parameters)
            .Replace("{{returnTypeParameter}}", returnTypeString);
    }


    /// <summary>
    /// Create the invokable hub methods
    /// </summary>
    public static string CreateMethod(MethodInfo method, Dictionary<string, string> processedTypes)
    {
        const string methodTemplate = """
                                        async {{methodName}}({{methodParameters}}) {
                                          await this.connection.invoke{{returnTypeParameter}}({{invokeParameters}});
                                        }
                                      """;

        var methodName = method.Name.ToCamelCase();

        var parameters = string.Join(", ",
            method.GetParameters()
                .Select(p =>
                {
                    var type = TypeScriptModelGenerator.ParseParameterInfo(p, processedTypes);
                    return $"{p.Name?.ToCamelCase()}: {type}";
                }));

        var invokeParameters =
            new List<string> { $"\"{methodName}\"" }.Concat(method.GetParameters().Select(p => p.Name!.ToCamelCase()));

        var invokeParametersString = string.Join(", ", invokeParameters);

        // so.. should we treat all references types as nullable since this cannot be determined...
        var returnTypeString = method.ReturnType.BaseType == typeof(Task)
            ? $"<{TypeScriptModelGenerator.ParseType(method.ReturnType.GenericTypeArguments.First(), processedTypes)}>"
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
    public static string CreateHubClient(string hubName, string methods, string callbacks, string types)
    {
        const string hubClientTemplate = """
                                         import type { HubConnection } from "@microsoft/signalr";

                                         {{types}}

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
            .Replace("{{types}}", types)
            .Replace("{{hubClientName}}", hubName)
            .Replace("{{methods}}", methods)
            .Replace("{{callbacks}}", callbacks);
    }
}