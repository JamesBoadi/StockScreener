using System;


namespace StockScreener //https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_server For the database (https://gist.github.com/kevinswiber/1390198)
{

    // Utility functions
    public abstract class UtilityFunctions
    {
        public abstract double calculateMomentum(double latest, double close, int x);    

        public abstract void reversal(bool downtrend, double open_1, double close_1, double open_2, double close_2);    

      //  public abstract int GetArea();

    }

}

