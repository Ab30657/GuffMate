namespace API.Entities
{
	public class UserFriend
	{

		public int Id { get; set; }
		public AppUser ReqSenderUser { get; set; }
		public int ReqSenderUserId { get; set; }
		public AppUser ReqReceiverUser { get; set; }
		public int ReqReceiverUserId { get; set; }
		public RequestFlag RequestStatus { get; set; }

	}
	public enum RequestFlag
	{
		Pending,
		Accepted,
		Rejected,
		None
	}
}