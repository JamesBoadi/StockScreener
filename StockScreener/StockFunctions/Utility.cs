using System;


namespace StockScreener //https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_server For the database (https://gist.github.com/kevinswiber/1390198)
{
    // Utility functions
    public class Utility : UtilityFunctions
    {
        private readonly int T_Days = TDays;

        public override double calculateMomentum(double latest, double close, int x)
        {
            return (latest - (close * x));
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