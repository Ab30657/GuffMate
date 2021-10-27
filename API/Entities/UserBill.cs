namespace API.Entities
{
	public class UserBill
	{
		public int id { get; set; }
		public double totalPaid { get; set; }

		public AppUser AppUser { get; set; }
		public int AppUserId { get; set; }

	}
}