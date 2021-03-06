using System.Runtime.CompilerServices;
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
		public void Update(UserFriend request)
		{
			_context.Entry(request).State = EntityState.Modified;
		}
		public async Task<UserFriend> GetUserFriend(int sender, int receiver)
		{
			return await _context.Friends.Include(x => x.ReqReceiverUser.Photos).FirstOrDefaultAsync(x => x.ReqSenderUserId == sender && receiver == x.ReqReceiverUserId);
		}
		public async Task<int> GetFriendListCount()
		{
			return await _context.Friends.CountAsync();
		}
		public async Task<PagedList<FriendDto>> GetUserFriends(int userId, FriendsParams userParams)
		{
			var requests = _context.Friends.Where(x => x.ReqReceiverUserId == userId && x.RequestStatus == RequestFlag.SentPending);
			if (userParams.predicate == "accepted")
			{
				requests = _context.Friends.Where(x => x.ReqSenderUserId == userId && x.RequestStatus == RequestFlag.Accepted);
				requests.Where(x => x.ReqSenderUserId == userId);// userId is logged in user id
			}
			if (userParams.predicate == "sent")
			{
				requests = _context.Friends.Where(x => x.ReqSenderUserId == userId && x.RequestStatus == RequestFlag.SentPending);
			}
			if (userParams.predicate == "received")
			{
				foreach (var item in requests.ToList())
				{
					var reqRev = await _context.Friends.FindAsync(item.ReqReceiverUserId, item.ReqSenderUserId); // find the opposite
					requests = _context.Friends.Where(x => item.Id < reqRev.Id && x.ReqSenderUserId == reqRev.ReqSenderUserId && x.RequestStatus == RequestFlag.ReceivedPending).Include(x => x.ReqReceiverUser).ThenInclude(x => x.Photos).Include(x => x.ReqSenderUser).ThenInclude(x => x.Photos);// If reverse Id is greater then the receiver userId is the userId
				}
			}
			// if requests not fulfilled till now, no record in table for that user.
			return await PagedList<FriendDto>.CreateAsync(requests.ProjectTo<FriendDto>(_mapper.ConfigurationProvider).AsNoTracking(), userParams.PageNumber, userParams.PageSize);
		}

		public async Task<AppUser> GetUserWithFriends(int userId) //Current user is sending out requests, get those requests
		{
			return await _context.Users.Include(x => x.FriendsOf).Include(x => x.FriendsAdded).FirstOrDefaultAsync(x => x.Id == userId);// get the list of sent request friends
		}

		public async Task<AppUser> GetUserWithRequests(int userId)
		{
			return await _context.Users.Include(x => x.FriendsOf).FirstOrDefaultAsync(x => x.Id == userId);
		}

		public void Delete(UserFriend request)
		{
			_context.Friends.Remove(request);
		}
	}
}