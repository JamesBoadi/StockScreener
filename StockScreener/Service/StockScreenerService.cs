using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;

namespace StockScreener
{
    public class StockScreenerService
    {
        // Establish Collection
        private readonly IMongoCollection<Notifications> _notifications;


        
        public StockScreenerService(IStockScreenerDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            // Get Collection
            _notifications = database.GetCollection<Notifications>(settings.BooksCollectionName);
        }

        // Return all documents
        public List<Notifications> Get() =>
            _notifications.Find(notifications => true).ToList();

        // S
        public Notifications Get(string id) =>
            _notifications.Find<Notifications>(notifications => notifications.Id == id).FirstOrDefault();

        public Notifications Create(Notifications notifications)
        {
            _notifications.InsertOne(notifications);
            return notifications;
        }

        public void Remove(Notifications notifcations) =>
            _notifications.DeleteOne(notifications => notifications.Id == notifcations.Id);

        public void Remove(string id) => 
            _notifications.DeleteOne(notifications => notifications.Id == id);

            
    }
}