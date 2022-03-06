using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
	[Table("Comments")]
	public class Comment
	{
		public int Id { get; set; }
		public string Content { get; set; }
		public DateTime CommentPosted { get; set; } = DateTime.UtcNow;
		public AppUser CommentUser { get; set; }
		public int CommentUserId { get; set; }
		public Guff Guff { get; set; }
		public int GuffId { get; set; }
	}
}