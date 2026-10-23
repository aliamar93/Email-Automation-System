using System;
using System.Collections.Generic;
using System.Text;

namespace SecureHybrid.Platform.Security
{
    public  interface IJwtTokenService
    {
        string CreateAccessToken(
            string userId,
            string email,
            IEnumerable<string> roles
            );
    }
}
