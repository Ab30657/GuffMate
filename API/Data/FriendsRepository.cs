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

		public Task DeleteFriendRequest(UserFriend request)
		{
			throw new System.NotImplementedException();
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

			return await users.Select(x => new FriendDto
			{
				Username = x.UserName,
				Name = x.Name,
				PhotoUrl = x.Photos.FirstOrDefault(x => x.IsMain).Url,
				Id = x.Id
			}).ToListAsync();
		}

		public async Task<AppUser> GetUserWithFriends(int userId)
		{
			return await _context.Users.Include(x => x.SentRequestUsers).FirstOrDefaultAsync(x => x.Id == userId);// get the list of sent request friends
		}

		public Task SendFriendRequest(UserFriend request)
		{
			throw new System.NotImplementedException();
		}
	}
}