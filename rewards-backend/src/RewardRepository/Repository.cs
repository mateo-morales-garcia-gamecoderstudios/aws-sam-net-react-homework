using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Driver;

namespace RewardRepository;

public class Repository : IRepository
{
    private readonly IMongoCollection<RewardEntity> collection;

    public Repository(IMongoDatabase db)
    {
        collection = db.GetCollection<RewardEntity>("rewards");
    }

    public async Task<bool> CreateAsync(RewardEntity reward)
    {
        try
        {
            await collection.InsertOneAsync(reward);
            Console.WriteLine("Reward {} is added", reward.Id);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.ToString(), "fail to persist to MongoDB Collection");
            return false;
        }
        return true;
    }

    public async Task<bool> UpdateAsync(RewardEntity reward)
    {
        try
        {
            var filter = Builders<RewardEntity>.Filter
                .Eq(r => r.Id, reward.Id);
            var result = await collection.ReplaceOneAsync(filter, reward);

            if (result.IsAcknowledged && result.ModifiedCount > 0)
            {
                Console.WriteLine("Reward {} is updated", reward.Id);
                return true;
            }

            if (result.ModifiedCount == 0)
            {
                Console.WriteLine("Reward {} not found for update", reward.Id);
            }
            return false;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.ToString(), "fail to persist to MongoDB Collection");
            return false;
        }
    }

    public async Task<bool> DeleteAsync(ObjectId id)
    {
        try
        {
            var filter = Builders<RewardEntity>.Filter
                .Eq(r => r.Id, id);
            var result = await collection.DeleteOneAsync(filter);
            if (result.IsAcknowledged && result.DeletedCount > 0)
            {
                Console.WriteLine("Reward {} is deleted", id);
                return true;
            }
            if (result.DeletedCount == 0)
            {
                Console.WriteLine("Reward {} not found for delete", id);
            }
            return false;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.ToString(), "fail to persist to MongoDB Collection");
            return false;
        }
    }


    public async Task<PagedResult<RewardEntity>> GetRewardsAsync(int pageNumber = 0, int pageSize = 100, int priceSortDirection = 1, FilterDefinition<RewardEntity>? filter = null)
    {
        filter ??= Builders<RewardEntity>.Filter.Empty;
        long totalCount = await collection.CountDocumentsAsync(filter);
        int skipAmount = Math.Max(0, (pageNumber - 1) * pageSize);
        var sortDocument = new BsonDocument { { "Price", priceSortDirection } };
        var items = await collection
            .Find(filter)
            .Sort(sortDocument)
            .Skip(skipAmount)
            .Limit(pageSize)
            .ToListAsync();

        return new PagedResult<RewardEntity>
        {
            TotalCount = (int)totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize,
            Items = items
        };
    }

}

public class PagedResult<T>
{
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public List<T> Items { get; set; } = new List<T>();
}
