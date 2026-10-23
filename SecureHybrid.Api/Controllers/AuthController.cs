using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecureHybrid.Contracts.Auth;
using SecureHybrid.Platform.Security;
using SecureHybrid.Users.Application.Abstractions;
using SecureHybrid.Users.Infrastructure.Identity;
using SecureHybrid.Users.Infrastructure.Persistence;

namespace SecureHybrid.Api.Controllers
{

    [ApiController]
    [Route("api/auth")]
    public sealed class AuthController(
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager,
    AuthDbContext db,
    IJwtTokenService jwt,
    IWebHostEnvironment env) : ControllerBase
    {
        public sealed record LoginRequest(string UserNameOrEmail, string Password);

        //[HttpPost("login")]
        //[AllowAnonymous]
        //public async Task<IActionResult> Login(LoginRequest request)
        //{
        //    // 1. Identity account dhoondo (auth.AspNetUsers)
        //    var user = await userManager.FindByNameAsync(request.UserNameOrEmail)
        //               ?? await userManager.FindByEmailAsync(request.UserNameOrEmail);

        //    // User na mile ya password ghalat ho, dono par ek hi message,
        //    // taake koi andaaza na laga sake ke kaunse usernames mojood hain
        //    if (user is null)
        //        return Unauthorized("Username ya password ghalat hai.");

        //    // 2. Password check, 5 ghalat koshishon ke baad 15 minute lock
        //    var result = await signInManager.CheckPasswordSignInAsync(
        //        user, request.Password, lockoutOnFailure: true);

        //    if (result.IsLockedOut)
        //        return Unauthorized("Account 15 minute ke liye lock hai.");
        //    if (!result.Succeeded)
        //        return Unauthorized("Username ya password ghalat hai.");

        //    // 3. rpt.AppUser check: row mojood ho aur IsActive true ho
        //    var isActive = await db.AppUserProfile
        //        .AsNoTracking()
        //        .AnyAsync(p => p.UserId == user.AppUserId && p.IsActive);

        //    if (!isActive)
        //        return StatusCode(StatusCodes.Status403Forbidden, "Ye user inactive hai.");

        //    // 4. Token banao
        //    var roles = await userManager.GetRolesAsync(user);
        //    var token = jwt.CreateAccessToken(user.AppUserId.ToString(), user.Email!, roles);   // apne JwtTokenService ke method ke mutabiq badlein

        //    return Ok(new { token });
        //}
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            const string invalid = "Email ya password ghalat hai.";

            // 1. rpt.AppUser mein email dhoondo
            var profile = await db.AppUserProfile.AsNoTracking()
                .SingleOrDefaultAsync(p => p.Email == request.UserNameOrEmail.Trim());
            if (profile is null) return Unauthorized(invalid);

            // 2. Is profile ka login account (auth.AspNetUsers)
            var user = await userManager.Users
                .SingleOrDefaultAsync(u => u.AppUserId == profile.UserId);
            if (user is null) return Unauthorized(invalid);

            // 3. Password + lockout
            var result = await signInManager.CheckPasswordSignInAsync(
                user, request.Password, lockoutOnFailure: true);
            if (result.IsLockedOut) return Unauthorized("Account 15 minute ke liye lock hai.");
            if (!result.Succeeded) return Unauthorized(invalid);

            // 4. Active hai? (password sahi hone ke baad check, taake inactive accounts ka pata na chale)
            if (!profile.IsActive)
                return StatusCode(StatusCodes.Status403Forbidden, "Ye user inactive hai.");

            // 5. Token
            var roles = Array.Empty<string>();//await userManager.GetRolesAsync(user);
            var token = jwt.CreateAccessToken(user.AppUserId.ToString(), user.Email!, roles);    // apne JwtTokenService ke method ke mutabiq

            return Ok(new { token, profile.DisplayName });
        }

        public sealed record CreateAccountRequest(string Email, string Password);

        [HttpPost("create-account")]
        [AllowAnonymous]
        public async Task<IActionResult> CreateAccount(CreateAccountRequest request)
        {
            // Abhi sirf local testing ke liye. Baad mein [Authorize(Policy = SecurityPolicies.AdminOnly)] lagayein
            if (!env.IsDevelopment()) return NotFound();

            var email = request.Email.Trim();

            var profile = await db.AppUserProfile.AsNoTracking()
                .SingleOrDefaultAsync(p => p.Email == email);
            if (profile is null)
                return NotFound("Ye email rpt.AppUser mein nahi hai.");

            if (await userManager.Users.AnyAsync(u => u.AppUserId == profile.UserId))
                return Conflict("Is user ka account pehle se bana hua hai.");

            var user = new ApplicationUser
            {
                UserName = profile.Email,
                Email = profile.Email,
                DisplayName = profile.DisplayName,
                AppUserId = profile.UserId,
                EmailConfirmed = true,
            };

            // CreateAsync password ko hash karta hai aur NormalizedEmail khud bharta hai
            var result = await userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors.Select(e => e.Description));
            //await userManager.AddToRoleAsync(user, "Admin");
            return Ok("Account ban gaya. Ab login karein.");
        }
    }
    //[ApiController]
    //[Route("api/auth")]
    //public sealed class AuthController : ControllerBase
    //{
    //    //public IActionResult Index()
    //    //{
    //    //    return View();
    //    //}

    //    private readonly UserManager<ApplicationUser> _userManager;
    //    private readonly SignInManager<ApplicationUser> _signInManager;
    //    private readonly IAppUserProfileReader _userProfileReader;
    //    private readonly IJwtTokenService _jwtTokenService;

    //    public AuthController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IAppUserProfileReader userProfileReader, IJwtTokenService jwtTokenService)
    //    {
    //        _userManager = userManager;
    //        _signInManager = signInManager;
    //        _userProfileReader = userProfileReader;
    //        _jwtTokenService = jwtTokenService;
    //    }

    //    [AllowAnonymous]
    //    [HttpPost("login")]
    //    public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
    //    {
    //        var user = await _userManager.FindByEmailAsync(request.Email);
    //        if (user is null)
    //            return Unauthorized(new { message = "Email or Password is wrong" });

    //        var passwordCheck = await _signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: true);

    //        if (!passwordCheck.Succeeded)
    //        {
    //            return Unauthorized(new { message = "Email or Password is wrong" });
    //        }
    //        // Agla kaam: rpt.AppUser ka IsActive check karke JWT banana.
    //        //return Unauthorized();

    //        // 1. rpt.AppUser mein linked account active hai ya nahi

    //        if (!await _userProfileReader.IsActiveAsync(user.AppUserId,cancellationToken: default))
    //        {
    //            return Unauthorized(new { message = "Email ya password ghalat hai" });
    //        }

    //        // 2. JWT banayein
    //        var token = _jwtTokenService.CreateAccessToken(
    //            user.AppUserId.ToString(),
    //            user.Email!,Enumerable.Empty<string>());

    //        return Ok(new LoginResponse(token));


    //    }
    //}
}
