using MongoDB.Bson;
using MongoDB.Driver;

namespace RewardRepository;

public interface IRepository
{
    Task<PagedResult<RewardEntity>> GetRewardsAsync(int pageNumber = 0, int pageSize = 100, int priceSortDirection = 1, FilterDefinition<RewardEntity>? filter = null);
    Task<RewardEntity> CreateAsync(RewardEntity reward);
    Task<bool> UpdateAsync(RewardEntity reward);
    Task<bool> DeleteAsync(ObjectId id);
}
