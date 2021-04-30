using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json;
using System;

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

        public bool Manual { get; set; }

        public bool Auto { get; set; }
        public bool UpdateAlertSettings { get; set; }

        public int AlertInterval { get; set; }
        public string StartTime { get; set; }

        public string EndTime { get; set; }

        public int SettingsTriggered { get; set; }

        public string TimeStamp { get; set; }


        public static DashboardOneAlertSettings Deserialize(string query)
        {
            // Case Insensitive (Does not exclude capitals and numbers)
            DashboardOneAlertSettings data = JsonSerializer.
            Deserialize<DashboardOneAlertSettings>(query, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            Console.WriteLine("data " + data.Id + " stockcode " + data.Auto + "  " + data.EndTime);
            return data;
        }
    }
}