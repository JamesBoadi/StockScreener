using System;
using System.Collections.Generic;
using System.Configuration;
using System.Web;
using EODHistoricalData.NET;
using System.Net;
using System.IO;
using System.Text;
using System.Threading;
using System.Threading.Channels;
using CsvHelper;

namespace StockScreener //https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_server For the database (https://gist.github.com/kevinswiber/1390198)
{
    public class Stock
    {

        public int High_1 { get; set; }
        public int Open_1 { get; set; }
        public int Close_1 { get; set; }
        public int Low_1 { get; set; }
        public int High_2 { get; set; }
        public int Open_2 { get; set; }
        public int Close_2 { get; set; }
        public int Low_2 { get; set; }






    }
}