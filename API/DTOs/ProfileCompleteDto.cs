namespace API.DTOs
{
	public class ProfileCompleteDto
	{
		public string Gender { get; set; }
		public string[] Interests { get; set; }
		public string Phone { get; set; }
		public bool TwoFactorEnabled { get; set; }
		public string Status { get; set; }

	}
}