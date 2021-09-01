using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;

namespace API.Interfaces
{
	public interface IFriendsRepository
	{
		public void Update(UserFriend user);
		Task<UserFriend> GetUserFriend(int sender, int receiver);

		Task<AppUser> GetUserWithFriends(int userId);
		Task<IEnumerable<FriendDto>> GetUserFriends(string predicate, int userId);
		Task<AppUser> GetUserWithRequests(int userId);

	}
}