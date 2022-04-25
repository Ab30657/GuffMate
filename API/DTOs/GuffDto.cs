using System;
using System.Collections.Generic;

namespace API.DTOs
{
	public class GuffDto
	{
		public int Id { get; set; }
		public ICollection<CommentDto> Comments { get; set; }
		public ICollection<LikeDto> LikedUsers { get; set; }
		public DateTime DatePosted { get; set; }
		public string GuffContent { get; set; }
	}
}