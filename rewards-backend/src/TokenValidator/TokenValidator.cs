using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace TokenValidator;

public class TokenValidator
{
    private static readonly string jwtSecret;
    static TokenValidator()
    {
        jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET") ?? throw new Exception("Missing JWT configuration");
    }
    public static string Validate(string? token)
    {
        if (string.IsNullOrEmpty(token) || !token.StartsWith("Bearer "))
        {
            throw new Exception("Unauthorized");
        }

        var jwt = token.Substring("Bearer ".Length).Trim();
        var key = Encoding.ASCII.GetBytes(jwtSecret);
        var tokenHandler = new JwtSecurityTokenHandler();

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

        return userId;
    }
}
