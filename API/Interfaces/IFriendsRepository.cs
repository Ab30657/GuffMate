using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
	public interface IFriendsRepository
	{
		void Update(UserFriend request);
		Task<UserFriend> GetUserFriend(int sender, int receiver);
		Task<int> GetFriendListCount();
		Task<AppUser> GetUserWithFriends(int userId);
		Task<PagedList<FriendDto>> GetUserFriends(int userId, FriendsParams userParams);
		Task<AppUser> GetUserWithRequests(int userId);

		void Delete(UserFriend request);

	}
}