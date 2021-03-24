using System;
using System.Collections.Generic;
using Microsoft.Extensions.Caching.Memory;

namespace StockScreener
{
    public class MemoryCache
    {
 
 /*       private IMemoryCache _cache;

        public MemoryCache(IMemoryCache memoryCache)
        {
            _cache = memoryCache;
        }

        public IMemoryCache _Cache
        {
            get { return _cache; }
            set { _cache = value; }
        }

        private readonly object writeLock = new object();

        private bool updating = false;

        /* Set accordingly to if the resource is updating 
        public bool _Updating
        {
            get { return updating; }
            set { updating = value; }
        }

        public void Add(int key, string value)
        {
            lock (writeLock)
            {
                Console.WriteLine("Update " + value);

                updating = true;
                _cache.Set(key, value);
            }

            updating = false;
        }

        public string Get(int key)
        {
            return _cache.Get(key).ToString();
        }
*/

    }
}