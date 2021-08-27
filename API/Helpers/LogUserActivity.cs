using System;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace API.Helpers
{
	public class LogUserActivity : IAsyncActionFilter
	{
		public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
		{
			var resultContext = await next();

			if (!resultContext.HttpContext.User.Identity.IsAuthenticated) return;

			var userId = int.Parse(resultContext.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

			var unitOfWork = resultContext.HttpContext.RequestServices.GetService<IUnitOfWork>();
			var user = await unitOfWork.UserRepository.GetUserByIdAsync(userId);
			user.LastActive = DateTime.Now;
			await unitOfWork.Complete();
		}
	}
}