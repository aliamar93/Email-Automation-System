using Microsoft.EntityFrameworkCore;
using SecureHybrid.Users.Application.Abstractions;
using System;
using System.Collections.Generic;
using System.Text;

namespace SecureHybrid.Users.Infrastructure.Persistence
{
    public sealed class AppUserProfileReader :IAppUserProfileReader
    {
        private readonly AuthDbContext _db;


        public AppUserProfileReader(AuthDbContext db) { 
        
        _db = db;
        }


        public Task<bool> IsActiveAsync(int appUserId, CancellationToken cancellationToken = default)
        {
            return _db.AppUserProfile.AsNoTracking()
                .AnyAsync(user =>user.UserId== appUserId && user.IsActive,cancellationToken);
        }
    }
}
