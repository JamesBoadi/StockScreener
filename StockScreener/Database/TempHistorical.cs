using System;
using System.Collections.Generic;
using System.Linq;
using System.Collections;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json;

namespace StockScreener
{
    public class TempHistorical
    {
        // static List<Notifications> notifications = new List<Notifications>();

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _Id { get; set; }

        public string Id { get; set; }

        public string Date { get; set; }

        public static TempHistorical Deserialize(string query)
        {
            // Case Insensitive (Does not exclude capitals and numbers)
            TempHistorical data = JsonSerializer.
            Deserialize<TempHistorical>(query, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            //Console.WriteLine("data " + data.Id + " stockcode " + data.StockCode);
            return data;
        }
    }
}