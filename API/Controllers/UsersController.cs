using System.ComponentModel;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
	[Authorize]
	public class UsersController : BaseApiController
	{
		private readonly IUserRepository _repository;
		public UsersController(IUserRepository repository)
		{
			_repository = repository;
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
		{
			return Ok(await _repository.GetUsersAsync());
		}

		[HttpGet("{username}")]
		public async Task<ActionResult<AppUser>> GetUser(string username)
		{
			return await _repository.GetUserByUsernameAsync(username);
		}
	}
}