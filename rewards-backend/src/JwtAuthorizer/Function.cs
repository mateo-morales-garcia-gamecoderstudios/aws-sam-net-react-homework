using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;


// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace JwtAuthorizer;

public class Function
{
    public static APIGatewayCustomAuthorizerResponse AuthorizerHandler(APIGatewayCustomAuthorizerRequest request)
    {
        try
        {
            // this function throws an error if the token is not valid
            var userId = TokenValidator.TokenValidator.ValidateFromHeaders(request.Headers);

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
            throw new Exception("Unauthorized");
        }
    }

}
