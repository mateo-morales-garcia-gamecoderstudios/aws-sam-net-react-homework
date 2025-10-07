using System.Text.Json;

using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;
using MongoDB.Driver;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace RewardsReader;

public class Function
{

    private static readonly IMongoClient dbClient;
    private static readonly IMongoDatabase db;

    private static readonly string jwtSecret;

    static Function()
    {
        // Recommended: Use AWS Secrets Manager for connection string // todo: how to stet up this?
        var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL") ?? throw new Exception("Missing DATABASE_URL configuration"); ;
        dbClient = new MongoClient(connectionString);
        db = dbClient.GetDatabase("rewards");
    }

    public async Task<APIGatewayProxyResponse> FunctionHandler(APIGatewayProxyRequest request, ILambdaContext context)
    {
        // var rewardsCollection = db.GetCollection<User>("rewards");

        var body = new Dictionary<string, string>
        {
            { "message", "hello from rewards" },
        };

        return new APIGatewayProxyResponse
        {
            StatusCode = 200,
            Body = JsonSerializer.Serialize(body),
            Headers = new Dictionary<string, string> {
                { "Content-Type", "application/json" },
            }
        };
    }
}
