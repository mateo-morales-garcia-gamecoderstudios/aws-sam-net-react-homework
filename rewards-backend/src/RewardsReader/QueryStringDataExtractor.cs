using System.Text.RegularExpressions;
using MongoDB.Driver;

namespace RewardsReader;

public class QueryStringDataExtractor
{
    public static (int pageNumber, int pageSize, int priceSortDirection, FilterDefinition<RewardRepository.RewardEntity> filter) GetData(IDictionary<string, string> queryString)
    {
        int pageNumber = 0;
        int pageSize = 100;
        int priceSortDirection = 1;
        FilterDefinition<RewardRepository.RewardEntity> filter = Builders<RewardRepository.RewardEntity>.Filter.Empty;
        if (queryString == null)
        {
            return (pageNumber, pageSize, priceSortDirection, filter);
        }
        if (queryString.TryGetValue("page", out var unparsedPage) && int.TryParse(unparsedPage, out int page) && page > 0)
        {
            pageNumber = page;
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
        if (queryString.TryGetValue("priceSort", out var unparsedPriceSort) && int.TryParse(unparsedPriceSort, out int parsedPriceSort) && parsedPriceSort == -1)
        {
            priceSortDirection = -1;
        }
        return (pageNumber, pageSize, priceSortDirection, filter);
    }
}
