using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;
using System;
using System.Configuration;
using System.Threading;
using System.Threading.Tasks;

namespace StockScreener
{
    public class StockScreenerService
    {
        private readonly string CONNECTION_STRING = ConfigurationManager.AppSettings["CONNECTION_STRING"];
        // Establish Collection
        private readonly IMongoCollection<Notifications> _notifications;

        private readonly IMongoCollection<TempHistorical> _tempHistoricalData; //Temporary

        private readonly IMongoCollection<Historical> _historicalData; // History saved End Of Day

        private readonly IMongoCollection<EndOfDayData> _eodData;

        private readonly IMongoCollection<SavedStocks> _savedStocks;

        private readonly IMongoCollection<DashboardOneAlertSettings> _dashboardOneAlertSettings;

        private readonly IMongoCollection<DashboardOnePriceSettings> _dashboardOnePriceSettings;

        private readonly IMongoCollection<Portfolio> _portfolio;

        private readonly IMongoCollection<DashBoardOneAlerts> _dashboardOneAlerts;

        // private readonly IMongoCollection<SavedStocks> _savedStocks;

        public StockScreenerService(IStockScreenerDatabaseSettings settings)
        {
            var client = new MongoClient("mongodb+srv://dbJames:" + CONNECTION_STRING + "@cluster0.w2zx6.mongodb.net/StockScreenerDb?socketTimeoutMS=360000&retryWrites=true&w=majority");
            var database = client.GetDatabase("StockScreenerDb");
            //  database.CreateCollection(0001.KLSE, 0002.KLSE ETCCCCCC)
            // Get Collection
            _notifications = database.GetCollection<Notifications>("Notifications");
            _tempHistoricalData = database.GetCollection<TempHistorical>("TempHistoricalData");
            _savedStocks = database.GetCollection<SavedStocks>("SavedStocks");
            _historicalData = database.GetCollection<Historical>("HistoricalData");
            _eodData = database.GetCollection<EndOfDayData>("EODdata");
            _dashboardOneAlertSettings = database.GetCollection<DashboardOneAlertSettings>("DashboardOneAlertSettings");
            _dashboardOnePriceSettings = database.GetCollection<DashboardOnePriceSettings>("DashboardOnePriceSettings");
            _portfolio = database.GetCollection<Portfolio>("Portfolio");
            _dashboardOneAlerts = database.GetCollection<DashBoardOneAlerts>("DashboardOneAlerts");
        }

        // **************************************************
        // Notifications
        // **************************************************

        // Return all documents in a collection
        public Task<List<Notifications>> Get() =>
            _notifications.Find(notifications => true).ToListAsync();


        public Notifications Get(int id) =>
            _notifications.Find<Notifications>(notifications => notifications.Id == id).FirstOrDefaultAsync().Result;


        public bool NotificationsIdExists(int id)
        {
            var query = _notifications.Find<Notifications>(notifications => notifications.Id == id).AnyAsync();
            return query.Result;
        }

        public Notifications Create(Notifications notifications)
        {
            // Insert document in collection
            _notifications.InsertOneAsync(notifications);
            return notifications;
        }

        public void Remove(Notifications notifcations) =>
            _notifications.DeleteOneAsync(notifications => notifications.Id == notifcations.Id);

        public void Remove(int id) =>
            _notifications.DeleteOneAsync(notifications => notifications.Id == id);

        // **************************************************

        // **************************************************
        // Temp Historical
        // **************************************************
        public List<TempHistorical> GetTempHistoricalData() =>
            _tempHistoricalData.Find(historical => true).ToList();

        public TempHistorical Create(TempHistorical historical)
        {
            // Insert document in collection
            _tempHistoricalData.InsertOne(historical);
            return historical;
        }


        public bool TempIdExists(string id)
        {
            var query = _tempHistoricalData.Find<TempHistorical>(savedstocks => savedstocks.Id.Equals(id)).Any();
            return query;
        }

        public bool TempHistoricalIdExists(string id)
        {
            var query = _tempHistoricalData.Find<TempHistorical>(historical => historical.Id.Equals(id)).Any();
            return query;
        }

        public void RemoveTempHistoricalId(string id) =>
           _tempHistoricalData.DeleteOne(historical => historical.Id.Equals(id));

        // **************************************************

        // **************************************************
        // Historical
        // **************************************************

        public List<Historical> GetHistoricalData() =>
            _historicalData.Find(historical => true).ToList();

        public Historical Create(Historical historical)
        {
            // Insert document in collection
            _historicalData.InsertOne(historical);
            return historical;
        }

