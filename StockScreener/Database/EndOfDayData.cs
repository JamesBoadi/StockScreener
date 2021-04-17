using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace StockScreener
{
    
    public class EndOfDayData
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _Id { get; set; }
        public string Id { get; set; }
        public double CurrentPrice{ get; set; }
        public string StockCode { get; set; }
        public string StockName { get; set; }
        public string TimeStamp { get; set; }
        public double High { get; set; }
        public double PrevOpen { get; set; }
        public double Close { get; set; }
        public double Low { get; set; }
        public double Change { get; set; }
        public double ChangeP { get; set; }
        public double Volume { get; set; }       
        public int[] ChangeArray { get; set; }       
        public int Signal { get; set; }

        public static EndOfDayData Deserialize(string query)
        {
            // Case Insensitive (Does not exclude capitals and numbers)
            EndOfDayData data = JsonSerializer.
            Deserialize<EndOfDayData>(query, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            //Console.WriteLine("data " + data.Id + " stockcode " + data.StockCode);
            return data;
        }
    }
}