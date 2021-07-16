using System.Collections.Generic;
using System.Threading.Tasks;
using API.Entities;

namespace API.Interfaces
{
	public interface IInterestRepository
	{
		void Add(Interest interest);
		void Update(Interest interest);
		Task<IEnumerable<Interest>> GetInterestsByUserIdAsync(int id);
		Task<Interest> GetInterestByTitleAsync(string title);


	}
}