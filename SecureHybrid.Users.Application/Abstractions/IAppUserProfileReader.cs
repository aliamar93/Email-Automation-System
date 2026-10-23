using System;
using System.Collections.Generic;
using System.Text;

namespace SecureHybrid.Users.Application.Abstractions
{
    public interface IAppUserProfileReader
    {
        Task<bool> IsActiveAsync(int appUserId,CancellationToken cancellationToken=default);
    }
}
