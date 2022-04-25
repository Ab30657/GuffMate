using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
	[Table("Guffs")]
	public class Guff
	{
		public int Id { get; set; }
		public DateTime DatePosted { get; set; } = DateTime.UtcNow;
		public string GuffContent { get; set; }
		public ICollection<UserLikeGuff> LikedUsers { get; set; }
		public ICollection<Comment> Comments { get; set; }
		public AppUser User { get; set; }
		public int UserId { get; set; }

	}
}