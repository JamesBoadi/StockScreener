using System;
using System.Collections.Generic;

namespace StockScreener //https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_server For the database (https://gist.github.com/kevinswiber/1390198)
{
    // Utility functions
    public class Utility : UtilityFunctions
    {
        private static readonly int dayMove = DayMove;

        private static readonly int T_Days = TDays;

        // private static readonly int 

        public static readonly int tick = Tick;

        static Dictionary<int, string> hash = new Dictionary<int, string>();

        Stock stock = new Stock();


        private bool checkDayMove()
        {
            // Update the day move if and only if current price is exceeded











        }


        public override double calculateMomentum(double latest, double close, int x)
        {
            return (latest - (close * x));
        }

        public override void breakOut()
        {
            // T-1 to T-10 Based on highest periods over a 10 day period
            




            if(stock.Open_2 < stock.High_1)
            {
                // No Day Move
                


            }
            else if(stock.Open_2 >= stock.High_1)
            {
                // Day Move





            }
            else if(stock.Open_2 < stock.High_1)
            {
                // Possible reversal




            }
            else if(stock.Open_2 < stock.Low_1)
            {
                // Reversal


            }

            throw new NotImplementedException();
        }

        public override void reversal(bool downtrend, double open_1, double close_1, double open_2, double close_2)
        {
            double range_1 = Math.Abs(open_1 - close_1);
            double range_2 = Math.Abs(open_2 - close_2);

            if (range_2 > range_1)
            {
                // If negative and we are in a downtrend or equivocal it is a bullish candle
                Stocks.IsBullish = (open_2 - close_2 < 0 && downtrend || open_2 - close_2 > 0 && !downtrend);
                Stocks.IsBearish = !Stocks.IsBullish;
            }
            else
            {
                // Continuance of current trend (neither bullish or bearish)
                Stocks.IsBearish = false;
                Stocks.IsBullish = false;
            }
        }



        


    }


}