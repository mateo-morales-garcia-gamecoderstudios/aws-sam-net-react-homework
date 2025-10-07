using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;


// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace JwtAuthorizer;

public class Function
{
    private static readonly string jwtSecret;

    static Function()
    {
        jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET") ?? throw new Exception("Missing JWT configuration");
    }

    public static APIGatewayCustomAuthorizerResponse AuthorizerHandler(APIGatewayCustomAuthorizerRequest request)
    {
        var token = request.AuthorizationToken;
        if (string.IsNullOrEmpty(token) || !token.StartsWith("Bearer "))
        {
            throw new Exception("Unauthorized");
        }

        var jwt = token.Substring("Bearer ".Length).Trim();
        var key = Encoding.ASCII.GetBytes(jwtSecret);
        var tokenHandler = new JwtSecurityTokenHandler();

        try
        {
            // 1. Validate the JWT
            tokenHandler.ValidateToken(jwt, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false, // Set to true if you have an issuer
                ValidateAudience = false, // Set to true if you have an audience
                ClockSkew = TimeSpan.Zero // No grace period for expiration
            }, out SecurityToken validatedToken);

            var jwtToken = (JwtSecurityToken)validatedToken;
            var userId = jwtToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                throw new Exception("Unauthorized");
            }

            // 2. If valid, return an IAM policy allowing access
            return new APIGatewayCustomAuthorizerResponse
            {
                PrincipalID = userId,
                PolicyDocument = new APIGatewayCustomAuthorizerPolicy
                {
                    Version = "2012-10-17",
                    Statement = new List<APIGatewayCustomAuthorizerPolicy.IAMPolicyStatement>
                    {
                        new APIGatewayCustomAuthorizerPolicy.IAMPolicyStatement
                        {
                            Action = new HashSet<string> { "execute-api:Invoke" },
                            Effect = "Allow",
                            Resource = new HashSet<string> { request.MethodArn } // Allow access to the requested resource
                        }
                    }
                }
            };
        }
        catch (Exception)
        {
            // 3. If invalid, throw an exception
            throw new Exception("Unauthorized");
        }
    }

}
