using Microsoft.AspNetCore.Identity;

namespace SecureHybrid.Users.Infrastructure.Identity
{
    public sealed class ApplicationUser : IdentityUser<int>
    {

        // Is account ko existing rpt.AppUser row se joray ga.
        public int AppUserId { get; set; }
        public string DisplayName { get; set; } = string.Empty;
    }
}
