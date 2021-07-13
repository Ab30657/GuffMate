using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
	[Table("Interests")]
	public class Interest
	{
		public int Id { get; set; }
		public string Title { get; set; }
		public ICollection<AppUserInterest> UserInterests { get; set; }
	}
}