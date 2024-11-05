using TypescriptModelGenerator;

namespace TypescriptModelGeneratorTests;

public record NullableTypesModel
{
    public required bool? SomeNullableBoolean { get; init; }
    public required string? SomeNullableString { get; init; }
    public required int? SomeNullableInt { get; init; }
    public required DateTime? SomeNullableDateTime { get; init; }
    public required DateTimeOffset? SomeNullableDateTimeOffset { get; init; }
}

public record TypesModel
{
    public required bool SomeBoolean { get; init; }
    public required string SomeString { get; init; }
    public required int SomeInt { get; init; }
    public required DateTime SomeDateTime { get; init; }
    public required DateTimeOffset SomeDateTimeOffset { get; init; }
}

public record NullableBooleanModel
{
    public required bool? SomeNullableBoolean { get; init; }
}

public record NestedTypesModel
{
    public required bool SomeNullableBoolean { get; init; }
    public required TypesModel Types { get; init; }
    public required TypesModel? AlsoTypesNullable { get; init; }
}

public record TypeWithList
{
    public required List<TypesModel> TypesList { get; init; }
}

public class TestSomething
{
    private static string TestConvertSingleType(Type model)
    {
        var types = new Dictionary<string, string>();
        TypeScriptModelGenerator.ConvertRecursive(model, types);
        return types.Single().Value;
    }


    [TestCase]
    public void NullableBoolean()
    {
        var actual = TestConvertSingleType(typeof(NullableBooleanModel));

        const string expected =
            """
            export type NullableBooleanModel = {
              someNullableBoolean: boolean | null;
            };
            """;

        Assert.That(actual, Is.EqualTo(expected));
    }


    [TestCase]
    public void Properties()
    {
        var actual = TestConvertSingleType(typeof(TypesModel));

        const string expected =
            """
            export type TypesModel = {
              someBoolean: boolean;
              someString: string;
              someInt: number;
              someDateTime: string;
              someDateTimeOffset: string;
            };
            """;

        Assert.That(actual, Is.EqualTo(expected));
    }


    [TestCase]
    public void NullableProperties()
    {
        var actual = TestConvertSingleType(typeof(NullableTypesModel));

        const string expected =
            """
            export type NullableTypesModel = {
              someNullableBoolean: boolean | null;
              someNullableString: string | null;
              someNullableInt: number | null;
              someNullableDateTime: string | null;
              someNullableDateTimeOffset: string | null;
            };
            """;

        Assert.That(actual, Is.EqualTo(expected));
    }

    [TestCase]
    public void NestedTypesModel()
    {
        var types = new Dictionary<string, string>();
        TypeScriptModelGenerator.ConvertRecursive(typeof(NestedTypesModel), types);

        const string expectedType =
            """
            export type NestedTypesModel = {
              someNullableBoolean: boolean;
              types: TypesModel;
              alsoTypesNullable: TypesModel | null;
            };
            """;

        const string expectedNestedType =
            """
            export type TypesModel = {
              someBoolean: boolean;
              someString: string;
              someInt: number;
              someDateTime: string;
              someDateTimeOffset: string;
            };
            """;

        Assert.Multiple(() =>
        {
            Assert.That(types, Has.Count.EqualTo(2));
            Assert.That(types["NestedTypesModel"], Is.EqualTo(expectedType));
            Assert.That(types["TypesModel"], Is.EqualTo(expectedNestedType));
        });
    }

    [TestCase]
    public void ListTypesModel()
    {
        var types = new Dictionary<string, string>();
        TypeScriptModelGenerator.ConvertRecursive(typeof(TypeWithList), types);

        const string expectedTypesModel =
            """
            export type TypesModel = {
              someBoolean: boolean;
              someString: string;
              someInt: number;
              someDateTime: string;
              someDateTimeOffset: string;
            };
            """;

        const string expectedTypeWithListModel =
            """
            export type TypeWithList = {
              typesList: TypesModel[];
            };
            """;

        Assert.Multiple(() =>
        {
            Assert.That(types, Has.Count.EqualTo(2));
            Assert.That(types["TypesModel"], Is.EqualTo(expectedTypesModel));
            Assert.That(types["TypeWithList"], Is.EqualTo(expectedTypeWithListModel));
        });
    }
}