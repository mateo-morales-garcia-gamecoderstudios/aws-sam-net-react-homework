using System.Text.Json;

using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;
using MongoDB.Driver;
using MongoDB.Bson;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace RewardDeleter;

public class Function
{

    private static readonly IMongoClient dbClient;
    private static readonly IMongoDatabase db;

    static Function()
    {
        // Recommended: Use AWS Secrets Manager for connection string // todo: how to stet up this?
        var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL") ?? throw new Exception("Missing DATABASE_URL configuration"); ;
        dbClient = new MongoClient(connectionString);
        db = dbClient.GetDatabase("rewards");
    }

    public async Task<APIGatewayProxyResponse> FunctionHandler(APIGatewayProxyRequest request, ILambdaContext context)
    {
        if (request.PathParameters.TryGetValue("id", out var rawId) && ObjectId.TryParse(rawId, out var objectId))
        {
            var rewardRepository = new RewardRepository.Repository(db);
            var ok = await rewardRepository.DeleteAsync(objectId);

            return new APIGatewayProxyResponse
            {
                StatusCode = 200,
                Body = JsonSerializer.Serialize(new { ok }),
                Headers = new Dictionary<string, string> {
                    { "Content-Type", "application/json" },
                }
            };
        }
        return new APIGatewayProxyResponse { StatusCode = 400, Body = "Bad request" };
    }
}
