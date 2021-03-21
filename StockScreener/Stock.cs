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
using System.Text.Json;
using System.Linq;

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
            /*  set
              {
                  currentPrice = (currentPrice >= Close_2) ? currentPrice : Close_2;

                  // Update the day move if and only if current price is exceeded (Once every day)
                  UtilityFunctions.DayMove += (currentPrice >= Close_2 && UtilityFunctions.DayMove < 3) ? 1 : 0;
              }*/
        }
        
        // Contains all the stocks information
        public String StockCode { get; set; }
        public double High { get; set; }
        public double Open { get; set; }
        public double Close { get; set; }
        public double Low { get; set; }
        public double Change { get; set; }
        public double ChangeP { get; set; }
        public double ProfitLoss { get; set; }
        public double ProfitLoss_Percentage { get; set; }
        public double Volume { get; set; }
        public int[] ChangeArray { get; set; }

        public int Signal { get; set; }
        public double Request_Calls { get; set; }

        // Time the stock was last updated
        public String TimeStamp { get; set; }

        // Default alert status
        private string alertstatus = "1D";

        public String alertStatusColor = "RED";

        public String scalpStatusColor = "GREEN";

        /// <summary>Compare the equality of stocks</summary>
        public bool Equals(Stock stock)
        {
            // Default states 2, -1, 0
            if (stock.CurrentPrice == this.CurrentPrice)
            {
                Stocks.changeArray[0] = 0;
            }
            else
            {
                Stocks.changeArray[0] = (stock.CurrentPrice < this.CurrentPrice) ? -1 : 2;
            }
            if (stock.High == this.High)
            {
                Stocks.changeArray[1] = 0;
            }
            else
            {
                Stocks.changeArray[1] = (stock.High < this.High) ? -1 : 2;
            }
            if (stock.Low == this.Low)
            {
                Stocks.changeArray[2] = 0;
            }
            else
            {
                Stocks.changeArray[2] = (stock.Low < this.Low) ? -1 : 2;
            }
            if (stock.ProfitLoss == this.ProfitLoss)
            {
                Stocks.changeArray[3] = 0;
            }
            else
            {
                Stocks.changeArray[3] = (stock.ProfitLoss < this.ProfitLoss) ? -1 : 2;
            }
            if (stock.ProfitLoss_Percentage == this.ProfitLoss_Percentage)
            {

                Stocks.changeArray[4] = 0;
            }
            else
            {
                Stocks.changeArray[4] = (stock.ProfitLoss_Percentage < this.ProfitLoss_Percentage) ? -1 : 2;
            }
            if (stock.Volume == this.Volume)
                Stocks.changeArray[5] = 0;
            else
            {
                Stocks.changeArray[5] = (stock.Volume < this.Volume) ? -1 : 2;
            }

            return Stocks.changeArray.Contains(-1) || Stocks.changeArray.Contains(2);
        }

        // Convert to JSON notation
        public string Serialize()
        {
            return JsonSerializer.Serialize(this);
        }

        // Call when updating cache
        /*   public void alertStatus()
           {
               // Mathmatical functions
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
                       alertstatus += " BO " + "T-" + tday;
                   }

               } 
           } */
    }

}