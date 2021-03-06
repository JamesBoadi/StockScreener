using System;
using System.Collections.Generic;
using System.Linq;
using System.Collections;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json;

namespace StockScreener
{
    public class Notifications
    {
        // static List<Notifications> notifications = new List<Notifications>();

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _Id { get; set; }

        // [BsonElement("Name")]
        public int Id { get; set; }
        public string Alert { get; set; }

        public string TimeStamp { get; set; }
        public static Notifications Deserialize(string query)
        {
         
            // Case Insensitive (Does not exclude capitals and numbers)
            Notifications data = JsonSerializer.
            Deserialize<Notifications>(query, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            //Console.WriteLine("data " + data.Id + " stockcode " + data.StockCode);
            return data;
        }
    }
}