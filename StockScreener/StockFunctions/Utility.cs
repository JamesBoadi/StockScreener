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

        private static readonly bool upTrend = UpTrend;

        private static readonly bool downTrend = DownTrend;

        private static readonly bool _reversal = Reversal;

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

        Dictionary<int, double> map = new Dictionary<int, double>();

        static double resistanceLine1 = 0;
        static double supportLine1 = 0;

        double[] resistancePair = new double[2];
        double[,] resistanceArr = new double[2, 10];

        double[] supportPair = new double[2];
        double[,] supportArr = new double[2, 10];


        // Stocahstic oscillator
        public double calculateRange(double currentPrice, int hours, int minutes, int high, int low, int close)
        {
            // Update array every midnight
            HighestPrice[T_Days] = high;
            LowerPrice[T_Days] = low;

            if (T_Days - 1 < 0)
                UtilityFunctions.TDays = 1;

            double recentHighest = 0;
            double recentLowest = 0;

            for (int i = 1; i <= T_Days - 1; i++)
                recentHighest = Math.Max(HighestPrice[i - 1], HighestPrice[i]);

            for (int i = 1; i <= T_Days - 1; i++)
                recentLowest = Math.Max(LowerPrice[i - 1], LowerPrice[i]);

            return (close - recentLowest / recentHighest - recentLowest) * 100;

            // Fill with zeros
            /*      int row = resistanceArr.GetLength(0);
                  int col = resistanceArr.GetLength(1);

                  for (int i = 0; i < row * col; i++)
                      resistanceArr[i / col, i % col] = 0;

                  int jump = 0;

                  for (int counter = jump; counter < 10; counter++)
                  {
                      double _high = HighestPrice[counter];
                      resistancePair[0] = _high; // Set the resistancePair to add
                      resistancePair[1] = Int32.MaxValue;

                      double current = map[counter]; // The current value we are evaluating
                      // If second to last value, just do a subtraction
                      if (counter == 9)
                      {
                          resistanceArr[0, 10] = resistancePair[0];
                          resistanceArr[1, 10] = resistancePair[1];
                      }
                      // Get the smallest range of all the pairs in order)
                      for (int key = counter + 1; key < map.Count; ++key)
                      {
                          double value = map[key];
                          resistancePair[1] = (Math.Abs(value - current) < resistancePair[1]) ? value : resistancePair[1];
                          jump = (Math.Abs(value - current) < resistancePair[1]) ? key : counter + 1;
                      }

                      resistanceArr[0, counter] = resistancePair[0];
                      resistanceArr[1, counter] = resistancePair[1];
                  }

                  // Fill with zeros
                  int _row = supportArr.GetLength(0);
                  int _col = supportArr.GetLength(1);

                  for (int i = 0; i < _row * _col; i++)
                  {
                      supportArr[i / _col, i % _col] = 0;
                  }

                  int _jump = 0;

                  for (int counter = _jump; counter < 10; counter++)
                  {
                      double _high = LowerPrice[counter];
                      supportPair[0] = _high; // Set the resistancePair to add
                      supportPair[1] = Int32.MaxValue;

                      double current = map[counter];// The current value we are evaluating

                      // If second to last value, just do a subtraction
                      if (counter == 9)
                      {
                          supportArr[0, 10] = resistancePair[0];
                          supportArr[1, 10] = resistancePair[1];
                      }

                      for (int key = counter + 1; key < map.Count; ++key)
                      {
                          double value = map[key];
                          // Get the smallest range of all the pairs in order)
                          supportPair[1] = (Math.Abs(value - current) < supportPair[1]) ? value : supportPair[1];
                          jump = (Math.Abs(value - current) < supportPair[1]) ? key : counter + 1;
                      }

                      supportArr[0, counter] = supportPair[0];
                      supportArr[1, counter] = supportPair[1];
                  }

                  double resistancePivot = 0;
                  // Calculate the resistancePivot
                  for (int i = 0; i < resistanceArr.Length; i++)
                  {
                      resistancePivot += (Math.Abs(resistanceArr[0, i] - resistanceArr[1, i]) / 2);
                  }

                  double supportPivot = 0;
                  // Calculate the resistancePivot
                  for (int i = 0; i < resistanceArr.Length; i++)
                  {
                      supportPivot += (Math.Abs(supportArr[0, i] - supportArr[1, i]) / 2);
                  }

                  resistanceLine1 = (2 * resistancePivot);
                  supportLine1 = (2 * supportPivot);*/


        }

        double current = Int32.MinValue;

        public override void trendMonitor(double currentPrice, int hours, int minutes, int high, int low)
        {
            for (int counter = 0; counter < 11; counter++)
            {
                double _high = HighestPrice[counter];
                double _low = LowerPrice[counter];
                resistancePair[0] = 0; 
                resistancePair[1] = 0;

                {
                    current = (Math.Abs(_high - _low) > current) ? Math.Abs(_high - _low) : current;

                    if (Math.Abs(resistancePair[0] - resistancePair[1]) > current)
                    {
                        resistancePair[0] = _high;
                        resistancePair[1] = _low;
                    }
                }
            }
        }

        private void setTrend(double currentPrice)
        {
            if (currentPrice > resistanceLine1) // BO
            {
                if (UtilityFunctions.DownTrend)
                    UtilityFunctions.PreviousTrend = "Downtrend";
                else
                    UtilityFunctions.PreviousTrend = "NoBreakout";

                UtilityFunctions.UpTrend = true;
                UtilityFunctions.DownTrend = false;
            }
            // Under the resistance line and inbetween the support line, we say we are either in reversal or no BO
            else if (currentPrice < resistanceLine1 && currentPrice > supportLine1)
            {
                if (UtilityFunctions.UpTrend)
                    UtilityFunctions.PreviousTrend = "Uptrend";
                else
                    UtilityFunctions.PreviousTrend = "Downtrend";

                UtilityFunctions.UpTrend = false;
                UtilityFunctions.DownTrend = false;
            }
            else if (currentPrice < supportLine1) // BS2 
            {
                if (!(UtilityFunctions.UpTrend && UtilityFunctions.DownTrend))
                    UtilityFunctions.PreviousTrend = "NoBreakout";
                else
                    UtilityFunctions.PreviousTrend = "Uptrend";

                UtilityFunctions.UpTrend = false;
                UtilityFunctions.DownTrend = true;
            }
        }

        public void setReversal()
        {
            // A state of where we are neither in an uptrend or downtrend
            if (UtilityFunctions.PreviousTrend.Equals("NoBreakout"))
                UtilityFunctions.Reversal = false;
            // A state where we are going from a downtrend to an uptrend
            else if ((Utility.UpTrend && !Utility.DownTrend) && UtilityFunctions.PreviousTrend.Equals("Downtrend")
            || (!Utility.UpTrend && Utility.DownTrend) && UtilityFunctions.PreviousTrend.Equals("Uptrend"))
            {
                UtilityFunctions.Reversal = true;
            }
        }



        





        /*
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
                */





    }


}