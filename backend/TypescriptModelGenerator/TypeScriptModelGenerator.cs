using System.Collections;
using System.Reflection;

namespace TypescriptModelGenerator;

public static class TypeScriptModelGenerator
{
    private const string TypeTemplate =
        """
        export type {{typeName}} = {
        {{properties}}
        };
        """;

    private const string EnumTemplate = "export type {{typeName}} = {{values}};";

    private static readonly NullabilityInfoContext NullabilityInfoContext = new NullabilityInfoContext();


    /// <summary>
    /// Parse a method parameter and return its typescript type
    /// </summary>
    /// <returns>Either the primitive typescript type, or the name of complex type created</returns>
    public static string ParseParameterInfo(ParameterInfo parameterInfo, Dictionary<string, string> processedTypes) =>
        ParseType(parameterInfo.ParameterType, processedTypes,
            NullabilityInfoContext.Create(parameterInfo).WriteState is NullabilityState.Nullable);


    /// <summary>
    /// Parse a property and return its typescript type
    /// </summary>
    /// <returns>Either the primitive typescript type, or the name of complex type created</returns>
    private static string ParsePropertyInfo(PropertyInfo propertyInfo, Dictionary<string, string> processedTypes) =>
        ParseType(propertyInfo.PropertyType, processedTypes,
            NullabilityInfoContext.Create(propertyInfo).WriteState is NullabilityState.Nullable);


    /// <summary>
    /// Parse a type and return its typescript type
    /// </summary>
    /// <returns>Either the primitive typescript type, or the name of complex type created</returns>
    public static string ParseType(
        Type inputType,
        Dictionary<string, string> processedTypes,
        bool nullableRefType = false)
    {
        var (type, isNullableType) = GetTypeAndNullable(inputType);

        var arrayType = "";
        if (typeof(IList).IsAssignableFrom(type) ||
            (typeof(IEnumerable).IsAssignableFrom(type) && type != typeof(string)))
        {
            arrayType = "[]";
            type = type.GenericTypeArguments.First();
        }

        var typeName = ParseTypeRecursively(type, processedTypes);

        return typeName + arrayType + (isNullableType || nullableRefType ? " | null" : "");
    }


    /// <summary>
    /// Recursively convert a type into typescript types
    /// </summary>
    /// <returns>The primitive type or the name of the complex type</returns>
    public static string ParseTypeRecursively(Type type, Dictionary<string, string> processedTypes)
    {
        if (TryToTypescriptPrimitiveType(type, out var primitiveType))
        {
            return primitiveType;
        }

        // If we already have seen this type before, just return the name
        if (processedTypes.ContainsKey(type.Name))
        {
            return type.Name;
        }

        // New type which hasnt been seen before, recursively add bits of it to the processed types
        if (type.IsEnum)
        {
            var tsTypeDefinition = EnumTemplate
                .Replace("{{values}}", string.Join(" | ", type.GetEnumNames().Select(v => $"\"{v}\"")))
                .Replace("{{typeName}}", type.Name);

            processedTypes.Add(type.Name, tsTypeDefinition);
        }
        else if (type.IsClass)
        {
            var tsProperties = type.GetProperties()
                .Select(p => $"  {p.Name.ToCamelCase()}: {ParsePropertyInfo(p, processedTypes)};");

            var tsTypeDefinition = TypeTemplate
                .Replace("{{properties}}", string.Join("\n", tsProperties))
                .Replace("{{typeName}}", type.Name);

            processedTypes.Add(type.Name, tsTypeDefinition);
        }
        else
        {
            throw new ArgumentException($"What do we do with this?");
        }

        return type.Name;
    }


    /// <summary>
    /// Get the typescript primitive type from c# type if possible
    /// </summary>
    private static bool TryToTypescriptPrimitiveType(Type type, out string primitiveType)
    {
        primitiveType = type switch
        {
            // todo more?
            not null when type == typeof(bool) => "boolean",
            not null when type == typeof(byte) => "number",
            not null when type == typeof(sbyte) => "number",
            not null when type == typeof(short) => "number",
            not null when type == typeof(ushort) => "number",
            not null when type == typeof(int) => "number",
            not null when type == typeof(uint) => "number",
            not null when type == typeof(long) => "number",
            not null when type == typeof(ulong) => "number",
            not null when type == typeof(float) => "number",
            not null when type == typeof(double) => "number",
            not null when type == typeof(decimal) => "number",
            not null when type == typeof(string) => "string",
            not null when type == typeof(char) => "string",
            not null when type == typeof(DateTime) => "string",
            not null when type == typeof(DateTimeOffset) => "string",
            _ => "unknown"
        };

        return primitiveType != "unknown";
    }


    /// <summary>
    /// Tries to figure out if this is some kind of a nullable value type
    /// </summary>
    private static (Type type, bool isNullable) GetTypeAndNullable(Type type)
    {
        var maybeUnderlyingType = Nullable.GetUnderlyingType(type);

        return maybeUnderlyingType != null
            ? (maybeUnderlyingType, true)
            : (type, false);
    }
}