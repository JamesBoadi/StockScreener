using System;


namespace StockScreener // https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_server For the database (https://gist.github.com/kevinswiber/1390198)
{
    // Utility functions
    public abstract class UtilityFunctions
    {

        // 1D, 2D, 2D~
        private static int dayMove = 0;
        public static int DayMove
        {
            get { return dayMove; }
            set { dayMove = value; }
        }

        // Price for today (T-1 to T-10)
        private static int tDays = 1;
        public static int TDays
        {
            get { return tDays; }
            set { tDays = value; }
        }

        // A tick to measure if a stock has already been called
        private static int tick = 0;
        public static int Tick
        {
            get { return tick; }
            set { tick = value; }
        }

        private static double highestPrice = Int32.MinValue;
        public static double HighestPrice
        {
            get { return highestPrice; }
            set { highestPrice = value; }
        }


        public abstract double calculateMomentum(double latest, double close, int x);

        public abstract void reversal(bool downtrend, double open_1, double close_1, double open_2, double close_2);

        public abstract bool breakOut(double currentPrice, double high_1, double high_2);

        public abstract void trendMonitor();
        //  public abstract int GetArea();
    }

}

