using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;
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
			var id = await _unitOfWork.FriendsRepository.GetFriendListCount();

			userFriend = new UserFriend
			{
				ReqSenderUserId = senderUserId,
				ReqReceiverUserId = receiverUser.Id,
				Id = id++,
				RequestStatus = RequestFlag.SentPending
			};
			senderUser.FriendsAdded.Add(userFriend);

			userFriend = new UserFriend
			{
				ReqSenderUserId = receiverUser.Id,
				ReqReceiverUserId = senderUserId,
				Id = id++,
				RequestStatus = RequestFlag.ReceivedPending
			};
			senderUser.FriendsOf.Add(userFriend);
			if (await _unitOfWork.Complete()) return Ok();

			return BadRequest("Failed to send the request");
		}

		[HttpDelete("delete-request/{username}")]
		public async Task<ActionResult> DeleteRequest(string username)
		{
			var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.FindFirst(ClaimTypes.Name)?.Value);
			var senderUserId = user.Id;
			var receiverUser = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);
			if (receiverUser == null) return NotFound(); //theres no user sender in db

			var request = await _unitOfWork.FriendsRepository.GetUserFriend(senderUserId, receiverUser.Id);
			if (request == null) return NotFound();
			var requestReverse = await _unitOfWork.FriendsRepository.GetUserFriend(receiverUser.Id, senderUserId);
			// if (request.RequestStatus == RequestFlag.Accepted) return BadRequest("You are already friends!");
			// if (request.Id > requestReverse.Id)
			// {
			// 	if (requestReverse.ReqSenderUserId == user.Id) return BadRequest("You cannot cancel request from their part");
			// }
			// if (request.ReqSenderUserId == user.Id) return BadRequest("You cannot accept request from their part");
			// request.RequestStatus = RequestFlag.Accepted;
			// requestReverse.RequestStatus = RequestFlag.Accepted;
			_unitOfWork.FriendsRepository.Delete(request);
			_unitOfWork.FriendsRepository.Delete(requestReverse);
			if (await _unitOfWork.Complete()) return NoContent();

			return BadRequest("Failed to update request");
		}

		[HttpPut("received/{username}/accept")]
		public async Task<ActionResult> AcceptFriendRequest(string username)
		{
			var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.FindFirst(ClaimTypes.Name)?.Value);
			var receiverUserId = user.Id;
			var senderUser = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);
			if (senderUser == null) return NotFound(); //theres no user sender in db

			var request = await _unitOfWork.FriendsRepository.GetUserFriend(senderUser.Id, receiverUserId);
			if (request == null) return NotFound();
			var requestReverse = await _unitOfWork.FriendsRepository.GetUserFriend(receiverUserId, senderUser.Id);
			if (request.RequestStatus == RequestFlag.Accepted) return BadRequest("You are already friends!");
			if (request.Id > requestReverse.Id)
			{
				if (requestReverse.ReqSenderUserId == user.Id) return BadRequest("You cannot accept request from their part");
			}
			if (request.ReqSenderUserId == user.Id) return BadRequest("You cannot accept request from their part");
			request.RequestStatus = RequestFlag.Accepted;
			requestReverse.RequestStatus = RequestFlag.Accepted;
			_unitOfWork.FriendsRepository.Update(request);
			_unitOfWork.FriendsRepository.Update(requestReverse);
			if (await _unitOfWork.Complete()) return NoContent();

			return BadRequest("Failed to update request");
		}

		//Ideas to combine accept and reject functions into a same function with status property changed for a request
		[HttpGet]
		public async Task<ActionResult<IEnumerable<FriendDto>>> GetFriends([FromQuery] FriendsParams userParams)
		{
			var userId = (await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.FindFirst(ClaimTypes.Name)?.Value)).Id;
			var users = await _unitOfWork.FriendsRepository.GetUserFriends(userId, userParams);
			return Ok(users);
		}

	}
}