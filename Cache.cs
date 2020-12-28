using System;
using System.Collections.Generic;
using System.Configuration;
using System.Web;
using EODHistoricalData.NET;
using System.Net;
using System.IO;
using System.Text;
using System.Threading;

namespace StockScreener
{
    public class Cache<T>
    {

        Dictionary<int, T[]> hash = new Dictionary<int, T[]>();
        T[] arr = new T[7];

        private static int counter = -1;

        public int Counter
        {
            get { return counter; }
            set
            {
                if (counter < 7)
                    counter = value;
                else
                {
                    hash.Add(Stocks.Pointer, arr);
                    counter = -1;
                }
            }
        }

        /// <summary>Adds an item to the collection</summary>
        public void Add(T data)
        {
            Console.WriteLine(data);
            arr[++Counter] = data;
        }







    }

}