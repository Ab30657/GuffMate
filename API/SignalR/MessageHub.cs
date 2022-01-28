using System.Linq;
using System;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
	public class MessageHub : Hub
	{
		private readonly IMapper _mapper;
		private readonly IUnitOfWork _unitOfWork;
		private readonly IHubContext<PresenceHub> _presenceHub;
		private readonly PresenceTracker _tracker;
		public MessageHub(IMapper mapper, IUnitOfWork unitOfWork, IHubContext<PresenceHub> presenceHub, PresenceTracker tracker)
		{
			_tracker = tracker;
			_presenceHub = presenceHub;
			_unitOfWork = unitOfWork;
			_mapper = mapper;
		}

		public override async Task OnConnectedAsync()
		{
			var httpContext = Context.GetHttpContext();
			var otherUser = httpContext.Request.Query["user"].ToString();
			var groupName = GetGroupName(Context.User.GetUsername(), otherUser);
			await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
			await AddToGroup(groupName);
			var messages = await _unitOfWork.MessageRepository.GetMessageThread(Context.User.GetUsername(), otherUser);
			await Clients.Group(groupName).SendAsync("ReceiveMessageThread", messages);

		}

		public override async Task OnDisconnectedAsync(Exception ex)
		{
			await RemoveFromMessageGroup(Context.ConnectionId);
			await base.OnDisconnectedAsync(ex);
		}

		public async Task SendMessage(CreateMessageDto createMessageDto)
		{
			var username = Context.User.GetUsername();
			if (username == createMessageDto.RecipientUsername.ToLower())
				throw new HubException("You cannot send messages to yourself");
			var sender = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);
			var recipient = await _unitOfWork.UserRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);
			if (recipient == null) throw new HubException("Not Found User");

			var message = new Message
			{
				Sender = sender,
				Recipient = recipient,
				SenderUsername = sender.UserName,
				RecipientUsername = recipient.UserName,
				Content = createMessageDto.Content
			};

			var groupName = GetGroupName(sender.UserName, recipient.UserName);
			var group = await _unitOfWork.MessageRepository.GetMessageGroup(groupName);
			if (group.Connections.Any(x => x.Username == recipient.UserName))
			{
				message.DateRead = DateTime.UtcNow;
			}
			else
			{
				var connections = await _tracker.GetConnectionsForUser(recipient.UserName);
				if (connections != null)
				{
					await _presenceHub.Clients.Clients(connections).SendAsync("NewMessageReceived", _mapper.Map<MessageDto>(message));
				}
			}

			_unitOfWork.MessageRepository.AddMessage(message);

			if (await _unitOfWork.MessageRepository.SaveAllAsync())
			{
				await Clients.Group(groupName).SendAsync("NewMessage", _mapper.Map<MessageDto>(message));
			}
		}

		public async Task EnteringMessage(string otherUser, bool isTyping)
		{
			var groupName = GetGroupName(Context.User.GetUsername(), otherUser);
			await Clients.OthersInGroup(groupName).SendAsync("TypingNewMessage", isTyping);
		}
		private string GetGroupName(string caller, string other)
		{
			var stringCompare = string.CompareOrdinal(caller, other) < 0;
			return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
		}

		private async Task<bool> AddToGroup(string groupName)
		{
			var group = await _unitOfWork.MessageRepository.GetMessageGroup(groupName);
			var connection = new Connection(Context.ConnectionId, Context.User.GetUsername());
			if (group == null)
			{
				group = new Group(groupName);
				_unitOfWork.MessageRepository.AddGroup(group);
			}

			group.Connections.Add(connection);
			return await _unitOfWork.MessageRepository.SaveAllAsync();
		}

		private async Task RemoveFromMessageGroup(string connectionId)
		{
			var connection = await _unitOfWork.MessageRepository.GetConnection(connectionId);
			_unitOfWork.MessageRepository.RemoveConnection(connection);
			await _unitOfWork.MessageRepository.SaveAllAsync();
		}
	}
}