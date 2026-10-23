using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SecureHybrid.Users.Infrastructure.Identity;
using SecureHybrid.Users.Infrastructure.Persistence.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SecureHybrid.Users.Infrastructure.Persistence
{
    //public sealed class AuthDbContext : IdentityUserContext<ApplicationUser, int>
    //{

    //    public DbSet<AppUserProfile> AppUserProfile => Set<AppUserProfile>();
    //    public AuthDbContext(DbContextOptions<AuthDbContext> options)
    //        : base(options)
    //    {
    //    }

    //    protected override void OnModelCreating(ModelBuilder builder)
    //    {
    //        base.OnModelCreating(builder);

    //        //builder.HasDefaultSchema("auth");

    //        //builder.Entity<ApplicationUser>(entity =>
    //        //{
    //        //    entity.HasIndex(user => user.AppUserId).IsUnique();
    //        //});


    //        builder.Entity<AppUserProfile>(entity =>
    //        {
    //            entity.HasKey(p => p.UserId);
    //            entity.ToTable("AppUser", "rpt", table => table.ExcludeFromMigrations());

    //            entity.Property(x=>x.UserId).HasColumnName("UserId");
    //            entity.Property(x=>x.IsActive).HasColumnName("IsActive");
    //        });
    //    }
    //}

    public sealed class AuthDbContext : IdentityDbContext<ApplicationUser, IdentityRole<int>, int>
    {
        public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options) { }

        public DbSet<AppUserProfile> AppUserProfile => Set<AppUserProfile>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Identity ki saari tables auth schema mein
            builder.HasDefaultSchema("auth");

            builder.Entity<ApplicationUser>(entity =>
            {
                entity.HasIndex(u => u.AppUserId).IsUnique();
            });

            // Purani table: sirf parhi jaayegi, migration isay nahi chhooyegi
            builder.Entity<AppUserProfile>(entity =>
            {
                entity.HasKey(p => p.UserId);
                entity.ToTable("AppUser", "rpt", t => t.ExcludeFromMigrations());
            });
        }
    }
}
