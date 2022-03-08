using System;
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
using API.Helpers;
using API.Extensions;

namespace API.Controllers
{
	[Authorize]
	public class UsersController : BaseApiController
	{
		private readonly IMapper _mapper;
		private readonly IPhotoService _photoService;
		private readonly IUnitOfWork _unitOfWork;
		private readonly ITwilioService _twilioService;
		public UsersController(IUnitOfWork unitOfWork, IMapper mapper, IPhotoService photoService, ITwilioService twilioService)
		{
			_twilioService = twilioService;
			_unitOfWork = unitOfWork;
			_photoService = photoService;
			_mapper = mapper;
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery] UserParams userParams)
		{
			userParams.CurrentUserName = User.FindFirst(ClaimTypes.Name)?.Value;
			var users = await _unitOfWork.UserRepository.GetMembersAsync(userParams);
			foreach (var item in users)
			{
				var request = (await _unitOfWork.FriendsRepository.GetUserFriend(User.GetUserId(), item.Id)); // Logged in user is the receiver
				if (request == null) item.FriendStatus = RequestFlag.None;
				if (request != null) item.FriendStatus = request.RequestStatus;
			}
			Response.AddPaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);
			return Ok(users);
		}

		[HttpGet("{username}", Name = "GetUser")]
		public async Task<ActionResult<MemberDto>> GetUser(string username)
		{
			var user = await _unitOfWork.UserRepository.GetMemberAsync(username);
			return user;
		}


		[HttpPost("add-photo")]
		public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
		{
			var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.FindFirst(ClaimTypes.Name)?.Value);
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

			if (await _unitOfWork.Complete())
			{
				return CreatedAtRoute("GetUser", new { username = user.UserName }, _mapper.Map<PhotoDto>(photo));
			}
			return BadRequest("Problem adding photo");

		}

		[HttpPut("set-main-photo/{photoId}")]
		public async Task<ActionResult> SetMainPhoto(int photoId)
		{
			var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.FindFirst(ClaimTypes.Name)?.Value);

			var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);
			if (photo.IsMain) return BadRequest("This is already your main photo");

			var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);
			if (currentMain != null)
			{
				currentMain.IsMain = false;
			}
			photo.IsMain = true;

			if (await _unitOfWork.Complete())
			{
				return NoContent();
			}
			return BadRequest("Error updating profile picture");

		}

		[HttpPut("remove-main-photo/")]
		public async Task<ActionResult> RemoveMainPhoto(int photoId)
		{
			var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.FindFirst(ClaimTypes.Name)?.Value);

			var photo = user.Photos.FirstOrDefault(x => x.IsMain);
			photo.IsMain = false;
			if (await _unitOfWork.Complete())
			{
				return NoContent();
			}
			return BadRequest("Error deleting your profile picture.");
		}

		[HttpPut]
		public async Task<ActionResult> UpdateUser(ProfileCompleteDto profileCompleteDto)
		{
			var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.FindFirst(ClaimTypes.Name)?.Value);

			var interestList = (await _unitOfWork.InterestRepository.GetInterestsByUserIdAsync(user.Id));
			var interestListStrings = interestList.Select(x => x.Title);
			var newInterests = profileCompleteDto.Interests.Except(interestListStrings).ToList();
			var remainingInterests = interestList.Where(x => !profileCompleteDto.Interests.Any(a => a == x.Title)).ToList();
			//Add interest if profileCompleteDto has only added interest
			foreach (var item in newInterests)
			{
				if (!(await InterestExists(item)))
				{
					var interest = new Interest
					{
						Title = item
					};
					var appUserInterest = new AppUserInterest
					{
						User = user,
						Interest = interest
					};
					_unitOfWork.InterestRepository.Add(interest);
					user.UserInterests.Add(appUserInterest);
					continue;
				}
				var existingInterest = await _unitOfWork.InterestRepository.GetInterestByTitleAsync(item);
				var newAppUserInterest = new AppUserInterest
				{
					User = user,
					Interest = existingInterest
				};
				user.UserInterests.Add(newAppUserInterest);
			}


			//Delete removed interests
			foreach (var item in remainingInterests)
			{
				_unitOfWork.UserRepository.RemoveInterest(item, user.Id);
			}
			_mapper.Map(profileCompleteDto, user);
			_unitOfWork.UserRepository.Update(user);
			if (await _unitOfWork.Complete()) return NoContent();

			return BadRequest("Failed to update user");
		}

		private async Task<bool> InterestExists(string title)
		{
			return await _unitOfWork.InterestRepository.GetInterestByTitleAsync(title) != null;
		}

		[HttpGet("verify-email")]
		public async Task<ActionResult> SendEmailVerfication()
		{
			var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.FindFirst(ClaimTypes.Name)?.Value);
			if (user.EmailConfirmed) return BadRequest("Email is already confirmed");

			_twilioService.CreateEmail(user.Email);
			return Ok();

		}

		[HttpGet("verify-phone")]
		public async Task<ActionResult> SendSmsCode()
		{
			var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.FindFirst(ClaimTypes.Name)?.Value);
			if (user.PhoneNumberConfirmed) return BadRequest("Phone number is already confirmed");

			_twilioService.CreateSms(user.PhoneNumber);
			return Ok();
		}

		[HttpPost("verify-email/check")]
		public async Task<ActionResult<bool>> VerifyEmail(AuthCodeDTO authDto)
		{
			var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.FindFirst(ClaimTypes.Name)?.Value);
			if (user.EmailConfirmed) return BadRequest("Email is already confirmed");
			if (!string.IsNullOrEmpty(user.Email))
			{
				try
				{
					var status = await _twilioService.CheckEmailCode(user.Email, authDto.code);
					if (status == "approved")
					{
						user.EmailConfirmed = true;
						_unitOfWork.UserRepository.Update(user);
						if (await _unitOfWork.Complete())
						{
							return await Task.FromResult(true);
						}
						return BadRequest("Error Saving Changes to your verification");
					}
					else
					{
						return await Task.FromResult(false);
					}
				}
				catch (Exception ex)
				{
					return BadRequest("Could not verify the code");
				}
			}
			return BadRequest("Couldn't get your email");

		}

		[HttpPut("verify-phone/check")]
		public async Task<ActionResult> VerifySMSCode(AuthCodeDTO authDto)
		{
			var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.FindFirst(ClaimTypes.Name)?.Value);
			if (user.PhoneNumberConfirmed) return BadRequest("Phone is already confirmed");
			if (string.IsNullOrEmpty(user.PhoneNumber))
			{
				try
				{
					var status = await _twilioService.CheckEmailCode(user.PhoneNumber, authDto.code);
					if (status == "approved")
					{
						user.PhoneNumberConfirmed = true;
						_unitOfWork.UserRepository.Update(user);
						if (await _unitOfWork.Complete())
						{
							return NoContent();
						}
						return BadRequest("Error Saving Changes to your verification");
					}
				}
				catch (Exception ex)
				{
					return BadRequest("Could not verify the code");
				}
			}
			return BadRequest("Couldn't get your phone number");
		}
		[HttpPut("verify-email/delete")]
		public async Task<ActionResult<bool>> RemoveEmailAuth()
		{

			var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.FindFirst(ClaimTypes.Name)?.Value);
			user.EmailConfirmed = false;

			_unitOfWork.UserRepository.Update(user);
			if (await _unitOfWork.Complete())
			{
				return await Task.FromResult(true);
			}
			return BadRequest("Couldn't save changes");
		}

		[HttpPost("add-guff")]
		public async Task<ActionResult<PhotoDto>> AddGuff(GuffDto guffDto)
		{
			var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.FindFirst(ClaimTypes.Name)?.Value);

			var guff = new Guff
			{
				User = user,
				GuffContent = guffDto.GuffContent,
			};

			_unitOfWork.GuffRepository.AddGuff(guff);
			if (await _unitOfWork.GuffRepository.SaveAllAsync())
			{
				return Ok(_mapper.Map<GuffDto>(guff));
			}
			return BadRequest("Problem starting a new guff.");

		}

		[HttpGet("guffs")]
		public async Task<ActionResult<IEnumerable<GuffDto>>> GetGuffs([FromQuery] GuffParams guffParams)
		{
			guffParams.CurrentUsername = User.FindFirst(ClaimTypes.Name)?.Value;
			var guffs = await _unitOfWork.GuffRepository.GetGuffsAsync(guffParams);
			Response.AddPaginationHeader(guffs.CurrentPage, guffs.PageSize, guffs.TotalCount, guffs.TotalPages);
			return Ok(guffs);
		}

		[HttpPost("guffs/{id}/comment")]
		public async Task<ActionResult<CommentDto>> AddComment(CommentDto commentDto, int id)
		{
			var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.FindFirst(ClaimTypes.Name)?.Value);
			var guff = await _unitOfWork.GuffRepository.GetGuffAsync(id);
			var comment = new Comment
			{
				CommentUser = user,
				CommentPosted = DateTime.UtcNow,
				Content = commentDto.Content,
				Guff = guff
			};
			_unitOfWork.GuffRepository.AddComment(comment);
			if (await _unitOfWork.GuffRepository.SaveAllAsync())
			{
				return Ok(_mapper.Map<CommentDto>(comment));
			}
			return BadRequest("Problem adding the comment.");
		}

		[HttpPost("guffs/{id}/like")]
		public async Task<ActionResult<LikeDto>> AddLike(int id)
		{
			var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.FindFirst(ClaimTypes.Name)?.Value);
			var guff = await _unitOfWork.GuffRepository.GetGuffAsync(id);
			if (await _unitOfWork.GuffRepository.GetLikeAsync(user.Id, id) != null) return BadRequest("Already liked the post!");
			var like = new UserLikeGuff
			{
				Guff = guff,
				User = user
			};
			_unitOfWork.GuffRepository.LikeGuff(like);
			if (await _unitOfWork.GuffRepository.SaveAllAsync())
			{
				return (_mapper.Map<LikeDto>(like));
			}
			return BadRequest("Problem liking the guff.");
		}
	}
}