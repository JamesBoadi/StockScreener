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


        public StockScreenerService(IStockScreenerDatabaseSettings settings)
        {
            var client = new MongoClient("mongodb+srv://dbJames:mn9BfsBg3peDI88L@cluster0.w2zx6.mongodb.net/StockScreenerDb?retryWrites=true&w=majority");
            var database = client.GetDatabase("StockScreenerDb");

            // Get Collection
            _notifications = database.GetCollection<Notifications>("Notifications");
        }

        // Return all documents in a collection
        public List<Notifications> Get() =>
            _notifications.Find(notifications => true).ToList();


        public Notifications Get(string id) =>
            _notifications.Find<Notifications>(notifications => notifications.Id == id).FirstOrDefault();

        public bool Exists(string stockCode)
        {
            var query = _notifications.Find<Notifications>(notifications => notifications.StockCode.Equals(stockCode)).Any();
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
            _notifications.DeleteOne(notifications => notifications.Id == id);


    }
}