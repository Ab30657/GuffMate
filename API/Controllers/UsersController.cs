using System.Security.Claims;
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
using Microsoft.AspNetCore.Http;

namespace API.Controllers
{
	[Authorize]
	public class UsersController : BaseApiController
	{
		private readonly IUserRepository _repository;
		private readonly IMapper _mapper;
		private readonly IPhotoService _photoService;
		public UsersController(IUserRepository repository, IMapper mapper, IPhotoService photoService)
		{
			_photoService = photoService;
			_mapper = mapper;
			_repository = repository;
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
		{
			return Ok(await _repository.GetMembersAsync());
		}

		[HttpGet("{username}", Name = "GetUser")]
		public async Task<ActionResult<MemberDto>> GetUser(string username)
		{
			var user = await _repository.GetMemberAsync(username);
			return user;
		}


		[HttpPost("add-photo")]
		public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
		{
			var user = await _repository.GetUserByUsernameAsync(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
			var result = await _photoService.AddPhotoAsync(file);
			if (result.Error != null)
			{
				return BadRequest(result.Error.Message);
			}

			var photo = new Photo
			{
				Url = result.SecureUrl.AbsoluteUri,
				PublicId = result.PublicId
			};

			user.Photos.Add(photo);

			if (await _repository.SaveAllAsync())
			{
				return CreatedAtRoute("GetUser", new { username = user.UserName }, _mapper.Map<PhotoDto>(photo));
			}
			return BadRequest("Problem adding photo");

		}

		[HttpPut("set-main-photo/{photoId}")]
		public async Task<ActionResult> SetMainPhoto(int photoId)
		{
			var user = await _repository.GetUserByUsernameAsync(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

			var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);
			if (photo.IsMain) return BadRequest("This is already your main photo");

			var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);
			if (currentMain != null)
			{
				currentMain.IsMain = false;
			}
			photo.IsMain = true;

			if (await _repository.SaveAllAsync())
			{
				return NoContent();
			}
			return BadRequest("Error updating profile picture");

		}
	}
}