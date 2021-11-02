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
			return await _context.Friends.FindAsync(sender, receiver);
		}
		public async Task<int> GetFriendListCount()
		{
			return await _context.Friends.CountAsync();
		}
		public async Task<PagedList<FriendDto>> GetUserFriends(int userId, FriendsParams userParams)
		{
			var requests = _context.Friends.Where(x => x.ReqReceiverUserId == userId && x.RequestStatus == RequestFlag.Pending);
			if (userParams.predicate == "accepted")
			{
				requests = _context.Friends.Where(x => x.ReqSenderUserId == userId && x.RequestStatus == RequestFlag.Accepted);
				// var reqRev = await _context.Friends.FindAsync(item.ReqReceiverUserId, item.ReqSenderUserId);
				requests.Where(x => x.ReqSenderUserId == userId);// userId is logged in user id
			}
			if (userParams.predicate == "sent")
			{
				// var reqRev = _context.Friends.Where(x=> await _context.Friends.FindAsync(item.ReqReceiverUserId, item.ReqSenderUserId);
				// var req = await _context.Friends.FindAsync(item.ReqSenderUserId, item.ReqReceiverUserId);
				requests = _context.Friends.Where(x => x.ReqSenderUserId == userId && x.RequestStatus == RequestFlag.Pending);
				foreach (var item in requests)
				{//dummy comment
					var reqRev = await _context.Friends.FindAsync(item.ReqReceiverUserId, item.ReqSenderUserId); // find the opposite
					requests = _context.Friends.Where(x => item.Id < reqRev.Id && x.ReqSenderUserId == reqRev.ReqSenderUserId && x.RequestStatus == RequestFlag.Pending);// If reverse Id is greater then the receiver userId is the userId
				}
			}
			if (userParams.predicate == "received")
			{
				foreach (var item in requests)
				{
					var reqRev = await _context.Friends.FindAsync(item.ReqReceiverUserId, item.ReqSenderUserId); // find the opposite
					requests = _context.Friends.Where(x => item.Id < reqRev.Id && x.ReqSenderUserId == reqRev.ReqSenderUserId && x.RequestStatus == RequestFlag.Pending);// If reverse Id is greater then the receiver userId is the userId
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