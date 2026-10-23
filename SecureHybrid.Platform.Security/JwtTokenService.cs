using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

namespace SecureHybrid.Platform.Security
{
    public sealed class JwtTokenService : IJwtTokenService
    {
        private readonly JwtOptions _options;
        private readonly SymmetricSecurityKey _signingKey;


        public JwtTokenService(JwtOptions options, SymmetricSecurityKey signingKey)
        {
            _options = options;
            _signingKey = signingKey;
        }


        public string CreateAccessToken(string userId, string email, IEnumerable<string> roles)
        {
            var now = DateTime.UtcNow;

            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Sub,userId),
                new(JwtRegisteredClaimNames.Email,email),
                new(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString())
            };

            claims.AddRange(
                roles.Select(role => new Claim(ClaimTypes.Role, role)));

            var credentials =new SigningCredentials(_signingKey,SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _options.Issuer,
                audience: _options.Audience,
                claims: claims,
                notBefore: now,
                expires: now.AddMinutes(_options.AccessTokenMinutes),
                signingCredentials: credentials
                );


            return new JwtSecurityTokenHandler().WriteToken(token);
                

        }
    }
}
