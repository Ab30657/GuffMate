using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
	public class AppUser : IdentityUser<int>
	{
		public DateTime DateOfBirth { get; set; }

		public string Name { get; set; }

		public DateTime LastActive { get; set; } = DateTime.Now;
		public string Gender { get; set; }

		public string Status { get; set; }

		public ICollection<Photo> Photos { get; set; }

		public ICollection<AppUserRole> UserRoles { get; set; }
		public ICollection<AppUserInterest> UserInterests { get; set; }

		public ICollection<UserFriend> FriendsAdded { get; set; }
		public ICollection<UserFriend> FriendsOf { get; set; }

		public ICollection<Message> MessagesSent { get; set; }
		public ICollection<Message> MessagesReceived { get; set; }

	}
}