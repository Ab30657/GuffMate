using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
	public interface IFriendsRepository
	{
		public void Update(UserFriend user);
		Task<UserFriend> GetUserFriend(int sender, int receiver);

		Task<AppUser> GetUserWithFriends(int userId);
		Task<PagedList<FriendDto>> GetUserFriends(string predicate, int userId, UserParams userParams);
		Task<AppUser> GetUserWithRequests(int userId);

	}
}