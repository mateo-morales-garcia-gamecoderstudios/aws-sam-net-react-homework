using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Http;
using System.Text.Json;

using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace HelloWorld;

public class Function
{

    private readonly string _jwtSecret;
    private static readonly HttpClient client = new HttpClient();

    public Function()
    {
        Console.WriteLine("Function 😦");
        _jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET") ?? throw new Exception("Missing JWT configuration");
        Console.WriteLine(_jwtSecret + "😦");
    }

    private static async Task<string> GetCallingIP()
    {
        client.DefaultRequestHeaders.Accept.Clear();
        client.DefaultRequestHeaders.Add("User-Agent", "AWS Lambda .Net Client");

        var msg = await client.GetStringAsync("http://checkip.amazonaws.com/").ConfigureAwait(continueOnCapturedContext: false);

        return msg.Replace("\n", "");
    }

    public async Task<APIGatewayProxyResponse> FunctionHandler(APIGatewayProxyRequest apigProxyEvent, ILambdaContext context)
    {
        if (_jwtSecret == null)
        {
            return new APIGatewayProxyResponse
            {
                // Body = JsonSerializer.Serialize(), // invalid configuration
                StatusCode = 500,
                Headers = new Dictionary<string, string> { { "Content-Type", "application/json" } }
            };

        }

        // var location = await GetCallingIP();
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, "user.Id.ToString()"),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_jwtSecret);

        if (key.Length < 16) // 16 bytes = 128 bits
        {
            throw new ArgumentException("JWT secret key must be at least 128 bits (16 bytes) long.");
        }

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(1), // Token expiration
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        var loginResponse = new LoginResponse { Token = tokenHandler.WriteToken(token) };
        var jsonResponse = JsonSerializer.Serialize(loginResponse);

        var body = new Dictionary<string, string>
        {
            { "env", _jwtSecret },
            { "message", "hello world 2" },
            { "location", "todo" }
        };

        return new APIGatewayProxyResponse
        {
            Body = jsonResponse,//JsonSerializer.Serialize(body),
            StatusCode = 200,
            Headers = new Dictionary<string, string> { { "Content-Type", "application/json" } }
        };
    }
}

public class LoginResponse
{
    public required string Token { get; set; }
}