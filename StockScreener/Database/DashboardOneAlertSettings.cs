using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace StockScreener
{
    public class DashboardOneAlertSettings
    {
        // static List<Notifications> notifications = new List<Notifications>();

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _Id { get; set; }

        [BsonElement("Id")]
        public string Id = "0";

        // ******************************************************
        // Alert Settings
        // ******************************************************

        public long TriggerAlert { get; set; }

        public long Manual { get; set; }

        public long Auto { get; set; }

        public long Notifications { get; set; }

        public long UpdateAlertSettings { get; set; }

        public long AlertInterval { get; set; }
        public long StartTime { get; set; }

        public long EndTime { get; set; }

        public string SettingsTriggered { get; set; }

        public string TimeStamp { get; set; }


        public static DashboardOneAlertSettings Deserialize(string query)
        {
            // Case Insensitive (Does not exclude capitals and numbers)
            DashboardOneAlertSettings data = JsonSerializer.
            Deserialize<DashboardOneAlertSettings>(query, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            //Console.WriteLine("data " + data.Id + " stockcode " + data.StockCode);
            return data;
        }
    }
}