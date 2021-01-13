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

namespace StockScreener //h ttps://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_server For the database (https://gist.github.com/kevinswiber/1390198)
{
    public class Stock
    {
        Utility utiltiy = new Utility();
        private double currentPrice = 0;
        public double CurrentPrice
        {
            get
            {
                return currentPrice;
            }
            set
            {
                currentPrice = (currentPrice >= Close_2) ? currentPrice : Close_2;

                // Update the day move if and only if current price is exceeded
                UtilityFunctions.DayMove += (currentPrice >= Close_2 && UtilityFunctions.DayMove < 3) ? 1 : 0;
            }
        }

        // Contains all the stocks information
        public String StockCode { get; set; }

        public double Change { get; set; }

        public double ChangeP { get; set; }

        public double Volume { get; set; }

        public double Request_Calls { get; set; }

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

        // Time the stock was last updated
        public String timestamp { get; set; }

        // Default alert status
        private string alertstatus = "1D";

        // override object.Equals
        public bool Equals(Stock stock)
        {
            // Update timestamp if price changes
            if (stock.CurrentPrice != this.CurrentPrice)
                return false;
        
            return true;
        }
    
        // Call when updating cache
        public void alertStatus()
        {
            // Mathmatical functions
            bool isBreakOut = utiltiy.breakOut(CurrentPrice, High_1, High_2);
            string tday = Utility.TDays.ToString();

            if (Utility.Reversal == true)
            {
                alertstatus = "Reversal";
            }
            else
            {
                // No BO
                if (Utility.DayMove == 0)
                    alertstatus = "";

                // Current price is above the BO line (configure property)
                else if (Utility.DayMove == 1)
                    alertstatus = "1D";
                else if (Utility.DayMove == 2)
                    alertstatus = "2D";
                else if (Utility.DayMove == 3)
                    alertstatus = "2D~";

                if (!Utility.UpTrend && Utility.DownTrend)
                {
                    alertstatus = "BS1";
                }
                else if (!(Utility.UpTrend && Utility.DownTrend))
                {
                    // Do nothing
                    alertstatus += "";
                }
                else if (Utility.UpTrend && !Utility.DownTrend)
                {
                    alertstatus += " BO " + "T-" + Utility.TDays.ToString();
                }

            }
        }
    }

}