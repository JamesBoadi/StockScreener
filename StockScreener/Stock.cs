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
                currentPrice = (currentPrice >= Open_2) ? currentPrice : Open_2;

                // Update the day move if and only if current price is exceeded
                UtilityFunctions.DayMove += (currentPrice >= Open_2 && UtilityFunctions.DayMove < 3) ? 1 : 0;
            }
        }

        // Stock Name
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

        // Default alert status
        private string _alertStatus = "1D";
        public string AlertStatus
        {
            get { return _alertStatus; }
            set { _alertStatus = value; }
        }

        // override object.Equals
        public override bool Equals(object obj)
        {
            //
            // See the full list of guidelines at
            //   http://go.microsoft.com/fwlink/?LinkID=85237
            // and also the guidance for operator== at
            //   http://go.microsoft.com/fwlink/?LinkId=85238
            //
            if (obj == null || GetType() != obj.GetType())
            {
                return false;
            }

            // TODO: write your implementation of Equals() here


            //   throw new System.NotImplementedException();

            return base.Equals(obj);
        }

        // override object.GetHashCode
        public override int GetHashCode()
        {
            // TODO: write your implementation of GetHashCode() here
            //  throw new System.NotImplementedException();
            return base.GetHashCode();
        }

        // Call when updating cache


        public void alertStatus()
        {
            // Mathmatical functions
            bool isBreakOut = utiltiy.breakOut(CurrentPrice, High_1, High_2);
            string tday = UtilityFunctions.TDays.ToString();

            if(isBreakOut)
            {
                _alertStatus += "BO " + "T-" + tday;
            }
            
        



        




        }
    }

}