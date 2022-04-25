using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using Google.Apis.Auth;

namespace API.Interfaces
{
	public interface ITokenService
	{
		string CreateToken(AppUser user);
		Task<GoogleJsonWebSignature.Payload> VerifyGoogleToken(ExternalAuthDto externalAuth);
	}
}