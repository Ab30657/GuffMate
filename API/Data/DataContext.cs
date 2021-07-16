using API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace API.Data
{
	public class DataContext : IdentityDbContext<AppUser, AppRole, int, IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>, IdentityRoleClaim<int>, IdentityUserToken<int>>
	{
		public DbSet<Interest> Interests { get; set; }

		public DataContext(DbContextOptions options) : base(options)
		{
		}


		protected override void OnModelCreating(ModelBuilder builder)
		{
			base.OnModelCreating(builder);

			builder.Entity<AppUserInterest>().HasKey(sc => new { sc.InterestId, sc.UserId });

			builder.Entity<AppUser>().HasMany(ur => ur.UserRoles).WithOne(u => u.User).HasForeignKey(ur => ur.UserId).IsRequired();
			builder.Entity<AppRole>().HasMany(ur => ur.UserRoles).WithOne(u => u.Role).HasForeignKey(ur => ur.RoleId).IsRequired();

			builder.Entity<AppUser>().HasMany(x => x.UserInterests).WithOne(x => x.User).HasForeignKey(x => x.UserId).IsRequired();
			builder.Entity<Interest>().HasMany(x => x.UserInterests).WithOne(x => x.Interest).HasForeignKey(x => x.InterestId).IsRequired();
		}



	}
}