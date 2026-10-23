using System;
using System.Collections.Generic;
using System.Text;

namespace SecureHybrid.Platform.Security
{
    public sealed record JwtOptions(
        string Issuer,
        string Audience,
        int AccessTokenMinutes
        );
}
