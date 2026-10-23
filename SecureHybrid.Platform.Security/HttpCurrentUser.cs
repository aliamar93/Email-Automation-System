using Microsoft.AspNetCore.Http;
using SecureHybrid.SharedKernel.Security;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;

namespace SecureHybrid.Platform.Security
{
    internal sealed class HttpCurrentUser : ICurrentUser
    {
        private readonly IHttpContextAccessor _httpcontextAccessor;
        public HttpCurrentUser(IHttpContextAccessor httpcontextAccessor)
        {
            _httpcontextAccessor = httpcontextAccessor;
        }


        private ClaimsPrincipal? User => _httpcontextAccessor.HttpContext?.User;
        public bool IsAuthenticated => User?.Identity?.IsAuthenticated == true;

        public string? UserId =>
            User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? User?.FindFirst("sub")?.Value;

        public IReadOnlyCollection<string> Roles =>
            User?.Claims.Where(claim => claim.Type == ClaimTypes.Role || claim.Type == "role" || claim.Type == "roles")
            .Select(claim => claim.Value)
            .Distinct(StringComparer.Ordinal)
            .ToArray()
            ?? Array.Empty<string>();
    }
}
