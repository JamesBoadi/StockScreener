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
    public class Stocks
    {
        internal static readonly String API_TOKEN = ConfigurationManager.AppSettings["API_TOKEN"];
        internal static EODHistoricalDataClient client = new EODHistoricalDataClient(API_TOKEN, true);


        /*
                static List<Database> stockList { get; set; }//= new List<Database>()  
                static public List<Database> StockList { get { return stockList; } set { stockList = value; } }

                static private string[] stockCode = new string[StocksCode.Value.Length];
                static public string[] Arr { get { return stockCode; } set { stockCode = value; } }   new string[StockList.Value.Count]; */

        // https://docs.microsoft.com/en-us/dotnet/framework/performance/lazy-initialization <-------------- This!


        //  public List<Database> StockList { get { return stockList; } set { stockList = value; } }

        //  static Lazy<string[]> all = new Lazy<string[]>(() => new Stocks().getAll());

        /*   
             internal const string TestSymbol = "0001.KLSE";

             internal static readonly string[] D  atabase = new[] { TestSymbol, "EUR.FOREX" };

             static List<Database> stockList = new List<Database>();

          //   static Lazy<string[]> stocksName = new Lazy<string[]>(() => getStockNames());
            // Set this value from stock controller
*/

        //                    stock = new Stock();

        /*     cache.Add(data_.Open.ToString());
            cache.Add(StocksCode.Value[code].ToString());
             cache.Add(data_.Change.ToString());
             cache.Add(data_.ChangeP.ToString());
             cache.Add(data_.Volume.ToString());
             cache.Add(Request_Calls.ToString());
             cache.Add(MAX_CALLS.ToString());*/
        /*    pointer += 7;
            code++;*/
        private static Lazy<List<Database>> stockList;// = new Lazy<List<Database>>();

        public static Lazy<List<Database>> StockList
        {
            get { return stockList; }
            set { stockList = value; }
        }

        private static Lazy<string[]> stocksCode; //= new Lazy<string[]>();

        public static Lazy<string[]> StocksCode
        {
            get { return stocksCode; }
            set { stocksCode = value; }
        }

        string[] stockCode;
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

        // Replace blocking operation with await tasks and loading bar
        // Initialise StockList and StockCode
        public void init()
        {
            init_StockList();
            init_StockCode();
            Array.Fill(Stocks.changeArray, 0);
        }

        public void init_StockList()
        {
            Stocks.StockList = new Lazy<List<Database>>(() => readDatabase(), LazyThreadSafetyMode.ExecutionAndPublication); // We want the lisst to return first preceding initilization
        }

        public void init_StockCode()
        {
            Stocks.StocksCode = new Lazy<string[]>(() => getStockCode(), LazyThreadSafetyMode.ExecutionAndPublication);
            MAX_CALLS = ((StocksCode.Value.Length - (StocksCode.Value.Length % 20)) / 20);
            Mod = ((StocksCode.Value.Length % 20) - 1);
        }

        static string[] manualScanStocks = new string[7 * 20];

        List<RealTimePrice> data;

        public static Cache cache = new Cache();

        private static int pointer = -1;
        public static int Pointer { get { return pointer; } set { pointer = value; } }

        private CancellationToken cancellationToken;
        public CancellationToken CancellationToken
        {
            get { return cancellationToken; }
            set { cancellationToken = value; }
        }
        Stock stock = new Stock();

        public static Stocks stocks = new Stocks();

        BackgroundServiceWorker service = new BackgroundServiceWorker();

        static string[] stockArray;

        // Copy stocks from database into stock array
        private void copy(int start, int end)
        {
            stockArray = new string[(end - start) + 1];
            int pointer = -1;

            for (int i = 0; i <= stockArray.Length - 1; i++)
            {
                stockArray[i] = Stocks.StocksCode.Value[++pointer];
            }
        }

        // Get stocks from the cache
        public void initialiseStocks(int start, int end, int pointer)
        {
            try
            {
                copy(start, end);
                //  data = client.GetRealTimePrices(stockArray);
                //  int pointer = 0;
                int code = start;
                for (int i = 0; i < stockArray.Length; i++) // foreach (RealTimePrice data_ in data)
                {
                    stock.StockCode = StocksCode.Value[code];
                    stock.Change = 91;
                    stock.ChangeP = 1;
                    stock.Volume = 11;
                    stock.ProfitLoss = 1;
                    stock.ProfitLoss_Percentage = 99;
                    stock.ChangeArray = Stocks.changeArray;
                    stock.Volume = 13;
                    

                    stock.High = 11;
                    stock.Low = 14;
                    stock.Open = 76;
                    stock.Close = 10;
                    
                    /*  DateTime time = DateTime.Today.Add(service.ReturnTime());
                      string _currentTime = time.ToString("HH:mmttss");
                      
                      stock.timestamp = _currentTime;*/

                    stock.Request_Calls = 5;

                    stock.TimeStamp = "9:00";

                    // Data from the previous day starting the next day
                    if (Utility.Tick == 0)
                    {
                        stock.High = 3;
                        stock.Low = 11;
                        stock.Open = 9;
                        stock.Close = 10;

                        cache.Add(stock);
                        stock = new Stock();
                    }
                }
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

        // Change array
        public static int[] changeArray = new int[6];
        public void updateStocks(int start, int end)
        {
            try
            {
                //   data = client.GetRealTimePrices(stockArray);
                //  int pointer = 0;
                // foreach (RealTimePrice data_ in data)
                int pointer = start;
                while (pointer < end)
                {
                    stock.StockCode = StocksCode.Value[pointer];
                    stock.Change = 1111;
                    stock.ChangeP = 1;
                    stock.Volume = 1;
                    stock.ProfitLoss = 1;
                    stock.ProfitLoss_Percentage = 999;

                    stock.High = 2;
                    stock.Low = 1;
                    stock.Open = 1;
                    stock.Close = 3;

                    /*  DateTime time = DateTime.Today.Add(service.ReturnTime());
                      string _currentTime = time.ToString("HH:mmttss");

                      stock.timestamp = _currentTime;*/

                    bool update = cache.Get(pointer).Equals(stock);

                    stock.ChangeArray = Stocks.changeArray;
                    stock.Request_Calls = 1;

                    // Compare each stock
                    if (update)
                        //cache.Update(pointer, stock);

                        pointer++;
                }
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
              List<RealTimePrice> prices = client.GetRealTimePrices(StocksCode.Value); // enumeration
          }*/

    }
}
