using System.Text.Json;
using System.Text.Json.Serialization;
using MongoDB.Bson;

namespace RewardRepository;

public class RewardEntity : IJsonOnDeserialized
{
    public ObjectId Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public required double Price { get; set; }
    public required string Category { get; set; }
    public required string ImageUrl { get; set; }
    public void OnDeserialized()
    {
        if (string.IsNullOrEmpty(Name.Trim()))
        {
            throw new JsonException($"Required property 'Name' must have a non-null value.");
        }
        if (string.IsNullOrEmpty(Description.Trim()))
        {
            throw new JsonException($"Required property 'Description' must have a non-null value.");
        }
        if (Price <= 0)
        {
            throw new JsonException($"Required property 'Price' be greater than 0.");
        }
        if (string.IsNullOrEmpty(Category.Trim()))
        {
            throw new JsonException($"Required property 'Category' must have a non-null value.");
        }
        if (string.IsNullOrEmpty(ImageUrl.Trim()))
        {
            throw new JsonException($"Required property 'ImageUrl' must have a non-null value.");
        }
    }
}
