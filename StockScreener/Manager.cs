using System;
using System.Collections.Generic;
using System.Configuration;
using System.Web;
using EODHistoricalData.NET;
using System.Net;
using System.IO;
using System.Text;
using System.Threading;
using System.Threading.Channels;
using CsvHelper;
using System.Text.Json;

namespace StockScreener //https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_server For the database (https://gist.github.com/kevinswiber/1390198)
{

    public sealed class Manager
    {
        private static Manager instance = null;
        private static readonly object padlock = new object();
        private static readonly String API_TOKEN = ConfigurationManager.AppSettings["API_TOKEN"];
        private static EODHistoricalDataClient client = new EODHistoricalDataClient(API_TOKEN, true);
        private static Lazy<List<Database>> stockList;// = new Lazy<List<Database>>();
        public static Lazy<List<Database>> StockList
        {
            get { return stockList; }
            set { stockList = value; }
        }

        private static Lazy<string[]> stocksCode; //= new Lazy<string[]>();

        public static Lazy<string[]> ManagerCode
        {
            get { return stocksCode; }
            set { stocksCode = value; }
        }

        private static Lazy<string[]> stocksName; //= new Lazy<string[]>();

        public static Lazy<string[]> ManagerName
        {
            get { return stocksName; }
            set { stocksName = value; }
        }

        string[] stockCode;

        string[] stockName;

        private int request_Calls = 0;
        public int Request_Calls
        {
            get { return request_Calls; }
            set { request_Calls = value; }
        }

        private int max_Calls = 0;

        public int MAX_CALLS
        {
            get { return max_Calls; }
            set { max_Calls = value; }
        }

        // Maximum API requests
        public static readonly int MAX_API_REQUESTS = 96;

        // The number of times an API request is made
        public static int API_REQUESTS = 0;

        private int mod = 0;

        public int Mod
        {
            get { return mod; }
            set { mod = value; }
        }

        private static bool isBullish = false;

        public static bool IsBullish
        {
            get { return isBullish; }
            set { isBullish = value; }
        }

        private static bool isBearish = true;

        public static bool IsBearish
        {
            get { return isBearish; }
            set { isBearish = value; }
        }

        public static int targetPrice = 0;

        public static int startPrice = 0;

        public void init()
        {
            init_StockList();
            init_StockCode();
        }

        public void init_StockList()
        {
            Manager.StockList = new Lazy<List<Database>>(() => readDatabase(), LazyThreadSafetyMode.ExecutionAndPublication); // We want the lisst to return first preceding initilization
        }

        public void init_StockCode()
        {
            Manager.ManagerCode = new Lazy<string[]>(() => getStockCode(), LazyThreadSafetyMode.ExecutionAndPublication);
            Manager.ManagerName = new Lazy<string[]>(() => getStockName(), LazyThreadSafetyMode.ExecutionAndPublication);
            MAX_CALLS = ((ManagerCode.Value.Length - (ManagerCode.Value.Length % 20)) / 20);
            Mod = ((ManagerCode.Value.Length % 20) - 1);
        }

        static string[] manualScanManager = new string[7 * 20];

        List<RealTimePrice> data;

        private static int pointer = -1;
        public static int Pointer { get { return pointer; } set { pointer = value; } }

        private CancellationToken cancellationToken;
        public CancellationToken CancellationToken
        {
            get { return cancellationToken; }
            set { cancellationToken = value; }
        }

        private Manager()
        {
        }

        public static Manager Instance
        {
            get
            {
                lock (padlock)
                {
                    if (instance == null)
                    {
                        instance = new Manager();
                    }
                    return instance;
                }
            }
        }

        static string[] stockArray;

        // Copy stocks from database into stock array
        private void copy(int start, int end)
        {
            stockArray = new string[(end - start) + 1];
            int pointer = -1;

            for (int i = 0; i <= stockArray.Length - 1; i++)
            {
                stockArray[i] = Manager.ManagerCode.Value[++pointer];
            }
        }
        private static int[] changeArray = { -1, 1, 2, 0, 1, 1 };//new int[6];
        Stock stock;

