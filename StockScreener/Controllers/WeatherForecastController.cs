using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Configuration;
using Microsoft.AspNetCore.Http;
using System.Net.WebSockets;
using System.IO;
using CsvHelper;





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
        [Route("test")]   // Attribute route   
        public String[] transmitData(String query)
        {
            List<Database> stockList = user.readDatabase();
            List<String> list = new List<String>();
            String char_ = "";

            for (int pointer = 1; pointer <= query.Length; pointer++)
            {
                char_ += query.Substring(0, pointer);

                for (int i = 0; i < stockList.Count; i++)
                {
                    Console.WriteLine(stockList[i].Code);

                    if (stockList[i].Name.Substring(0, pointer).Equals(char_))
                    {
                        if (!list.Contains(stockList[i].Name))
                            list.Add(stockList[i].Name);
                    }
                }
            }

            

            return list.ToArray();
        }




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


        /* Cancellation token cancels the event if outside time zone (or if not connected, redirect to something went wrong) */

        public static async Task getRealTimePrices(HttpContext context, WebSocket webSocket)
        {

            var buffer = new byte[1024 * 4];

            Console.WriteLine("May i did");
            WebSocketReceiveResult result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), System.Threading.CancellationToken.None);

            while (!result.CloseStatus.HasValue)
            {
                await webSocket.SendAsync(new ArraySegment<byte>(buffer, 0, result.Count), result.MessageType, result.EndOfMessage, System.Threading.CancellationToken.None);
                Console.WriteLine("did i lose an election");

                result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), System.Threading.CancellationToken.None);
            }

            await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, System.Threading.CancellationToken.None);
        }




    }

}
