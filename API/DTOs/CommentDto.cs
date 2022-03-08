using System;

namespace API.DTOs
{
	public class CommentDto
	{
		public string Content { get; set; }
		public DateTime CommentPosted { get; set; }
		public string CommentUsername { get; set; }
		public int CommentUserId { get; set; }
	}
}