        public static CacheOp cache = new CacheOp();
        // Get stocks from the cache
        public void initialiseManager(int start, int end)
        {
            int s = new Random().Next(-99, 99);
            bool positive = s >= 0;
            bool negative = s < 0;

              Time time = new Time();
            TimeSpan _time = time.ReturnTime();
            string hour = _time.Hours.ToString();
            string minutes = _time.Minutes.ToString();
            string time_format = hour + ":" + minutes;

            try
            {
                copy(start, end);
                int pointer = start;

                while (pointer <= end)
                {
                    stock = new Stock(pointer.ToString(), Manager.ManagerCode.Value[pointer],
                    Manager.ManagerName.Value[pointer], time_format,
                    s, s, s, s, changeArray, 5, 6, 7, 8, 86);

                    cache.Add(stock);
                    pointer++;
                }

                /*      copy(start, end);
                       data = client.GetRealTimePrices(stockArray);
                       Stock stock;

                   foreach (RealTimePrice data_ in data)
                   {
                       stock = new Stock(ManagerCode.Value[pointer],
                       data_.Open, data_.Change, data_.ChangeP, data_.Volume, changeArray, data_.High, data_.Low,
                       (positive && !negative) ? 1 : -1, data_.Close, data_.PreviousClose);

                       cache.Add(stock);
                   } */
            }
            catch (Exception ex)
            {
                if (ex is StackOverflowException || ex is KeyNotFoundException || ex is ArgumentNullException || ex is NullReferenceException || ex is ArgumentException ||
                  ex is IndexOutOfRangeException ||
                  ex is Newtonsoft.Json.JsonSerializationException
                  || ex is MissingMemberException
                  || ex is OverflowException || ex is System.Threading.Tasks.TaskCanceledException)
                    Console.WriteLine("exception " + ex); // Redirect also if timeout
            }
        }

        // Update Stock
        public void updateManager(int start, int end)
        {
            try
            {
                int pointer = start;
                while (pointer < end)
                {
                    int[] array = { -1, 2, -2, 0 };
                    Random random = new Random();
                    int start2 = random.Next(0, array.Length);

                    int[] changeArray = new int[6] { array[start2], array[start2], array[start2], array[start2],
                    array[start2], array[start2] };

                    int s = new Random().Next(0, 99);
                    Stock stock = new Stock(pointer.ToString(), Manager.ManagerCode.Value[pointer],
                    Manager.ManagerName.Value[pointer], "",
                    s, 2, 3, start2, changeArray, 5, 6, 7, 8, 86);


                    // Update stock
                    Stock newStockData = cache.Get(pointer).Update(stock);
                    cache.Update(pointer, newStockData);
                    pointer++;
                }


                /*    
                    data = client.GetRealTimePrices(stockArray);
                    Stock stock;

                foreach (RealTimePrice data_ in data)
                {
                    stock = new Stock(ManagerCode.Value[pointer],
                    data_.Open, data_.Change, data_.ChangeP, data_.Volume, changeArray, data_.High, data_.Low,
                    (positive && !negative) ? 1 : -1, data_.Close, data_.PreviousClose);
                    cache.Update(pointer, stock);
                    pointer++;
                }
*/
            }
            catch (Exception ex)
            {
                if (ex is StackOverflowException || ex is KeyNotFoundException || ex is ArgumentNullException || ex is NullReferenceException || ex is ArgumentException ||
                  ex is IndexOutOfRangeException ||
                  ex is Newtonsoft.Json.JsonSerializationException
                  || ex is MissingMemberException
                  || ex is OverflowException || ex is System.Threading.Tasks.TaskCanceledException)
                    Console.WriteLine("exception " + ex); // Redirect also if timeout
            }
        }

        public void setHistoricalPrices(int start, int end)
        {
            // List<HistoricalPrice> prices = client.
            // GetHistoricalPrices(Consts.TestSymbol, Consts.StartDate, Consts.EndDate);
            // Serialise HISTORICALDATA.CS


        }


