using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
	public class FriendsRepository : IFriendsRepository
	{
		private readonly DataContext _context;
		public FriendsRepository(DataContext context)
		{
			_context = context;

		}
		public void Update(UserFriend user)
		{
			_context.Entry(user).State = EntityState.Modified;
		}
		public async Task<UserFriend> GetUserFriend(int sender, int receiver)
		{
			return await _context.Friends.FindAsync(sender, receiver);
		}

		public async Task<IEnumerable<FriendDto>> GetUserFriends(string predicate, int userId)
		{
			var users = _context.Users.OrderBy(x => x.UserName).AsQueryable();
			var requests = _context.Friends.AsQueryable();

			if (predicate == "sent")
			{
				requests = requests.Where(x => x.ReqSenderUserId == userId);
				users = requests.Select(x => x.ReqReceiverUser); //get the receiver users to which user sent requests to 

			}
			if (predicate == "received")
			{
				requests = requests.Where(x => x.ReqReceiverUserId == userId);
				users = requests.Select(x => x.ReqSenderUser); //get the senders of the received requests
			}
			if (predicate == "accepted")
			{
				requests = requests.Where(x => (x.ReqReceiverUserId == userId));
				if (requests != null)
				{
					users = requests.Where(x => x.RequestStatus == RequestFlag.Accepted).Select(x => x.ReqSenderUser);
				}
				else
				{
					requests = requests.Where(x => (x.ReqSenderUserId == userId));
					if (requests != null)
					{
						users = requests.Where(x => x.RequestStatus == RequestFlag.Accepted).Select(x => x.ReqReceiverUser);
					}
				}
			}

			return await users.Select(x => new FriendDto
			{
				Username = x.UserName,
				Name = x.Name,
				PhotoUrl = x.Photos.FirstOrDefault(x => x.IsMain).Url,
				Id = x.Id
			}).ToListAsync();
		}

		public async Task<AppUser> GetUserWithFriends(int userId) //Current user is sending out requests, get those requests
		{
			return await _context.Users.Include(x => x.SentRequestUsers).FirstOrDefaultAsync(x => x.Id == userId);// get the list of sent request friends
		}

		public async Task<AppUser> GetUserWithRequests(int userId)
		{
			return await _context.Users.Include(x => x.ReceiverRequestUsers).FirstOrDefaultAsync(x => x.Id == userId);
		}

	}
}