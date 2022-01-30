using System;
using API.Entities;

namespace API.DTOs
{
	public class FriendDto
	{
		public string Username { get; set; }
		public string Name { get; set; }
		public RequestFlag Status { get; set; }
		public string Gender { get; set; }
		public string PhotoUrl { get; set; }
		public string LatestMessage { get; set; }
		public DateTime? LatestMessageSent { get; set; }

	}
}