using System;
using System.Collections.Generic;
using System.Configuration;
using System.Web;
using EODHistoricalData.NET;
using System.Net;
using System.IO;
using System.Text;
using System.Threading;
using System.Text.Json;

namespace StockScreener
{
    public class Cache
    {
        // Replace T[] with data structure similar to database file
        static Dictionary<int, Stock> hash = new Dictionary<int, Stock>();
        List<Stock> list = new List<Stock>();

        /*  private static int counter = 0;

          public int Counter
          {
              get { return counter; }
              set
              {
                  if (counter < 6)
                  {
                      counter = value;
                  }
                  else
                  {
                      list.Add();

                      hash.Add(++Stocks.Pointer, arr);
                      counter = 0;
              }
          }*/

        /// <summary>Adds an item to the collection</summary>
        public void Add(Stock data)
        {
            hash.Add(++Stocks.Pointer, data);
        }
        
        /// <summary>Updates an item or several items in the collection</summary>
        public void Update(int position, Stock data)
        {
            hash[position] = data;
        }

        /// <summary>Return the item from the collection</summary>
        public string Get(int position)
        {
            return JsonSerializer.Serialize(hash[position]);
        }

    }

}