using System;
using System.Collections.Generic;
using System.Text;

namespace SecureHybrid.SharedKernel.Security
{
    public interface ICurrentUser
    {
        bool IsAuthenticated { get; }
        string? UserId { get; }
        IReadOnlyCollection<string> Roles { get; }
    }
}
