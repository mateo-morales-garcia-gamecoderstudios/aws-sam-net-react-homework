using System.Text.Json;
using System.Text.Json.Serialization;

public class LoginRequest : IJsonOnDeserialized
{
    public required string Email { get; set; }
    public required string Password { get; set; }

    public void OnDeserialized()
    {
        if (Email is null)
        {
            throw new JsonException($"Required property 'Email' must have a non-null value.");
        }
        if (Password is null)
        {
            throw new JsonException($"Required property 'Password' must have a non-null value.");
        }
    }
}
