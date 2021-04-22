using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json;

namespace StockScreener
{
    public class SavedStocks
    {
        // static List<Notifications> notifications = new List<Notifications>();

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _Id { get; set; }

        // [BsonElement("Name")]
        public string Id { get; set; }
        
        public string StockCode { get; set; }

        public string TimeStamp { get; set; }

        public double CurrentPrice { get; set; }

        public double ChangeP { get; set; }

        public double Volume { get; set; }
        public static SavedStocks Deserialize(string query)
        {
            // Case Insensitive (Does not exclude capitals and numbers)
            SavedStocks data = JsonSerializer.
            Deserialize<SavedStocks>(query, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            //Console.WriteLine("data " + data.Id + " stockcode " + data.StockCode);
            return data;
        }
    }
}