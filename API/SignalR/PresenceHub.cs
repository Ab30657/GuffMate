using System;
using System.Threading.Tasks;
using API.Data;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
	[Authorize]
	public class PresenceHub : Hub
	{
		private readonly PresenceTracker _tracker;
		private readonly IUnitOfWork _unitOfWork;
		public PresenceHub(PresenceTracker tracker, IUnitOfWork unitOfWork)
		{
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
			// var lMessages = await _unitOfWork.MessageRepository.GetLatestMessages(Context.User.GetUserId());
			// await Clients.Caller.SendAsync("UpdateLatestMessages", lMessages);

		}
		public override async Task OnDisconnectedAsync(Exception ex)
		{
			var isOffline = await _tracker.UserDisconnected(Context.User.GetUsername(), Context.ConnectionId);
			if (isOffline)
				await Clients.Others.SendAsync("UserIsOffline", Context.User.GetUsername());

			await base.OnDisconnectedAsync(ex);
		}
	}
}