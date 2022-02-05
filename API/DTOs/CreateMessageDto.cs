using Microsoft.AspNetCore.Http;

namespace API.DTOs
{
	public class CreateMessageDto
	{
		public string RecipientUsername { get; set; }
		public string Content { get; set; }

		public bool isImage { get; set; }
	}
}