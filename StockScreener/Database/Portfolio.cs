using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json;

namespace StockScreener
{
    public class Portfolio
    {
        // static List<Notifications> notifications = new List<Notifications>();

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _Id { get; set; }

        public string Id { get; set; }

        public long Price { get; set; }

        public long Shares { get; set; }

        public string Date { get; set; }

        public static Portfolio Deserialize(string query)
        {
            // Case Insensitive (Does not exclude capitals and numbers)
            Portfolio data = JsonSerializer.
            Deserialize<Portfolio>(query, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            //Console.WriteLine("data " + data.Id + " stockcode " + data.StockCode);
            return data;
        }
    }
}