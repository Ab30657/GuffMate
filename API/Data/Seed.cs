using System.Security.Cryptography;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using API.Interfaces;
using System.Linq;

namespace API.Data
{
	public class Seed
	{
		public static async Task SeedUsers(UserManager<AppUser> userManager, DataContext context)
		{
			if (await userManager.Users.AnyAsync())
			{
				context.Connections.RemoveRange(context.Connections);
				context.SaveChanges();
				return;
			}

			var userData = await System.IO.File.ReadAllTextAsync("Data/UserSeedData.json");
			var users = JsonSerializer.Deserialize<List<AppUser>>(userData);

			foreach (var user in users)
			{
				user.UserName = user.UserName.ToLower();
				await userManager.CreateAsync(user, "Pa$$w0rd");
			}
		}
	}
}