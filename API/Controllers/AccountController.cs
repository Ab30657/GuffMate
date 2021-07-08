using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using API.DTOs;
using Microsoft.EntityFrameworkCore;
using API.Interfaces;
using Microsoft.AspNetCore.Identity;
using AutoMapper;

namespace API.Controllers
{
	public class AccountController : BaseApiController
	{
		private readonly ITokenService _tokenService;
		private readonly SignInManager<AppUser> _signInManager;
		private readonly UserManager<AppUser> _userManager;
		private readonly IMapper _mapper;

		public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, ITokenService tokenService, IMapper mapper)
		{
			_mapper = mapper;
			_userManager = userManager;
			_signInManager = signInManager;
			_tokenService = tokenService;

		}

		[HttpPost("register")]
		public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
		{
			if (await UserExists(registerDto.Username))
			{
				return BadRequest("Username is taken!");
			}
			var user = _mapper.Map<AppUser>(registerDto);
			using var hmac = new HMACSHA512();

			user.UserName = registerDto.Username.ToLower();

			var result = await _userManager.CreateAsync(user, registerDto.Password);

			if (!result.Succeeded) return BadRequest(result.Errors);
			return new UserDto
			{
				Username = user.UserName,
				Token = _tokenService.CreateToken(user),
				Name = user.Name
			};
		}
		[HttpPost("login")]
		public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
		{
			var user = await _userManager.Users.SingleOrDefaultAsync(x => x.UserName == loginDto.Username.ToLower());
			if (user == null)
			{
				return Unauthorized("Invalid username");
			}
			var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

			if (!result.Succeeded) return Unauthorized("Invalid Password");
			return new UserDto
			{
				Username = user.UserName,
				Token = _tokenService.CreateToken(user)
			};
		}
		private async Task<bool> UserExists(string username)
		{
			return await _userManager.Users.AnyAsync(x => x.UserName == username.ToLower());
		}


	}
}