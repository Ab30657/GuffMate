namespace API.Entities
{
	public class UserLikePost
	{
		public AppUser User { get; set; }
		public int UserId { get; set; }

		public Guff Guff { get; set; }
		public int GuffId { get; set; }
	}
}