using System;

namespace API.DTOs
{
	public class CommentDto
	{

		public string Content { get; set; }
		public DateTime CommentPosted { get; set; }
		public string CommenterUsername { get; set; }
		public int CommenterId { get; set; }
	}
}