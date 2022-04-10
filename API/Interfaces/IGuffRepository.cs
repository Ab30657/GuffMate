using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
	public interface IGuffRepository
	{

		Task<PagedList<GuffDto>> GetGuffsAsync(GuffParams guffParams, int userId);
		void AddGuff(Guff guff);
		void DeleteGuff(Guff guff);
		Task<Guff> GetGuffAsync(int id);
		void AddComment(Comment comment);
		Task<UserLikeGuff> GetLikeAsync(int guffId, int userId);
		void LikeGuff(UserLikeGuff like);
		void DeleteComment(Comment comment);
		void DeleteLike(UserLikeGuff like);
		Task<bool> SaveAllAsync();
	}
}