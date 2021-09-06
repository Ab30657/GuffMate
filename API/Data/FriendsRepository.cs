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
	public class FriendsRepository : IFriendsRepository
	{
		private readonly DataContext _context;
		private readonly IMapper _mapper;
		public FriendsRepository(DataContext context, IMapper mapper)
		{
			_mapper = mapper;
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
			var requests = _context.Friends.AsQueryable();

			if (predicate == "sent")
			{
				requests = requests.Where(x => x.ReqReceiverUserId == userId);
			}
			if (predicate == "received")
			{
				requests = requests.Where(x => x.ReqReceiverUserId == userId);
			}
			if (predicate == "accepted")
			{
				requests = requests.Where(x => (x.ReqReceiverUserId == userId));
			}

			// if requests not fulfilled till now, no record in table for that user.
			return await PagedList<FriendDto>.CreateAsync(requests.ProjectTo<FriendDto>(_mapper.ConfigurationProvider).AsNoTracking(), 1, 5);
		}

		public async Task<AppUser> GetUserWithFriends(int userId) //Current user is sending out requests, get those requests
		{
			return await _context.Users.Include(x => x.FriendsOf).Include(x => x.FriendsAdded).FirstOrDefaultAsync(x => x.Id == userId);// get the list of sent request friends
		}

		public async Task<AppUser> GetUserWithRequests(int userId)
		{
			return await _context.Users.Include(x => x.FriendsOf).FirstOrDefaultAsync(x => x.Id == userId);
		}

	}
}