using System;

namespace API.DTOs
{
	public class CommentDto
	{
		public int Id { get; set; }
		public int GuffId { get; set; }
		public string Content { get; set; }
		public DateTime CommentPosted { get; set; }
		public string CommentUsername { get; set; }
		public int CommentUserId { get; set; }
		public string CommentUserPhotoUrl { get; set; }
	}
}