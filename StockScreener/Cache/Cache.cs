using System;
using System.Collections.Generic;

namespace StockScreener
{
    public class Cache
    {
         static Dictionary<int, Stock> _cache = new Dictionary<int, Stock>();

        public static void Add(Stock data)
        {
            _cache.Add(++Manager.Pointer, data);
        }

        public static void Update(int position, Stock data)
        {
            _cache[position] = data;
        }

        public static Stock Get(int position)
        {
            return _cache[position];
        }
    }

}