using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;
using System;

namespace StockScreener
{
    public class StockScreenerService
    {
        // Establish Collection
        private readonly IMongoCollection<Notifications> _notifications;

        private readonly IMongoCollection<TempHistorical> _tempHistoricalData; //Temporary

        private readonly IMongoCollection<Historical> _historicalData; // History saved End Of Day

        private readonly IMongoCollection<EndOfDayData> _eodData;

        public StockScreenerService(IStockScreenerDatabaseSettings settings)
        {
            var client = new MongoClient("mongodb+srv://dbJames:mn9BfsBg3peDI88L@cluster0.w2zx6.mongodb.net/StockScreenerDb?socketTimeoutMS=360000&"
            + "retryWrites=true&w=majority");

            var database = client.GetDatabase("StockScreenerDb");

            // Get Collection
            _notifications = database.GetCollection<Notifications>("Notifications");
            _tempHistoricalData = database.GetCollection<TempHistorical>("TempHistoricalData");
            _historicalData = database.GetCollection<Historical>("HistoricalData");
            _eodData = database.GetCollection<EndOfDayData>("EODdata");
        }

        // **************************************************
        // Notifications
        // **************************************************

        // Return all documents in a collection
        public List<Notifications> Get() =>
            _notifications.Find(notifications => true).ToList();


        public Notifications Get(string id) =>
            _notifications.Find<Notifications>(notifications => notifications.Id == id).FirstOrDefault();

        public bool StockCodeExists(string stockCode)
        {
            var query = _notifications.Find<Notifications>(notifications => notifications.StockCode.Equals(stockCode)).Any();
            return query;
        }

        public bool IdExists(string id)
        {
            var query = _notifications.Find<Notifications>(notifications => notifications.Id.Equals(id)).Any();
            return query;
        }

        public Notifications Create(Notifications notifications)
        {
            // Insert document in collection
            _notifications.InsertOne(notifications);
            return notifications;
        }

        public void Remove(Notifications notifcations) =>
            _notifications.DeleteOne(notifications => notifications.Id == notifcations.Id);

        public void Remove(string id) =>
            _notifications.DeleteOne(notifications => notifications.Id.Equals(id));

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


    }
}