using System;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
	[Authorize]
	public class PresenceHub : Hub
	{
		private readonly PresenceTracker _tracker;
		private readonly IUnitOfWork _unitOfWork;
		private readonly IMapper _mapper;
		public PresenceHub(PresenceTracker tracker, IUnitOfWork unitOfWork, IMapper mapper)
		{
			_mapper = mapper;
			_unitOfWork = unitOfWork;
			_tracker = tracker;
		}

		public override async Task OnConnectedAsync()
		{
			var isOnline = await _tracker.UserConnected(Context.User.GetUsername(), Context.ConnectionId);
			if (isOnline)
				await Clients.Others.SendAsync("UserIsOnline", Context.User.GetUsername());
			var currentUsers = await _tracker.GetOnlineUsers();
			await Clients.Caller.SendAsync("GetOnlineUsers", currentUsers);
			var lMessages = await _unitOfWork.MessageRepository.GetLatestMessages(Context.User.GetUserId());
			await Clients.Caller.SendAsync("UpdateLatestMessages", lMessages);
			var userId = Context.User.GetUserId();
			var users = await _unitOfWork.FriendsRepository.GetUserFriends(userId, new Helpers.FriendsParams { predicate = "received" });
			await Clients.Caller.SendAsync("UpdateRequestList", users);

		}
		public override async Task OnDisconnectedAsync(Exception ex)
		{
			var isOffline = await _tracker.UserDisconnected(Context.User.GetUsername(), Context.ConnectionId);
			if (isOffline)
				await Clients.Others.SendAsync("UserIsOffline", Context.User.GetUsername());

			await base.OnDisconnectedAsync(ex);
		}
		public async Task CancelRequest(string username)
		{
			var user = Context.User;
			var senderUserId = user.GetUserId();
			var receiverUser = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);
			if (receiverUser == null) throw new HubException(""); //theres no user sender in db

			var request = await _unitOfWork.FriendsRepository.GetUserFriend(senderUserId, receiverUser.Id);
			if (request == null) throw new HubException("");
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
			if (await _unitOfWork.Complete())
			{
				var clients = await _tracker.GetConnectionsForUser(username);
				await Clients.Clients(clients).SendAsync("DeletedRequest", _mapper.Map<FriendDto>(requestReverse));
			}

		}
		public async Task SendRequest(string username)
		{
			var userId = Context.User.GetUserId();
			var senderUserId = userId;
			var receiverUser = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);

			var senderUser = await _unitOfWork.FriendsRepository.GetUserWithFriends(senderUserId);

			if (receiverUser == null) throw new HubException("Cannot find the user"); // The person user is sending FR is not there.

			if (senderUser.UserName == username) throw new HubException("You cannot send friend request to yourself");

			var userFriend = await _unitOfWork.FriendsRepository.GetUserFriend(senderUserId, receiverUser.Id);
			if (userFriend != null) throw new HubException("You have already sent request to this user");
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
			if (await _unitOfWork.Complete())
			{
				var clients = await _tracker.GetConnectionsForUser(username);
				// var users = await _unitOfWork.FriendsRepository.GetUserFriends(userId, new Helpers.FriendsParams { predicate = "received" });
				// await Clients.Clients(clients).SendAsync("UpdateRequestList", users);
				var request = await _unitOfWork.FriendsRepository.GetUserFriend(receiverUser.Id, senderUserId);
				var l = _mapper.Map<FriendDto>(request);
				await Clients.Clients(clients).SendAsync("NewFriendRequest", _mapper.Map<FriendDto>(request));
			}

		}
	}
}