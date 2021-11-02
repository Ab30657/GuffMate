using System;
using System.Collections.Generic;
using API.Entities;

namespace API.DTOs
{
	public class MemberDto
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public string Username { get; set; }
		public string PhotoUrl { get; set; }
		public string Gender { get; set; }
		public string Status { get; set; }
		public DateTime LastActive { get; set; }
		public ICollection<PhotoDto> Photos { get; set; }
		public ICollection<InterestDto> Interests { get; set; }
		public string PhoneNumber { get; set; }
		public bool TwoFactorEnabled { get; set; }
		public string Email { get; set; }
		public int[] Friends { get; set; }
		public RequestFlag FriendStatus { get; set; }
	}
}