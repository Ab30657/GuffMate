using System;
using System.Collections.Generic;

namespace API.DTOs
{
	public class MemberDto
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public string Username { get; set; }
		public string PhotoUrl { get; set; }
		public string KnownAs { get; set; }
		public string Gender { get; set; }
		public string Status { get; set; }
		public DateTime LastActive { get; set; }
		public ICollection<PhotoDto> Photos { get; set; }

	}
}