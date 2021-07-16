using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
	public class InterestRepository : IInterestRepository
	{
		private readonly DataContext _context;
		private readonly IMapper _mapper;
		public InterestRepository(DataContext context, IMapper mapper)
		{
			_mapper = mapper;
			_context = context;

		}
		public async Task<Interest> GetInterestByTitleAsync(string title)
		{
			return await _context.Interests.Include(x => x.UserInterests).FirstOrDefaultAsync(x => x.Title == title);
		}

		public async Task<IEnumerable<Interest>> GetInterestsByUserIdAsync(int id)
		{
			return await _context.Interests.Where(x => x.UserInterests.Any(x => x.UserId == id)).ToListAsync();

		}
		public async Task<bool> SaveAllAsync()
		{
			return await _context.SaveChangesAsync() > 0;
		}

		public void Update(Interest interest)
		{
			_context.Entry(interest).State = EntityState.Modified;
		}

		public void Add(Interest interest)
		{
			_context.Interests.Add(interest);
		}

	}
}