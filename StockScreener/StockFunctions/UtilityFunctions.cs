using System;


namespace StockScreener // https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_server For the database (https://gist.github.com/kevinswiber/1390198)
{
    // Utility functions
    public abstract class UtilityFunctions
    {
        private static int dayMove = 1;
        public static int DayMove
        {
            get { return dayMove; }
            set { dayMove = value; }
        }
        
        // Price for today
        private static int tDays = 0;
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

        public abstract double calculateMomentum(double latest, double close, int x);

        public abstract void reversal(bool downtrend, double open_1, double close_1, double open_2, double close_2);

        public abstract void breakOut();

        //  public abstract int GetArea();
    }

}

