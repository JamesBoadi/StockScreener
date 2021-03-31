using System;
using System.Collections.Generic;
using System.Linq;
using System.Collections;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Specialized;
using System.Configuration;
using Microsoft.AspNetCore.Http;
using System.Net.WebSockets;
using System.IO;
using CsvHelper;
using System.Text.Json;
using Newtonsoft.Json.Linq;
using System.Net.Http;
using System.Web.Helpers;

// https://stackoverflow.com/questions/54815199/newtonsoft-json-serialize-deserialize-nested-property

namespace StockScreener.Controllers
{
    [ApiController]
    [Route("/")]
    [Route("[controller]/[action]")]
    public class WeatherForecastController : ControllerBase
    {
        // At compile time
        private readonly ILogger<WeatherForecastController> _logger;

        User user = new User();

        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

     
        // Return stock names in order of subsequence
        [Route("searchstock/{query?}")]   // Attribute route   HttpResponseMessage 
        public string transmitData(string query) // convert to json
        {
            User user = new User();
            StockCode stockCode = new StockCode();
            List<Database> stockList = user.readDatabase();
            List<String> list = new List<String>();
            OrderedDictionary dict = new OrderedDictionary();

            // Remove Whitespaces and double entries
            for (int id = 0; id < stockList.Count; id++)
            {
                string name = stockList[id].Name.ToLower();
                string trimmed = String.Concat(
                name.Where(c => !Char.IsWhiteSpace(c))
                //.Where(c => !Char.IsLetter('-') || !Char.IsLetter('&'))
                );
                // Console.WriteLine(trimmed);
                if (trimmed.Contains(query))
                {
                    if (!list.Contains(name))
                    {
                        list.Add(name);
                        dict.Add(id, name);
                    }
                }
            }
            // Add to the array
            int pointer = 0;
            string res = "";
            string[] arr = new string[dict.Count];

            foreach (DictionaryEntry de in dict)
            {
                res += ((int)de.Key).ToString(); // StockCode
                res += ",";
                res += (string)de.Value; // Id

                arr[pointer] = res;
                res = "";
                pointer++;
            }

            // Return JSON
            stockCode.stockCode = arr;
            string data = JsonSerializer.Serialize(stockCode);
            return data;
        }
/*
        [HttpGet("{page}")] // Conventional route (For pages that do not exist)
        public ContentResult DummyOne(int page)
        {
            return new ContentResult
            {
                ContentType = "text/html",
                Content = "<div>We are sorry this page does not exist</div>"
            };
        }

        /*
         public IEnumerable<WeatherForecast> Get()
         {
             Console.WriteLine("Am I alive, yes?");
             var rng = new Random();
             return Enumerable.Range(1, 5).Select(index => new WeatherForecast
             {
                 Date = DateTime.Now.AddDays(index),
                 TemperatureC = rng.Next(-20, 55),
                 Summary = Summaries[rng.Next(Summaries.Length)]
             })
             .ToArray();
         }*/


        /*Stocks stocks = new Stocks();
        byte[] bytearray = stocks.getRealTimePrices();
        return bytearray;*/


        /*
            HttpRequestMessage requestMessage = new HttpRequestMessage();
            requestMessage.Content = new StringContent(res, UTF8Encoding.UTF8);
            requestMessage.RequestUri = new Uri("https://localhost:44362/test/" + query);
            HttpClient httpClient = new HttpClient();
            await httpClient.SendAsync(requestMessage);


        /* Cancellation token cancels the event if outside time zone (or if not connected, redirect to something went wrong) 

        public static async Task getRealTimePrices(HttpContext context, WebSocket webSocket)
        {

            var buffer = new byte[1024 * 4];

            Console.WriteLine("May id did");
            WebSocketReceiveResult result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), System.Threading.CancellationToken.None);

            while (!result.CloseStatus.HasValue)
            {
                await webSocket.SendAsync(new ArraySegment<byte>(buffer, 0, result.Count), result.MessageType, result.EndOfMessage, System.Threading.CancellationToken.None);
                Console.WriteLine("did id lose an election");

                result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), System.Threading.CancellationToken.None);
            }

            await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, System.Threading.CancellationToken.None);
        }

*/


    }

}
