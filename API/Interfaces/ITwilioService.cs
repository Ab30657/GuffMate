using System.Threading.Tasks;

namespace API.Interfaces
{
	public interface ITwilioService
	{
		void CreateSms(string number);
		void CreateEmail(string email);

		Task<string> CheckSmsCode(string number, string code);
		Task<string> CheckEmailCode(string email, string code);
	}
}