        public bool HistoricalIdExists(string id)
        {
            var query = _historicalData.Find<Historical>(historical => historical.Id.Equals(id)).Any();
            return query;
        }

        public void RemoveHistoricalId(string id) =>
           _historicalData.DeleteOne(historical => historical.Id.Equals(id));

        // **************************************************

        // **************************************************
        // EOD data
        // **************************************************

        public List<EndOfDayData> GetEODdata() =>
            _eodData.Find(historical => true).ToList();

        public bool EODIdExists(string id)
        {
            var query = _eodData.Find<EndOfDayData>(historical => historical.Id.Equals(id)).Any();
            return query;
        }

        public EndOfDayData Update(string id, EndOfDayData historical)
        {
            var query = _eodData.FindOneAndReplace<EndOfDayData>(historical => historical.Id.Equals(id), historical);
            return query;
        }

        public EndOfDayData Create(EndOfDayData historical)
        {
            // Insert document in collection
            _eodData.InsertOne(historical);
            return historical;
        }

        public void ClearEODdata(string id) =>
           _eodData.DeleteOne(historical => historical.Id.Equals(id));

        // **************************************************

        // **************************************************
        // Saved Stocks
        // **************************************************

        // Return all documents in a collection
        public List<SavedStocks> GetAllSavedStocks() =>
            _savedStocks.Find(savedstocks => true).ToList();


        public SavedStocks GetSavedStocks(string id) =>
            _savedStocks.Find<SavedStocks>(savedstocks => savedstocks.Id == id).FirstOrDefault();

        public bool SavedStockExists(string id)
        {
            var query = _savedStocks.Find<SavedStocks>(savedstocks => savedstocks.Id.Equals(id)).Any();
            return query;
        }

        public SavedStocks Create(SavedStocks savedstocks)
        {
            // Insert document in collection
            _savedStocks.InsertOne(savedstocks);
            return savedstocks;
        }

        public void Remove(SavedStocks savedstocks) =>
            _savedStocks.DeleteOne(savedstocks => savedstocks.Id == savedstocks.Id);

        public void RemoveSavedStock(string id) =>
            _savedStocks.DeleteOne(savedstocks => savedstocks.Id.Equals(id));

        // **************************************************

        // **************************************************
        // Alert Settings
        // **************************************************

        // Return all documents in a collection
        public List<DashboardOneAlertSettings> GetAlertSettings() =>
            _dashboardOneAlertSettings.Find(settings => true).ToList();

        public async Task Create(DashboardOneAlertSettings settings)
        {
            await _dashboardOneAlertSettings.InsertOneAsync(settings);
        }


        public async Task UpdateAlertSettings(DashboardOneAlertSettings settings)
        {
            var filter = Builders<DashboardOneAlertSettings>.Filter.Eq("Id", "0");
        
            var manual = Builders<DashboardOneAlertSettings>.Update.Set("Manual", settings.Manual);
            var auto = Builders<DashboardOneAlertSettings>.Update.Set("Auto", settings.Auto);
  
            var updatealertsettings = Builders<DashboardOneAlertSettings>.Update.Set("UpdateAlertSettings", settings.UpdateAlertSettings);
            var alertinterval = Builders<DashboardOneAlertSettings>.Update.Set("AlertInterval", settings.AlertInterval);
            var st = Builders<DashboardOneAlertSettings>.Update.Set("StartTime", settings.StartTime);
            var et = Builders<DashboardOneAlertSettings>.Update.Set("EndTime", settings.EndTime);
            var st2 = Builders<DashboardOneAlertSettings>.Update.Set("SettingsTriggered", settings.SettingsTriggered);
            var ts = Builders<DashboardOneAlertSettings>.Update.Set("TimeStamp", settings.TimeStamp);

            
            _ = _dashboardOneAlertSettings.UpdateOneAsync(filter, manual);
            _ = _dashboardOneAlertSettings.UpdateOneAsync(filter, auto);
      
            _ = _dashboardOneAlertSettings.UpdateOneAsync(filter, updatealertsettings);
            _ = _dashboardOneAlertSettings.UpdateOneAsync(filter, alertinterval);
            _ = _dashboardOneAlertSettings.UpdateOneAsync(filter, st);
            _ = _dashboardOneAlertSettings.UpdateOneAsync(filter, et);
            _ = _dashboardOneAlertSettings.UpdateOneAsync(filter, st2);
            _ = _dashboardOneAlertSettings.UpdateOneAsync(filter, ts);

            await Task.Delay(100);
        }

