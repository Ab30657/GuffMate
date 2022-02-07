using System;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
	public class MembersHub : Hub
	{
		private readonly IHubContext<PresenceHub> _presenceHub;
		private readonly IUnitOfWork _unitOfWork;
		private readonly PresenceTracker _tracker;
		public MembersHub(PresenceTracker tracker, IUnitOfWork unitOfWork, IHubContext<PresenceHub> presenceHub)
		{
			_tracker = tracker;
			_unitOfWork = unitOfWork;
			_presenceHub = presenceHub;
		}

		public override async Task OnConnectedAsync()
		{
			var httpContext = Context.GetHttpContext();
			await Clients.All.SendAsync("GetAll");

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
				await _presenceHub.Clients.Clients(clients).SendAsync("NewFriendRequest", userFriend);
			}

			throw new HubException("Failed to send the request");
		}
		public override Task OnDisconnectedAsync(Exception exception)
		{
			return base.OnDisconnectedAsync(exception);
		}

	}
}