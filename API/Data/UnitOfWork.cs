using System.Threading.Tasks;
using API.Interfaces;
using AutoMapper;

namespace API.Data
{
	public class UnitOfWork : IUnitOfWork
	{
		private readonly IMapper _mapper;
		private readonly DataContext _context;
		public UnitOfWork(DataContext context, IMapper mapper)
		{
			_context = context;
			_mapper = mapper;

		}
		public IUserRepository UserRepository => new UserRepository(_context, _mapper);

		public IInterestRepository InterestRepository => new InterestRepository(_context, _mapper);

		public IFriendsRepository FriendsRepository => new FriendsRepository(_context, _mapper);

		public IMessageRepository MessageRepository => new MessageRepository(_context, _mapper);
		public IGuffRepository GuffRepository => new GuffRepository(_context, _mapper);
		public async Task<bool> Complete()
		{
			return await _context.SaveChangesAsync() > 0;
		}

		public bool HasChanges()
		{
			_context.ChangeTracker.DetectChanges();
			return _context.ChangeTracker.HasChanges();
		}
	}
}