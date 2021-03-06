using System.Collections.Generic;

namespace API.DTOs
{
	public class UserDto
	{
		public string Username { get; set; }
		public string Name { get; set; }
		public string Token { get; set; }
		public string PhotoUrl { get; set; }
		public string Gender { get; set; }
		public bool EmailConfirmed { get; set; }
		public ICollection<FriendDto> Friends { get; set; }
	}
}