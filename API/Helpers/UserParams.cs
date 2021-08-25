namespace API.Helpers
{
	public class UserParams
	{
		private const int MaxPageSize = 50;
		public int PageNumber { get; set; } = 1;
		private int _PageSize = 10;

		public int pageSize
		{
			get => _PageSize;
			set => _PageSize = (value > MaxPageSize) ? MaxPageSize : value;
		}

		public string CurrentUserName { get; set; }
		public string Gender { get; set; }

		public string OrderBy { get; set; } = "lastActive";


	}
}