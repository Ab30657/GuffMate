using API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using System;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Metadata;

namespace API.Data
{
	public class DataContext : IdentityDbContext<AppUser, AppRole, int, IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>, IdentityRoleClaim<int>, IdentityUserToken<int>>
	{
		public DbSet<Interest> Interests { get; set; }
		public DbSet<UserFriend> Friends { get; set; }
		public DbSet<Message> Messages { get; set; }
		public DbSet<Group> Groups { get; set; }
		public DbSet<Connection> Connections { get; set; }
		public DbSet<UserLikePost> Likes { get; set; }
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

			builder.Entity<UserFriend>().HasKey(x => new { x.ReqSenderUserId, x.ReqReceiverUserId });

			builder.Entity<UserFriend>().HasOne(x => x.ReqSenderUser).WithMany(x => x.FriendsAdded).HasForeignKey(x => x.ReqSenderUserId).OnDelete(DeleteBehavior.Cascade);
			builder.Entity<UserFriend>().HasOne(x => x.ReqReceiverUser).WithMany(x => x.FriendsOf).HasForeignKey(x => x.ReqReceiverUserId).OnDelete(DeleteBehavior.Cascade);

			builder.Entity<Message>().HasOne(x => x.Recipient).WithMany(x => x.MessagesReceived).OnDelete(DeleteBehavior.Restrict);
			builder.Entity<Message>().HasOne(x => x.Sender).WithMany(x => x.MessagesSent).OnDelete(DeleteBehavior.Restrict);

			builder.Entity<UserLikePost>().HasKey(x => new { x.UserId, x.GuffId });

			builder.Entity<UserLikePost>().HasOne(x => x.User).WithMany(x => x.GuffsLiked).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
			builder.Entity<UserLikePost>().HasOne(x => x.Guff).WithMany(x => x.LikedUsers).HasForeignKey(x => x.GuffId).OnDelete(DeleteBehavior.Cascade);

			builder.ApplyUtcDateTimeConverter();
		}
	}

	public static class UtcDateAnnotation
	{
		private const String IsUtcAnnotation = "IsUtc";
		private static readonly ValueConverter<DateTime, DateTime> UtcConverter =
		  new ValueConverter<DateTime, DateTime>(v => v, v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

		private static readonly ValueConverter<DateTime?, DateTime?> UtcNullableConverter =
		  new ValueConverter<DateTime?, DateTime?>(v => v, v => v == null ? v : DateTime.SpecifyKind(v.Value, DateTimeKind.Utc));

		public static PropertyBuilder<TProperty> IsUtc<TProperty>(this PropertyBuilder<TProperty> builder, Boolean isUtc = true) =>
		  builder.HasAnnotation(IsUtcAnnotation, isUtc);

		public static Boolean IsUtc(this IMutableProperty property) =>
		  ((Boolean?)property.FindAnnotation(IsUtcAnnotation)?.Value) ?? true;

		/// <summary>
		/// Make sure this is called after configuring all your entities.
		/// </summary>
		public static void ApplyUtcDateTimeConverter(this ModelBuilder builder)
		{
			foreach (var entityType in builder.Model.GetEntityTypes())
			{
				foreach (var property in entityType.GetProperties())
				{
					if (!property.IsUtc())
					{
						continue;
					}

					if (property.ClrType == typeof(DateTime))
					{
						property.SetValueConverter(UtcConverter);
					}

					if (property.ClrType == typeof(DateTime?))
					{
						property.SetValueConverter(UtcNullableConverter);
					}
				}
			}
		}
	}
}