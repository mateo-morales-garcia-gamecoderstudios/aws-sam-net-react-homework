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

    public async Task<RewardEntity> CreateAsync(RewardEntity reward)
    {
        await collection.InsertOneAsync(reward);
        Console.WriteLine($"Reward {reward.Id} is added");
        return reward;
    }

    public async Task<bool> UpdateAsync(RewardUpdateObject reward)
    {
        try
        {
            var filter = Builders<RewardEntity>.Filter
                .Eq(r => r.Id, reward.Id);
            var result = await collection.ReplaceOneAsync(filter, reward);

            if (result.IsAcknowledged && result.ModifiedCount > 0)
            {
                Console.WriteLine($"Reward {reward.Id} is updated");
                return true;
            }

            if (result.ModifiedCount == 0)
            {
                Console.WriteLine($"Reward {reward.Id} not found for update");
            }
            return false;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.ToString() + "fail to persist to MongoDB Collection");
            return false;
        }
    }

    public async Task<bool> DeleteAsync(ObjectId id)
    {
        try
        {
            var filter = Builders<RewardEntity>.Filter
                .Eq(r => r.Id, id.ToString());
            var result = await collection.DeleteOneAsync(filter);
            if (result.IsAcknowledged && result.DeletedCount > 0)
            {
                Console.WriteLine($"Reward {id} is deleted");
                return true;
            }
            if (result.DeletedCount == 0)
            {
                Console.WriteLine($"Reward {id} not found for delete");
            }
            return false;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.ToString() + "fail to persist to MongoDB Collection");
            return false;
        }
    }


    public async Task<PagedResult<RewardEntity>> GetRewardsAsync(int pageNumber = 1, int pageSize = 100, int priceSortDirection = 0, FilterDefinition<RewardEntity>? filter = null)
    {
        filter ??= Builders<RewardEntity>.Filter.Empty;
        long totalCount = await collection.CountDocumentsAsync(filter);
        int skipAmount = Math.Max(0, (pageNumber - 1) * pageSize);
        var finder = collection
            .Find(filter)
            .Skip(skipAmount)
            .Limit(pageSize);

        if (priceSortDirection != 0)
        {
            var sortDocument = new BsonDocument { { "Price", priceSortDirection } };
            finder = finder.Sort(sortDocument);
        }

        var items = await finder.ToListAsync();

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
