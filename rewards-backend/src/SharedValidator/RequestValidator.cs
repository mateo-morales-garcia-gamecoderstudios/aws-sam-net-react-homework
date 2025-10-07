using System.Net;
using System.Text.Json;
using Amazon.Lambda.APIGatewayEvents;

namespace SharedValidator;

public class RequestValidator
{
    public static (T? Data, APIGatewayProxyResponse? ErrorResponse) ValidateAndDeserialize<T>(string jsonBody) where T : class
    {
        try
        {
            T? data = JsonSerializer.Deserialize<T>(jsonBody);
            if (data == null)
            {
                return (null, CreateErrorResponse("Request body is empty or invalid.", HttpStatusCode.BadRequest));
            }
            return (data, null);
        }
        catch (JsonException ex)
        {
            // Catch the exception if the JSON is malformed
            string errorMessage = $"Invalid JSON format: {ex.Message}";
            return (null, CreateErrorResponse(errorMessage, HttpStatusCode.BadRequest));
        }
        catch (Exception ex)
        {
            // Catch any other unexpected exceptions
            string errorMessage = $"An unexpected error occurred during processing: {ex.Message}";
            return (null, CreateErrorResponse(errorMessage, HttpStatusCode.InternalServerError));
        }
    }

    private static APIGatewayProxyResponse CreateErrorResponse(string message, HttpStatusCode statusCode)
    {
        return new APIGatewayProxyResponse
        {
            StatusCode = (int)statusCode,
            Body = JsonSerializer.Serialize(new { Error = message }),
            Headers = new Dictionary<string, string> { { "Content-Type", "application/json" } }
        };
    }
}
