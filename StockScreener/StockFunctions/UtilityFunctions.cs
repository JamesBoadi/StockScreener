using System;


namespace StockScreener // https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_server For the database (https://gist.github.com/kevinswiber/1390198)
{
    // Utility functions
    public abstract class UtilityFunctions
    {
    /*    private static string previousTrend = "UP";

        public static string PreviousTrend
        {
            get { return previousTrend; }
            set { previousTrend = value; }
        }

        private static bool _reversal = false;

        public static bool Reversal
        {
            get { return _reversal; }
            set { _reversal = value; }
        }

        private static bool upTrend = false;

        public static bool UpTrend
        {
            get { return upTrend; }
            set { upTrend = value; }
        }
        private static bool downTrend = false;

        public static bool DownTrend
        {
            get { return downTrend; }
            set { downTrend = value; }
        }

        // 1D, 2D, 2D~
        private static int dayMove = 0;
        public static int DayMove
        {
            get { return dayMove; }
            set { dayMove = value; }
        }

        // Price for today (T-1 to T-10)
        private static int tDays = 0;
        public static int TDays
        {
            get { return tDays; }
            set { tDays = value; }
        }

        // A tick to measure if a stock has already been called (only called once a day)
        // Starting stock info for day
        private static int tick = 0;
        public static int Tick
        {
            get { return tick; }
            set { tick = value; }
        }

        // Reccuring period of 10 days
        private static double[] highestPrice = new double[11];
        public static double[] HighestPrice
        {
            get { return highestPrice; }
            set
            {
                int pointer = 0;

                while (pointer < 11)
                {
                    lowerPrice[pointer++] = Int32.MinValue;
                }

                highestPrice = value;
            }
        }

        private static double[] lowerPrice = new double[11];
        public static double[] LowerPrice
        {
            get { return lowerPrice; }
            set
            {
                int pointer = 0;

                while (pointer < 11)
                {
                    lowerPrice[pointer++] = Int32.MaxValue;
                }

                lowerPrice = value;
            }
        }

        public abstract double calculateMomentum(double latest, double close, int x);

       // public abstract void reversal(bool downtrend, double open_1, double close_1, double open_2, double close_2);

        public abstract bool breakOut(double currentPrice, double high_1, double high_2);

        public abstract void trendMonitor(double currentPrice, int hours, int minutes, int high, int low);
        //  public abstract int GetArea();*/
    }

}

