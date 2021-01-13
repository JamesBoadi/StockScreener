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
        // Replace T[] with data structure similar to database file
        static Dictionary<int, T> hash = new Dictionary<int, T>();

        T[] arr = new T[7];

        List<Stock> list = new List<Stock>();

        Stock stock = new Stock();

        BackgroundServiceWorker service = new BackgroundServiceWorker();

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
        public void Add(T data)
        {
            hash.Add(++Stocks.Pointer, data);
            //   Console.WriteLine(data);
            // arr[Counter++] = data;
        }

        /// <summary>Updates an item or several items in the collection</summary>
        public void Update(int position, T data)
        {
            // Update the stock 
            stock.High_2 = 0;
            stock.Low_2 = 0;
            stock.Open_2 = 0;
            stock.Close_2 = 0;
            
            // Update timestamp if price changes
            if (stock.CurrentPrice != stock.Close_2)
            {
                DateTime time = DateTime.Today.Add(service.ReturnTime());
                
                string _currentTime = time.ToString("HH:mmttss");
                stock.timestamp = _currentTime;



            
            
            
            
            
            
            
            
            }




            /*     T[] arr_ = hash[position];
                 T cachedData = arr_[TIndex];

                 if (!data.Equals(cachedData))
                 {
                     arr_[TIndex] = data;
                     hash[position] = arr_;
                 }*/
        }

        /// <summary>Return the item from the collection</summary>
        public T Get(int position)
        {
            //  Console.WriteLine("The position is " + position);
            return hash[position];
        }

    }

}