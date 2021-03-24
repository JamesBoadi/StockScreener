using System;

namespace StockScreener
{
    public class CacheOp
    {
        private readonly object writeLock = new object();

        private readonly object readLock = new object();

        private bool updating = false;

        // Set accordingly to if the resource is updating 
        public bool _Updating
        {
            get { return updating; }
            set { updating = value; }
        }

        /// <summary>Adds an item to the collection</summary>
        public void Add(Stock data)
        {
            lock (writeLock)
            {
                //Console.WriteLine("Update " + data.StockCode);
                Cache.Add(data);
                updating = true;
            }

            updating = false;
        }

        /// <summary>Updates an item or several items in the collection</summary>
        public void Update(int position, Stock data)
        {
            Cache.Update(position, data);
        }

        /// <summary>Return the item from the collection</summary>
        public Stock Get(int position)
        {
            lock (readLock)
            {
                return Cache.Get(position);
            }

        }





    }

}