using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SecureHybrid.SharedKernel.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace SecureHybrid.Platform.Security.DependencyInjection
{

    public static class PlatformSecurityExtensions
    {
        public static IServiceCollection AddPlatformSecurity(this IServiceCollection services, IConfiguration configuration)
        {
            var issuer = configuration["Jwt:Issuer"];
            var audience = configuration["Jwt:Audience"];
            var signingKeyText = configuration["Jwt:SigningKey"];


            if (string.IsNullOrWhiteSpace(issuer))
                throw new InvalidOperationException("Jwt:Issuer is required");

            if (string.IsNullOrWhiteSpace(audience))
                throw new InvalidOperationException("Jwt:Audience is required");

            if (string.IsNullOrWhiteSpace(signingKeyText))
                throw new InvalidOperationException("Jwt:SigningKey is required");

            var keyBytes = Convert.FromBase64String(signingKeyText);

            if (keyBytes.Length < 32)
                throw new InvalidOperationException("Jwt:SigningKey must decode to at least 32 bytes.");


            var options = new JwtOptions(
                issuer,
                audience,
                AccessTokenMinutes: 15);


            var signingKey = new SymmetricSecurityKey(keyBytes);



            services.AddSingleton(options);
            services.AddSingleton(signingKey);
            services.AddScoped<IJwtTokenService, JwtTokenService>();


            services.AddHttpContextAccessor();
            services.AddScoped<SecureHybrid.SharedKernel.Security.ICurrentUser, HttpCurrentUser>();


            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(jwt =>
            {
                jwt.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = issuer,


                    ValidateAudience = true,
                    ValidAudience = audience,

                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = signingKey,

                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.FromSeconds(30)
                };
            });


            services.AddAuthorization(options =>
            {
                options.AddPolicy(SecurityPolicies.AdminOnly, policy => policy.RequireAuthenticatedUser().RequireRole("Admin", "Test"));
            });

            return services;
        }
    }
}


//Microsoft
//public static class PlatformSecurityExtensions
//{
//    public static IServiceCollection AddPlatformSecurity(
//        this IServiceCollection services,
//        IConfiguration configuration)
//    {
//        var authority = configuration["Authentication:Authority"];
//        var audience = configuration["Authentication:Audience"];

//        if (string.IsNullOrWhiteSpace(authority))
//        {
//            throw new InvalidOperationException(
//                "Authentication:Authority configuration is required.");
//        }

//        if (string.IsNullOrWhiteSpace(audience))
//        {
//            throw new InvalidOperationException(
//                "Authentication:Audience configuration is required.");
//        }

//        services.AddHttpContextAccessor();
//        services.AddScoped<ICurrentUser, HttpCurrentUser>();

//        services
//            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//            .AddJwtBearer(options =>
//            {
//                options.Authority = authority;
//                options.Audience = audience;
//                options.RequireHttpsMetadata = true;
//            });

//        services.AddAuthorization(options =>
//        {
//            options.AddPolicy(
//                SecurityPolicies.AdminOnly,
//                policy => policy
//                    .RequireAuthenticatedUser()
//                    .RequireRole("Admin"));
//        });

//        return services;
//    }
//}