using System;
using Microsoft.Extensions.Caching.Memory;
using System.Collections.Generic;
using System.Text.Json;

namespace StockScreener //h ttps://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_server For the database (https://gist.github.com/kevinswiber/1390198)
{
    public class Stock
    {
        private static IMemoryCache _cache;
        //private readonly MemoryCache memoryCache = new MemoryCache(_cache);
        public List<Stock> list = new List<Stock>(); // Might not be needed

        // int Pointer = 0;
        public Stock(string id,
        string StockCode, string StockName, string TimeStamp, double CurrentPrice,
         double Change, double ChangeP, double Volume, int[] ChangeArray,
        double High, double Low, int Signal, double PrevOpen, double Close)
        {
            this.Id = id;
            this.StockCode = StockCode;
            this.StockName = StockName;
            this.TimeStamp = TimeStamp;
            this.CurrentPrice = CurrentPrice;
            this.PrevOpen = PrevOpen;
            this.Close = Close;
            this.High = High;
            this.Low = Low;
            this.Signal = Signal;
            this.ChangeArray = ChangeArray;
            this.Volume = Volume;
            this.ChangeP = ChangeP;
            this.Change = Change;

            list.Add(this);
        }

        // Contains all the stocks information
        public string Id { get; set; }
        public double CurrentPrice { get; set; }
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


        /// <summary>Compare the equality of stocks</summary>
        public Stock Update(Stock stock)
        {
             Time time = new Time();
             TimeSpan _time = time.ReturnTime();
             string hour = _time.Hours.ToString();
             string minutes = _time.Minutes.ToString();

            // Default states 2, -1, 0
            if (stock.CurrentPrice == this.CurrentPrice)
                stock.ChangeArray[0] = 0; // No Change
            else
            {
                // Bearish signal 2 if stock drops below 30%
                stock.ChangeArray[0] =  (stock.CurrentPrice < this.CurrentPrice - (this.CurrentPrice * 0.3))
                ? -2 : (stock.CurrentPrice < this.CurrentPrice) ? -1 : 2; 
                // Update timeStamp
                stock.TimeStamp = hour + ":" + minutes;
            } // Add other variables later

            return stock;
        }

        // Convert to JSON notation
        public string Serialize()
        {
            return JsonSerializer.Serialize(this);
        }

        public void Clear()
        {
            list.Clear();
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