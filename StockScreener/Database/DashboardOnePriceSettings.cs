using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json;

namespace StockScreener
{
    public class DashboardOnePriceSettings
    {
        // static List<Notifications> notifications = new List<Notifications>();

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _Id { get; set; }

        [BsonElement("Id")]
        public string Id = "0";
        // ******************************************************
        // PriceSettings
        // ******************************************************

        public long StartPrice { get; set; }

        public long TargetPrice { get; set; }

        public long PriceDetectionEnabled { get; set; }

        public long HideBullishStocks { get; set; }

        public long HideBearishStocks { get; set; }

        // ******************************************************
        public static DashboardOnePriceSettings Deserialize(string query)
        {
            // Case Insensitive (Does not exclude capitals and numbers)
            DashboardOnePriceSettings data = JsonSerializer.
            Deserialize<DashboardOnePriceSettings>(query, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            //Console.WriteLine("data " + data.Id + " stockcode " + data.StockCode);
            return data;
        }
    }
}