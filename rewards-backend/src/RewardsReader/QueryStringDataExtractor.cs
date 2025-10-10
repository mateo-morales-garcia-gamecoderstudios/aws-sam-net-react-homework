using System.Text.RegularExpressions;
using MongoDB.Driver;

namespace RewardsReader;

public class QueryStringDataExtractor
{
    static readonly int maxPageSize;

    static QueryStringDataExtractor()
    {
        if (!int.TryParse(Environment.GetEnvironmentVariable("MAX_REWARDS_PAGE_SIZE"), out maxPageSize))
        {
            maxPageSize = 100; // fallback max value
        }
    }
    public static (int pageNumber, int pageSize, int priceSortDirection, FilterDefinition<RewardRepository.RewardEntity> filter) GetData(IDictionary<string, string> queryString)
    {
        int pageNumber = 1;
        int pageSize = 5;
        int priceSortDirection = 0;
        FilterDefinition<RewardRepository.RewardEntity> filter = Builders<RewardRepository.RewardEntity>.Filter.Empty;
        if (queryString == null)
        {
            return (pageNumber, pageSize, priceSortDirection, filter);
        }
        if (queryString.TryGetValue("page", out var unparsedPage) && int.TryParse(unparsedPage, out int page) && page > 1)
        {
            pageNumber = page;
        }
        if (queryString.TryGetValue("pageSize", out var unparsedPageSize) && int.TryParse(unparsedPageSize, out int parsedPageSize) && parsedPageSize > 5)
        {
            pageSize = Math.Min(maxPageSize, parsedPageSize);
        }
        if (queryString.TryGetValue("name", out var name) && !string.IsNullOrEmpty(name.Trim()))
        {
            var fieldFilter = Builders<RewardRepository.RewardEntity>.Filter.Regex("Name", new Regex(name));
            filter &= fieldFilter;
        }
        if (queryString.TryGetValue("category", out var category) && !string.IsNullOrEmpty(category.Trim()))
        {
            var fieldFilter = Builders<RewardRepository.RewardEntity>.Filter.Regex("Category", new Regex(category));
            filter &= fieldFilter;
        }
        if (queryString.TryGetValue("priceSort", out var unparsedPriceSort) && int.TryParse(unparsedPriceSort, out int parsedPriceSort))
        {
            priceSortDirection = Math.Clamp(parsedPriceSort, -1, 1);
        }
        return (pageNumber, pageSize, priceSortDirection, filter);
    }
}
