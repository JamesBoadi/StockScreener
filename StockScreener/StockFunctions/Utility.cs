using System;
using System.Collections.Generic;

namespace StockScreener //https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_server For the database (https://gist.github.com/kevinswiber/1390198)
{
    // Utility functions
    public class Utility : UtilityFunctions
    {
        private static readonly int dayMove = DayMove;

        private static readonly int T_Days = TDays;

        public static readonly int tick = Tick;

        private static readonly double[] highestPrice = HighestPrice;

        private static readonly double[] lowerPrice = LowerPrice;

        static Dictionary<int, string> hash = new Dictionary<int, string>();

        Stock stock = new Stock();


        public override double calculateMomentum(double latest, double close, int x)
        {
            return (latest - (close * x));
        }

        public override bool breakOut(double currentPrice, double high_1, double high_2)
        {
            bool isBreakOut = false;

            // T-1 to T-10 Based on highest periods over a 10 day period
            if (currentPrice < high_1)
            {
                // No Day Move
                isBreakOut = false;
            }
            else if (currentPrice >= high_1)
            {
                // Day Move
                isBreakOut = true;
            }

            return isBreakOut;
        }


        public override void trendMonitor(double currentPrice, int hours, int minutes, int high, int low)
        {
            int weightOne = 0;
            int weightTwo = 0;
            var map = new Dictionary<int, double>();

            // Update array every midnight
            HighestPrice[T_Days] = high;
            LowerPrice[T_Days] = low;

            int pointer = T_Days;

            if (pointer == 0)
                pointer = 1;
            else if (pointer == 11)
                pointer = 12;

            // Confirm which trend we are moving in
            if (currentPrice > HighestPrice[pointer - 1])
            {
                // Possible uptrend
                weightOne = 1;
            }
            else if (currentPrice < LowerPrice[pointer - 1])
            {
                // Possible downtrend
                weightOne = -1;
            }

            // Check the resistance and support lines
            double[] pair = new double[2];
            double[,] pairArr = new double[2, 10];

            for (int counter = 0; counter < 11; counter++)
            {
                double _high = HighestPrice[counter];


                for (int key = counter; key < map.Count; ++key)
                {
                    double value = map[key];


                }

                pairArr[0, counter] = pair[0];
                pairArr[1, counter] = pair[1];
            }



            // LowerPrice[pointer - 1] = currentPrice;




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