        public List<Database> readDatabase()
        {
            Database Record = new Database();
            List<Database> stockList = new List<Database>();

            using (TextReader reader = File.OpenText("database.csv"))
            using (var parser = new CsvParser(reader, System.Globalization.CultureInfo.CurrentCulture))
            using (var csvReader = new CsvReader(parser))
            {
                while (csvReader.Read())
                {
                    Record = csvReader.GetRecord<Database>();

                    stockList.Add(Record);
                }
            }

            return stockList;
        }


        // Need a thread, thread safe, move to utility
        public string[] getStockCode()
        {
            int pointer = -1;
            List<Database> _stocks = StockList.Value;
            stockCode = new string[_stocks.Count];

            foreach (Database data in _stocks)
            {
                String pad = "";
                // Pad numbers
                if (data.Code.Length == 1)
                    pad = "000";
                else if (data.Code.Length == 2)
                    pad = "00";
                else if (data.Code.Length == 3)
                    pad = "0";
                else
                    pad = "";

                stockCode[++pointer] = pad + data.Code + ".KLSE";
            }

            return stockCode;
        }

        public string[] getStockName()
        {
            int pointer = -1;
            List<Database> _stocks = StockList.Value;
            stockName = new string[_stocks.Count];

            foreach (Database data in _stocks)
            {
                stockName[++pointer] = data.Name;
            }

            return stockName;
        }

        /*
                        public static string[] getStockNames()
                        {
                            //string[] Database = new[] { TestSymbol, "EUR.FOREX" };
                            int pointer = 0;
                            List<Database> _stocks = StockList.Value;
                            string[] stockCode = new string[_stocks.Count];
                            foreach (Database data in _stocks)
                            {
                                stockCode[pointer++] = data.Name;
                            }

                            return stockCode;
                        }
                */


        /*  public void getRealTimePrice(String code)
          {
              EODHistoricalDataClient client = new EODHistoricalDataClient(API_TOKEN, true);

              //if() // Perform a refresh if fail (like restart thread or put on seperate thread)
              List<RealTimePrice> prices = client.GetRealTimePrices(ManagerCode.Value); // enumeration
          }*/


        /*     try
             {
                 //   data = client.GetRealTimePrices(stockArray);
                 //  int pointer = 0;
                 // foreach (RealTimePrice data_ in data)
                 int pointer = start;
                 while (pointer < end)
                 {
                     int s = new Random().Next(-99, 99);
                     bool positive = s >= 0;
                     bool negative = s < 0;
                     Random random = new Random();
                     int[] array = { -1, 2, -2 };
                     int start2 = random.Next(0, array.Length);
                     int[] changeArray = new int[6] { array[start2], array[start2], array[start2], array[start2],
                     array[start2], array[start2] };

                     stock.StockCode = ManagerCode.Value[pointer];
                     stock.Change = s;
                     stock.ChangeP = 1;
                     stock.Volume = 11;
                     stock.ProfitLoss = 1;
                     stock.ProfitLoss_Percentage = 99;
                     stock.Volume = 13;
                     stock.High = new Random().Next(1, 99);
                     stock.Low = 14;
                     stock.Open = 76;
                     stock.Close = 10;
                     stock.Signal = (positive && !negative) ? 1 : -1;



                     Console.WriteLine("CRACK " + changeArray[0]);

                     /*  DateTime time = DateTime.Today.Add(service.ReturnTime());
                       string _currentTime = time.ToString("HH:mmttss");

                       stock.timestamp = _currentTime;

                     stock.Request_Calls = 5;
                     stock.TimeStamp = "9:00";
                     bool update = cache.Get(pointer).Equals(stock);
                     stock.ChangeArray = changeArray;

                     Manager.stocks.Request_Calls = Manager.stocks.Request_Calls + 1;
                     stock.Request_Calls = Manager.stocks.Request_Calls;

                     // Compare each stock
                     //if (update || !update)
                     cache.Update(pointer, stock);

                     stock = new Stock();
                     pointer++;
                 }

                 Manager.API_REQUESTS = Manager.API_REQUESTS + 1;*/

    }
}
