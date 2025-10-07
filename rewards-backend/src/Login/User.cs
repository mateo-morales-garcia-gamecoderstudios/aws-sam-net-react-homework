using MongoDB.Bson;

public class User
{
    public ObjectId Id { get; set; }
    public required string Email { get; set; }
    public required string HashedPassword { get; set; }
}
