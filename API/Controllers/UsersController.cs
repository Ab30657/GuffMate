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
using API.DTOs;
using AutoMapper;

namespace API.Controllers
{
	[Authorize]
	public class UsersController : BaseApiController
	{
		private readonly IUserRepository _repository;
		private readonly IMapper _mapper;
		public UsersController(IUserRepository repository, IMapper mapper)
		{
			_mapper = mapper;
			_repository = repository;
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
		{
			return Ok(await _repository.GetMembersAsync());
		}

		[HttpGet("{username}")]
		public async Task<ActionResult<MemberDto>> GetUser(string username)
		{
			var user = await _repository.GetMemberAsync(username);
			return user;
		}
	}
}