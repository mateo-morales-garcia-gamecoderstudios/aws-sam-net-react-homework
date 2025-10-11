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
    public static string ValidateFromHeaders(IDictionary<string, string>? headers)
    {
        if (headers == null)
        {
            throw new Exception("Unauthorized");
        }
        var cookieHeaderFound = headers.TryGetValue("Cookie", out var cookieHeader);
        if (!cookieHeaderFound)
        {
            throw new Exception("Unauthorized");
        }
        var jwtSession = GetCookieValue(cookieHeader, "JWT_SESSION");
        return Validate(jwtSession);
    }
    public static string Validate(string? jwt)
    {
        if (string.IsNullOrEmpty(jwt))
        {
            throw new Exception("Unauthorized");
        }

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
    public static string? GetCookieValue(string? cookieHeader, string cookieName)
    {
        if (cookieHeader == null)
        {
            return null;
        }

        var cookies = cookieHeader.Split(';');

        foreach (var cookie in cookies)
        {
            var parts = cookie.Trim().Split('=');
            if (parts.Length == 2 && parts[0] == cookieName)
            {
                return parts[1];
            }
        }

        return null;
    }
}
