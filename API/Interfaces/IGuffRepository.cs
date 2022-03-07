using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
	public interface IGuffRepository
	{

		Task<PagedList<GuffDto>> GetGuffsAsync(GuffParams guffParams);
		void AddGuff(Guff guff);
		void DeleteGuff(Guff guff);
		Task<Guff> GetGuff(int id);
		void AddComment(Comment comment);
		void LikeGuff(LikeDto like);
		void DeleteComment(Comment comment);
		void DeleteLike(UserLikeGuff like);
		Task<bool> SaveAllAsync();
	}
}