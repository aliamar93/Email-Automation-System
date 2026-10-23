using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SecureHybrid.Platform.Security;
using SecureHybrid.Platform.Security.DependencyInjection;
using SecureHybrid.Users.Infrastructure.DependencyInjection;
using SecureHybrid.Users.Infrastructure.Identity;
using SecureHybrid.Users.Infrastructure.Persistence;
using SecureHybrid.Users.Application.Abstractions;


var builder = WebApplication.CreateBuilder(args);





builder.Services.AddPlatformSecurity(builder.Configuration);

builder.Services.AddUsersInfrastructure(builder.Configuration);

var connectionString =
    builder.Configuration.GetConnectionString("UsersDb")
    ?? throw new InvalidOperationException(
        "Connection string 'UsersDb' appsettings.json mein nahin mili.");

builder.Services.AddDbContext<AuthDbContext>(options =>
    options.UseSqlServer(connectionString
        //builder.Configuration.GetConnectionString("UsersDb")
        ));


builder.Services
    .AddIdentityCore<ApplicationUser>(options =>
    {
        options.User.RequireUniqueEmail = true;
        options.Lockout.MaxFailedAccessAttempts = 5;
        options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
    })
    .AddRoles<IdentityRole<int>>()
    .AddEntityFrameworkStores<AuthDbContext>().AddSignInManager();
// Add services to the container.

builder.Services.AddScoped<IAppUserProfileReader, AppUserProfileReader>();
builder.Services.AddScoped<IJwtTokenService, SecureHybrid.Platform.Security.JwtTokenService>();

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

//using (var scope = app.Services.CreateScope())
//{
//    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();
//    if (!await roleManager.RoleExistsAsync("Admin"))
//        await roleManager.CreateAsync(new IdentityRole<int>("Admin"));
//}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint(
            "/openapi/v1.json",
            "SecureHybrid API v1");
    });
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapGet("/", () => "SecureHybrid API is running");
app.Run();
