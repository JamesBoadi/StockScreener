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
        public  List<Stock> list = new List<Stock>(); // Might not be needed

        
        // int Pointer = 0;
        public Stock(string StockCode, string TimeStamp, double CurrentPrice, double Change, double ChangeP,
        double Volume, int[] ChangeArray,
        double High, double Low, int Signal, double PrevOpen, double Close)
        {
            this.StockCode = StockCode;
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
        public double CurrentPrice{ get; set; }
        public string StockCode { get; set; }
        public string TimeStamp { get; set; }
        public double High { get; set; }
        public double PrevOpen { get; set; }
        public double Close { get; set; }
        public double Low { get; set; }
        public double Change { get; set; }
        public double ChangeP { get; set; }
        //   double ProfitLoss;
        // double ProfitLoss_Percentage;
        public double Volume { get; set; }
        public int[] ChangeArray { get; set; }

        public int Signal { get; set; }

        // Time the stock was last updated
        //string TimeStamp;

        /// <summary>Compare the equality of stocks</summary>
        public bool Equals(Stock stock)
        {
            /*
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
            }*/

            return true;// Stocks.changeArray.Contains(-1) || Stocks.changeArray.Contains(2);
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