        public bool FindDashboardOneAlertSettings(string id)
        {
            var query = _dashboardOneAlertSettings.Find<DashboardOneAlertSettings>(historical => historical.Id.Equals(id)).Any();
            return query;
        }

        public async Task DeleteDashboardOneAlertSettings(string id) =>
             await _dashboardOneAlertSettings.DeleteOneAsync(settings => settings.Id.Equals(id));

        // **************************************************

        // **************************************************
        // Price Settings
        // **************************************************

        public List<DashboardOnePriceSettings> GetPriceSettings() =>
            _dashboardOnePriceSettings.Find(settings => true).ToList();

        public async Task Create(DashboardOnePriceSettings settings)
        {
            await _dashboardOnePriceSettings.InsertOneAsync(settings);
        }

        public bool FindDashboardOnePriceSettings(string id)
        {
            var query = _dashboardOnePriceSettings.Find<DashboardOnePriceSettings>(historical => historical.Id.Equals(id)).Any();
            return query;
        }

        public async Task UpdatePriceSettings(DashboardOnePriceSettings settings)
        {
            var filter = Builders<DashboardOnePriceSettings>.Filter.Eq("Id", "0");

            var sp = Builders<DashboardOnePriceSettings>.Update.Set("GlobalStartPrice", settings.GlobalStartPrice);
            var tp = Builders<DashboardOnePriceSettings>.Update.Set("GlobalTargetPrice", settings.GlobalTargetPrice);
            var pd = Builders<DashboardOnePriceSettings>.Update.Set("PriceDetectionEnabled", settings.PriceDetectionEnabled);
            var hs = Builders<DashboardOnePriceSettings>.Update.Set("HideBullishStocks", settings.HideBullishStocks);
            var hs2 = Builders<DashboardOnePriceSettings>.Update.Set("HideBearishStocks", settings.HideBearishStocks);

            _ = _dashboardOnePriceSettings.UpdateOneAsync(filter, sp);
            _ = _dashboardOnePriceSettings.UpdateOneAsync(filter, tp);
            _ = _dashboardOnePriceSettings.UpdateOneAsync(filter, pd);
            _ = _dashboardOnePriceSettings.UpdateOneAsync(filter, hs);
            _ = _dashboardOnePriceSettings.UpdateOneAsync(filter, hs2);

            await Task.Delay(100);
        }

        public async Task DeleteDashboardOnePriceSettings(string id)
        {
            await _dashboardOneAlertSettings.DeleteOneAsync(settings => settings.Id.Equals(id));
        }


        // **************************************************

        // **************************************************
        // Portfolio
        // **************************************************

        public List<Portfolio> GetPortfolio() =>
            _portfolio.Find(settings => true).ToList();

        public Portfolio GetPortfolioStock(int stockcode) =>
            _portfolio.Find<Portfolio>(settings => settings.StockCode == stockcode).FirstOrDefault();

        public bool PortfolioStockExists(int stockcode)
        {
            var query = _portfolio.Find<Portfolio>(settings => settings.StockCode == stockcode).Any();
            return query;
        }

        public Portfolio Create(Portfolio settings)
        {
            _portfolio.InsertOne(settings);
            return settings;
        }

        public void DeletePortfolio(int stockcode) =>
             _portfolio.DeleteOne(settings => settings.StockCode == stockcode);

        // **************************************************


        // **************************************************
        // Dashboard One Alerts
        // **************************************************

        public List<DashBoardOneAlerts> GetDashboardOneAlerts() =>
             _dashboardOneAlerts.Find(settings => true).ToList();

        public DashBoardOneAlerts Create(DashBoardOneAlerts settings)
        {
            _dashboardOneAlerts.InsertOne(settings);
            return settings;
        }

        public bool DashBoardOneAlertsExists(int id)
        {
            var query = _dashboardOneAlerts.Find<DashBoardOneAlerts>(settings => settings.Id ==id).Any();
            return query;
        }


        public void UpdateDashboardOneAlerts(int id, DashBoardOneAlerts settings)
        {
            var filter = Builders<DashBoardOneAlerts>.Filter.Eq("Id", id);
            var alert = Builders<DashBoardOneAlerts>.Update.Set("Id", settings.Id);
            var state = Builders<DashBoardOneAlerts>.Update.Set("State", settings.State);

            _ = _dashboardOneAlerts.UpdateOne(filter, alert);
            _ = _dashboardOneAlerts.UpdateOne(filter, state);


        }

        public void DeleteDashboardOneAlerts(int id) =>
             _dashboardOneAlerts.DeleteOne(settings => settings.Id == id);

        // **************************************************
    }
}