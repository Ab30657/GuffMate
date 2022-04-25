namespace API.Entities
{
	public class UserLikeGuff
	{
		public AppUser User { get; set; }
		public int UserId { get; set; }

		public Guff Guff { get; set; }
		public int GuffId { get; set; }
	}
}