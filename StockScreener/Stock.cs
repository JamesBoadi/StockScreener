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

          // Stock Name
        public String StockCode {get; set;}

        public double Change {get; set;}

        public double ChangeP {get; set;}

        public double Volume {get; set;}

        public double Request_Calls {get; set;}   
                 
        // The value for the previous day
        public double High_1 { get; set; }
        public double Open_1 { get; set; }
        public double Close_1 { get; set; }
        public double Low_1 { get; set; }

        // The values for the next day (current day)
        public double High_2 { get; set; }
        public double Open_2 { get; set; }
        public double Close_2 { get; set; }
        public double Low_2 { get; set; }

    }
}