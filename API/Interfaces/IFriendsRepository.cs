using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;

namespace API.Interfaces
{
	public interface IFriendsRepository
	{
		Task<UserFriend> GetUserFriend(int sender, int receiver);

		Task<AppUser> GetUserWithFriends(int userId);
		Task<IEnumerable<FriendDto>> GetUserFriends(string predicate, int userId);

		Task SendFriendRequest(UserFriend request); //get sent requests
		Task DeleteFriendRequest(UserFriend request);// get delete request only from receiver side


	}
}