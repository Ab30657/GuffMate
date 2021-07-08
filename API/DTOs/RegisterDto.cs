using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
	public class RegisterDto
	{
		[Required]
		public string Username { get; set; }

		[Required]
		public string Name { get; set; }

		[Required]
		[EmailAddress]
		public string Email { get; set; }

		[Required]
		[StringLength(int.MaxValue, MinimumLength = 6)]
		public string Password { get; set; }

	}
}