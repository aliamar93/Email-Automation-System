using System;
using System.Collections.Generic;
using System.Text;

namespace SecureHybrid.Contracts.Users
{
    public sealed record UserResponse(
    int Id,
    string Email,
    string DisplayName
);
}
