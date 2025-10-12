using System.Text.Json;
using System.Text.Json.Serialization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;

namespace RewardRepository;

public class RewardEntity : IJsonOnDeserialized
{
    [BsonId(IdGenerator = typeof(StringObjectIdGenerator))]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public required double Price { get; set; }
    public required string Category { get; set; }
    public required string ImageUrl { get; set; }
    public virtual void OnDeserialized()
    {
        if (string.IsNullOrWhiteSpace(Name))
        {
            throw new JsonException($"Required property 'Name' must have a non-null value.");
        }
        if (string.IsNullOrWhiteSpace(Description))
        {
            throw new JsonException($"Required property 'Description' must have a non-null value.");
        }
        if (Price <= 0)
        {
            throw new JsonException($"Required property 'Price' be greater than 0.");
        }
        if (string.IsNullOrWhiteSpace(Category))
        {
            throw new JsonException($"Required property 'Category' must have a non-null value.");
        }
        if (string.IsNullOrWhiteSpace(ImageUrl))
        {
            throw new JsonException($"Required property 'ImageUrl' must have a non-null value.");
        }
    }
    public RewardDto ToDto()
    {
        return new RewardDto
        {
            Id = Id != null ? Id.ToString() : "",
            Name = Name,
            Description = Description,
            Price = Price,
            Category = Category,
            ImageUrl = ImageUrl,
        };
    }
}

public class RewardUpdateObject : RewardEntity
{
    public override void OnDeserialized()
    {
        base.OnDeserialized();
        if (Id == null)
        {
            throw new JsonException($"Required property 'Id' must have a non-null value.");
        }
    }
}

public class RewardDto
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public required double Price { get; set; }
    public required string Category { get; set; }
    public required string ImageUrl { get; set; }
}
