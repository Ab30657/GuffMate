using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
	public class MessageRepository : IMessageRepository
	{
		private readonly DataContext _context;
		private readonly IMapper _mapper;
		public MessageRepository(DataContext context, IMapper mapper)
		{
			_mapper = mapper;
			_context = context;
		}

		public void AddGroup(Group group)
		{
			_context.Groups.Add(group);
		}

		public void AddMessage(Message message)
		{
			_context.Messages.Add(message);
		}

		public void DeleteMessage(Message message)
		{
			_context.Messages.Remove(message);
		}

		public async Task<Connection> GetConnection(string connectionId)
		{
			return await _context.Connections.FindAsync(connectionId);
		}

		public async Task<Group> GetGroupForConnection(string connectionId)
		{
			return await _context.Groups.Include(x => x.Connections).Where(c => c.Connections.Any(x => x.ConnectionId == connectionId)).FirstOrDefaultAsync();
		}

		public async Task<MessageDto> GetLatestMessage(string currentUsername, string recipientUsername)
		{
			return _mapper.Map<MessageDto>(await _context.Messages.Include(x => x.Sender).ThenInclude(x => x.Photos).Include(x => x.Recipient).ThenInclude(x => x.Photos).Where(x => x.RecipientUsername == currentUsername && x.SenderUsername == recipientUsername || x.RecipientUsername == recipientUsername && x.SenderUsername == currentUsername).OrderBy(x => x.MessageSent).LastOrDefaultAsync());
		}

		public async Task<IEnumerable<MessageDto>> GetLatestMessages(int userId)
		{
			var requests = _context.Friends.Where(x => x.ReqSenderUserId == userId && x.RequestStatus == RequestFlag.Accepted);
			// var reqRev = await _context.Friends.FindAsync(item.ReqReceiverUserId, item.ReqSenderUserId);
			var friends = await requests.Where(x => x.ReqSenderUserId == userId).Select(x => x.ReqReceiverUserId).ToListAsync();// userId is logged in user id
			var messages = new List<MessageDto>();
			foreach (var item in friends)
			{
				var msg = _mapper.Map<MessageDto>(await _context.Messages.Where(x => x.RecipientId == item && x.SenderId == userId || x.RecipientId == userId && x.SenderId == item).OrderBy(x => x.MessageSent).LastOrDefaultAsync());
				messages.Add(msg);
			}
			return messages;
		}
		public async Task<Message> GetMessage(int id)
		{
			return await _context.Messages.FindAsync(id);
		}

		public async Task<Group> GetMessageGroup(string groupName)
		{
			return await _context.Groups.Include(x => x.Connections).FirstOrDefaultAsync(x => x.Name == groupName);
		}

		public async Task<PagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams)
		{
			var query = _context.Messages.OrderByDescending(x => x.MessageSent).ProjectTo<MessageDto>(_mapper.ConfigurationProvider).AsQueryable();

			query = messageParams.Container switch
			{
				"Inbox" => query.Where(x => x.RecipientUsername == messageParams.Username),
				"Outbox" => query.Where(x => x.SenderUsername == messageParams.Username),
				_ => query.Where(x => x.RecipientUsername == messageParams.Username && x.DateRead == null)
			};
			return await PagedList<MessageDto>.CreateAsync(query, messageParams.PageNumber, messageParams.PageSize);
		}

		public async Task<IEnumerable<MessageDto>> GetMessageThread(string currentUsername, string recipientUsername)
		{
			var messages = await _context.Messages.Include(x => x.Sender).ThenInclude(x => x.Photos).Include(x => x.Recipient).ThenInclude(x => x.Photos).Where(x => x.RecipientUsername == currentUsername && x.SenderUsername == recipientUsername || x.RecipientUsername == recipientUsername && x.SenderUsername == currentUsername).OrderBy(x => x.MessageSent).ToListAsync();

			var unread = messages.Where(x => x.DateRead == null && x.Recipient.UserName == currentUsername).ToList();

			if (unread.Any())
			{
				foreach (var item in unread)
				{
					item.DateRead = DateTime.UtcNow;
				}
				await _context.SaveChangesAsync();
			}

			return _mapper.Map<IEnumerable<MessageDto>>(messages);

		}

		public void RemoveConnection(Connection connection)
		{
			_context.Connections.Remove(connection);
		}

		public async Task<bool> SaveAllAsync()
		{
			return await _context.SaveChangesAsync() > 0;
		}
	}
}