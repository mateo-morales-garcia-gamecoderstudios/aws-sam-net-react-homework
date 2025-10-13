using System.Text.Json;

using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;
using MongoDB.Driver;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using SharedValidator;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace Login;

public class Function
{

    private static readonly IMongoClient dbClient;
    private static readonly IMongoDatabase db;

    private static readonly string jwtSecret;

    static Function()
    {
        jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET") ?? throw new Exception("Missing JWT configuration");

        // Recommended: Use AWS Secrets Manager for connection string // todo: how to stet up this?
        var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL") ?? throw new Exception("Missing DATABASE_URL configuration"); ;
        dbClient = new MongoClient(connectionString);
        db = dbClient.GetDatabase("rewards");
    }

    public async Task<APIGatewayProxyResponse> FunctionHandler(APIGatewayProxyRequest request, ILambdaContext context)
    {
        (LoginRequest? loginRequest, APIGatewayProxyResponse? error) = RequestValidator.ValidateAndDeserialize<LoginRequest>(request.Body);
        if (error is not null)
        {
            return error;
        }

        var usersCollection = db.GetCollection<User>("users");

        // 1. Find user in MongoDB
        var user = await usersCollection.Find(u => u.Email == loginRequest!.Email).FirstOrDefaultAsync();
        if (user == null || !VerifyPassword(loginRequest!.Password, user.HashedPassword))
        {
            return new APIGatewayProxyResponse { StatusCode = 401, Body = "Invalid credentials" };
        }

        // 2. Create JWT claims
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        // 3. Generate the JWT
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(jwtSecret);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(1), // Token expiration
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);

        var loginResponse = new LoginResponse { Token = tokenHandler.WriteToken(token) };
        var jsonResponse = JsonSerializer.Serialize(loginResponse);

        var cookieString = $"JWT_SESSION={loginResponse.Token}; HttpOnly; Secure; SameSite=None; Path=/; Expires={DateTime.UtcNow.AddMinutes(30).ToString("R")}";

        return new APIGatewayProxyResponse
        {
            StatusCode = 204,
            Body = { },
            Headers = new Dictionary<string, string> {
                { "Content-Type", "application/json" },
                { "Set-Cookie", cookieString }
            }
        };
    }

    private static bool VerifyPassword(string providedPassword, string storedHash)
    {
        return BCrypt.Net.BCrypt.Verify(providedPassword, storedHash);
    }

}
