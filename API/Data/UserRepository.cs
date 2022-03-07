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
	public class UserRepository : IUserRepository
	{
		private readonly DataContext _context;
		private readonly IMapper _mapper;
		public UserRepository(DataContext context, IMapper mapper)
		{
			_mapper = mapper;
			_context = context;
		}

		public async Task<MemberDto> GetMemberAsync(string username)
		{
			return await _context.Users.Where(x => x.UserName == username).ProjectTo<MemberDto>(_mapper.ConfigurationProvider).SingleOrDefaultAsync();
		}

		public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
		{
			var query = _context.Users.AsQueryable();
			query = query.Where(x => x.UserName != userParams.CurrentUserName);
			if (!string.IsNullOrEmpty(userParams.Gender) && userParams.Gender != "Not Specified")
			{
				query = query.Where(x => x.Gender == userParams.Gender);
			}
			query = userParams.OrderBy switch
			{
				"lastActive" => query.OrderByDescending(x => x.LastActive),
				"alpha" => query.OrderBy(x => x.UserName),
				_ => query.OrderByDescending(x => x.LastActive)
			};

			return await PagedList<MemberDto>.CreateAsync(query.ProjectTo<MemberDto>(_mapper.ConfigurationProvider).AsNoTracking(), userParams.PageNumber, userParams.PageSize);
		}

		public async Task<AppUser> GetUserByIdAsync(int id)
		{
			return await _context.Users.FindAsync(id);
		}

		public async Task<AppUser> GetUserByUsernameAsync(string username)
		{
			return await _context.Users.Include(x => x.Photos).Include(x => x.UserInterests).Include(x => x.Guffs).SingleOrDefaultAsync(x => x.UserName == username);
		}

		public async Task<IEnumerable<AppUser>> GetUsersAsync()
		{
			return await _context.Users.Include(x => x.Photos).Include(x => x.UserInterests).ToListAsync();
		}

		public void RemoveInterest(Interest interest, int userId)
		{
			var user = _context.Users.Include(x => x.UserInterests).SingleOrDefault(x => x.Id == userId);
			var userInterest = user.UserInterests.SingleOrDefault(x => x.InterestId == interest.Id);
			user.UserInterests.Remove(userInterest);
		}

		public void Update(AppUser user)
		{
			_context.Entry(user).State = EntityState.Modified;
		}
	}
}