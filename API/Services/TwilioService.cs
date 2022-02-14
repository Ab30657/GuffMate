using System.Threading.Tasks;
using API.Helpers;
using API.Interfaces;
using Microsoft.Extensions.Options;
using QRCoder;
using Twilio;
using Twilio.Rest.Chat.V2;
using Twilio.Rest.Verify.V2.Service;
using Twilio.Rest.Verify.V2.Service.Entity;

namespace API.Services
{
	public class TwilioService : ITwilioService
	{
		private readonly string _service;
		public TwilioService(IOptions<TwilioSettings> config)
		{
			TwilioClient.Init(config.Value.Id, config.Value.AuthToken);
			_service = config.Value.VerificationSID;
		}

		// public RegisterTwilio(){
		// 	var newFactor = NewFactorResource.Create(
		// 		friendlyName: "App",
		// 		factorType: NewFactorResource.FactorTypesEnum.Totp,
		// 		pathServiceSid: "VA7d19a08a7630ee9ad6e58fe2cc444bb7",
		// 		pathIdentity: "ff483d1ff591898a9942916050d2ca3f"
		// 	);
		// 	newFactor.Binding
		// 	QRCodeGenerator qrGenerator = new QRCodeGenerator(newFactor.Binding.Uri);
		// 	QRCodeData qrCodeData = qrGenerator.CreateQrCode(qrText,
		// 	QRCodeGenerator.ECCLevel.Q);
		// 	QRCode qrCode = new QRCode(qrCodeData);
		// 	Bitmap qrCodeImage = qrCode.GetGraphic(20);
		// 	return View(BitmapToBytes(qrCodeImage));
		// }

		// public async Task<string> SendVerfication(string email)
		// {
		// 	var verification = VerificationResource.Create(to: email, channel: "email", pathServiceSid: _service);

		// 	return await Task.FromResult(verification.Status);
		// }

		public void CreateSms(string number)
		{
			var smsverificationCheck = VerificationResource.Create(
					to: number,
					channel: "sms",
					pathServiceSid: _service
				);
		}

		public void CreateEmail(string email)
		{
			var emailverificationCheck = VerificationResource.Create(
					to: email,
					channel: "email",
					pathServiceSid: _service
				);
		}

		public async Task<string> CheckSmsCode(string number, string code)
		{
			var verificationCheck = VerificationCheckResource.Create(
					to: number,
					code: code,
					pathServiceSid: _service
					);
			return await Task.FromResult(verificationCheck.Status);
		}

		public async Task<string> CheckEmailCode(string email, string code)
		{
			var verificationCheck = VerificationCheckResource.Create(
					to: email,
					code: code,
					pathServiceSid: _service
					);
			return await Task.FromResult(verificationCheck.Status);
		}

	}
}