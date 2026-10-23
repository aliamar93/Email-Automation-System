using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SecureHybrid.Users.Infrastructure.Identity;
using SecureHybrid.Users.Infrastructure.Persistence;

namespace SecureHybrid.Users.Infrastructure.DependencyInjection
{
    public static class UsersInfrastructureExtensions
    {
        //public static IServiceCollection AddUsersInfrastructure(this IServiceCollection services, IConfiguration configuration)
        //{
        //    var connectionString = configuration.GetConnectionString("UsersDb");

        //    if (string.IsNullOrWhiteSpace(connectionString))
        //        throw new InvalidOperationException("ConnectionStrings:UsersDb is required.");

        //    services.AddDbContext<UsersDbContext>(options=>options.UseSqlServer(connectionString));

        //    services.AddIdentityCore<ApplicationUser>(options =>
        //    {
        //        options.User.RequireUniqueEmail = true;

        //        options.Password.RequiredLength = 12;
        //        options.Password.RequireDigit = true;
        //        options.Password.RequireLowercase = true;
        //        options.Password.RequireUppercase = true;
        //        options.Password.RequireNonAlphanumeric = true;

        //        options.Lockout.MaxFailedAccessAttempts = 5;
        //        options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
        //        options.Lockout.AllowedForNewUsers = true;
        //    })
        //        .AddRoles<IdentityRole<int>>()
        //        .AddEntityFrameworkStores<UsersDbContext>();

        //    return services;
        //}

        public static IServiceCollection AddUsersInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString =
                configuration.GetConnectionString("UsersDb");

            if (string.IsNullOrWhiteSpace(connectionString))
            {
                throw new InvalidOperationException(
                    "ConnectionStrings:UsersDb is required.");
            }

            services.AddDbContext<AuthDbContext>(options =>
                options.UseSqlServer(connectionString));

            services
                .AddIdentityCore<ApplicationUser>(options =>
                {
                    options.User.RequireUniqueEmail = true;

                    options.Password.RequiredLength = 12;
                    options.Password.RequireDigit = true;
                    options.Password.RequireLowercase = true;
                    options.Password.RequireUppercase = true;
                    options.Password.RequireNonAlphanumeric = true;

                    options.Lockout.MaxFailedAccessAttempts = 5;
                    options.Lockout.DefaultLockoutTimeSpan =
                        TimeSpan.FromMinutes(15);
                })
                .AddEntityFrameworkStores<AuthDbContext>();

            return services;
        }
    }
}
