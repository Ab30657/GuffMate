using System.Collections.Generic;
using System.Threading.Tasks;
using API.Entities;

namespace API.Interfaces
{
	public interface IInterestRepository
	{
		void Add(Interest interest);
		void Update(Interest interest);
		Task<bool> SaveAllAsync();

		Task<IEnumerable<Interest>> GetInterestsAsync();
		Task<Interest> GetInterestByTitleAsync(string title);



	}
}