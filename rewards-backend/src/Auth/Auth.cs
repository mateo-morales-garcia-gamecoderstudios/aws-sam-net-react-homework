using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace Auth;

public class Auth
{
    public async Task<APIGatewayProxyResponse> MeHandler(APIGatewayProxyRequest request, ILambdaContext context)
    {
        try
        {
            ThrowIfInvalidToken(request);
        }
        catch (Exception)
        {
            return new APIGatewayProxyResponse { StatusCode = 401, Body = "Unauthorized" };
        }

        return new APIGatewayProxyResponse { StatusCode = 200 };
    }
    public async Task<APIGatewayProxyResponse> LogoutHandler(APIGatewayProxyRequest request, ILambdaContext context)
    {
        try
        {
            ThrowIfInvalidToken(request);
        }
        catch (Exception)
        {
            return new APIGatewayProxyResponse { StatusCode = 401, Body = "Unauthorized" };
        }

        var cookieString = $"JWT_SESSION=; HttpOnly; Secure; SameSite=Strict; Path=/; Expires={DateTime.UnixEpoch.ToString("R")}";

        return new APIGatewayProxyResponse
        {
            StatusCode = 200,
            Headers = new Dictionary<string, string> {
                { "Set-Cookie", cookieString }
            }
        };
    }

    private static void ThrowIfInvalidToken(APIGatewayProxyRequest request)
    {
        if (request.Headers == null || request.Headers.TryGetValue("Authorization", out var authToken))
        {
            throw new Exception("Unauthorized");
        }
        // this function throws an error if the token is not valid
        _ = TokenValidator.TokenValidator.Validate(authToken);
    }

}
