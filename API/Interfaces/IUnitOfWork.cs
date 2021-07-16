using System.Threading.Tasks;

namespace API.Interfaces
{
	public interface IUnitOfWork
	{
		IUserRepository UserRepository { get; }
		IInterestRepository InterestRepository { get; }
		Task<bool> Complete();
		bool HasChanges();
	}
}