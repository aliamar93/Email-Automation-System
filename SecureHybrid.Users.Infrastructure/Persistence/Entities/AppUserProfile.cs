using System;
using System.Collections.Generic;
using System.Text;

namespace SecureHybrid.Users.Infrastructure.Persistence.Entities
{
    public sealed class AppUserProfile
    {
        public int UserId { get; set; }
        public string UserPrincipal { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public string? Initials { get; set; }
        public string? Department { get; set; }
        public bool IsActive { get; set; }
        public DateTime? LastLoginAtUtc { get; set; }
        public DateTime CreatedAtUtc { get; set; }
    }
}
