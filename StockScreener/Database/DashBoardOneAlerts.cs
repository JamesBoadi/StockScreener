using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json;

namespace StockScreener
{
    public class DashBoardOneAlerts
    {
        // static List<Notifications> notifications = new List<Notifications>();

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _Id { get; set; }

        [BsonElement("Id")]
        public string Id = "0";

        public int[] Index { get; set; }

        public static DashBoardOneAlerts Deserialize(string query)
        {
            // Case Insensitive (Does not exclude capitals and numbers)
            DashBoardOneAlerts data = JsonSerializer.
            Deserialize<DashBoardOneAlerts>(query, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            //Console.WriteLine("data " + data.Id + " stockcode " + data.StockCode);
            return data;
        }
    }
}