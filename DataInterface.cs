using System;
using EODHistoricalData.NET;

namespace StockScreener
{
    public interface DataInterface
    {
        /// <summary>Takes data as input and returns the Type</summary>
        Type detectType(Type data);    

        byte[] convertToBytes(String data);

        /// <summary>Takes a Type as input and converts it to bytes</summary>
    //    byte convertToBytes(Type data);


     /*   
        /// <summary>Takes a byte as data and converts it to a Type</summary>
        Type convertBytes(byte data);*/
    }
}