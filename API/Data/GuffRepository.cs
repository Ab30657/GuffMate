using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace API.Data
{
	public class GuffRepository : IGuffRepository
	{
		private readonly DataContext _context;
		private readonly IMapper _mapper;
		public GuffRepository(DataContext context, IMapper mapper)
		{
			_mapper = mapper;
			_context = context;
		}

		public void AddComment(Comment comment)
		{
			_context.Comments.Add(comment);
		}

		public void AddGuff(Guff guff)
		{
			_context.Guffs.Add(guff);
		}

		public void DeleteComment(Comment comment)
		{
			_context.Comments.Remove(comment);
		}

		public void DeleteGuff(Guff guff)
		{
			_context.Guffs.Remove(guff);
		}

		public void DeleteLike(UserLikeGuff like)
		{
			throw new System.NotImplementedException();
		}

		public async Task<Guff> GetGuffAsync(int id)
		{
			return await _context.Guffs.FindAsync(id);
		}

		public async Task<PagedList<GuffDto>> GetGuffsAsync(GuffParams guffParams)
		{
			var query = _context.Guffs.OrderByDescending(x => x.DatePosted).ProjectTo<GuffDto>(_mapper.ConfigurationProvider).AsQueryable();
			return await PagedList<GuffDto>.CreateAsync(query, guffParams.PageNumber, guffParams.PageSize);
		}

		public async Task<UserLikeGuff> GetLikeAsync(int userId, int guffId)
		{
			return await _context.Likes.FindAsync(userId, guffId);
		}

		public void LikeGuff(UserLikeGuff like)
		{
			_context.Likes.Add(like);
		}

		public async Task<bool> SaveAllAsync()
		{
			return await _context.SaveChangesAsync() > 0;
		}
	}
}