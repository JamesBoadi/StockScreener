namespace StockScreener
{
    public class StockScreenerDatabaseSettings : IStockScreenerDatabaseSettings
    {
        public string StockScreenerCollectionName { get; set; }
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
        
    }

    public interface IStockScreenerDatabaseSettings
    {
        string StockScreenerCollectionName { get; set; }
        string ConnectionString { get; set; }
        string DatabaseName { get; set; }
    }
}