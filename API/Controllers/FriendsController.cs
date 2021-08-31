using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
	[Authorize]
	public class FriendsController : BaseApiController
	{
		private readonly IMapper _mapper;
		private readonly IUnitOfWork _unitOfWork;
		public FriendsController(IUnitOfWork unitOfWork, IMapper mapper)
		{
			_unitOfWork = unitOfWork;
			_mapper = mapper;

		}

		[HttpPost("send-request/{username}")]
		public async Task<ActionResult> AddFriend(string username)
		{
			var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.FindFirst(ClaimTypes.Name)?.Value);
			var senderUserId = user.Id;
			var receiverUser = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);

			var senderUser = await _unitOfWork.FriendsRepository.GetUserWithFriends(senderUserId);

			if (receiverUser == null) return NotFound(); // The person user is sending FR is not there.

			if (senderUser.UserName == username) return BadRequest("You cannot send friend request to yourself");

			var userFriend = await _unitOfWork.FriendsRepository.GetUserFriend(senderUserId, receiverUser.Id);
			if (userFriend != null) return BadRequest("You have already sent request to this user");

			userFriend = new UserFriend
			{
				ReqSenderUserId = senderUserId,
				ReqReceiverUserId = receiverUser.Id
			};

			senderUser.SentRequestUsers.Add(userFriend);

			if (await _unitOfWork.Complete()) return Ok();

			return BadRequest("Failed to send the request");

		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<FriendDto>>> GetUserFriends(string predicate)
		{
			var userId = (await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.FindFirst(ClaimTypes.Name)?.Value)).Id;
			var users = await _unitOfWork.FriendsRepository.GetUserFriends(predicate, userId);
			return Ok(users);
		}
	}
}