using System;
using System.Collections.Generic;
using System.Configuration;
using System.Web;
using EODHistoricalData.NET;
using System.Net;
using System.IO;
using System.Text;
using System.Threading;
using CsvHelper;



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

        public void init()
        {
            init_StockList(); // Replace blocking operation with await tasks
            init_StockCode();
            Console.WriteLine("First call " + MAX_CALLS);
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

        

        static string[] arr;

        List<RealTimePrice> data;

        Cache<Type> mad = new Cache<Type>();

        private void copy(int start, int end)
        {
            arr = new string[(end - start) + 1];
            int pointer = -1;

            for (int i = 0; i <= arr.Length - 1; i++)
            {
                arr[i] = Stocks.StocksCode.Value[++pointer];
            }
        }

        public static int Pointer {get; set;}


        public string[] getAllRealTimePrices(int start, int end)
        {
            try
            {
                copy(start, end);
                data = client.GetRealTimePrices(arr);
                int pointer = 0;
                int code = start;

 

                foreach (RealTimePrice data_ in data)
                {

/*
                    typeArr[pointer] = data_.Open;
                    typeArr[pointer + 1] = StocksCode.Value[code];
                    typeArr[pointer + 2] = data_.Change;
                    typeArr[pointer + 3] = data_.ChangeP;
                    typeArr[pointer + 4] = data_.Volume;
                    typeArr[pointer + 5] = Request_Calls;
                    typeArr[pointer + 6] = MAX_CALLS;*/


                    manualScanStocks[pointer] = data_.Open.ToString();
                    manualScanStocks[pointer + 1] = StocksCode.Value[code].ToString();
                    manualScanStocks[pointer + 2] = data_.Change.ToString();
                    manualScanStocks[pointer + 3] = data_.ChangeP.ToString();
                    manualScanStocks[pointer + 4] = data_.Volume.ToString();
                    manualScanStocks[pointer + 5] = Request_Calls.ToString();
                    manualScanStocks[pointer + 6] = MAX_CALLS.ToString();

                    pointer += 7;
                    code++;
                }
            }

            catch (Exception ex)
            {
                if (ex is ArgumentNullException || ex is NullReferenceException || ex is ArgumentException ||
                  ex is IndexOutOfRangeException ||
                  ex is Newtonsoft.Json.JsonSerializationException
                  || ex is MissingMemberException
                  || ex is OverflowException || ex is System.Threading.Tasks.TaskCanceledException)
                    Console.WriteLine("exception " + ex); // Redirect also if timeout
            }

            return manualScanStocks;
        }






        /*  public void getRealTimePrice(String code)
          {
              EODHistoricalDataClient client = new EODHistoricalDataClient(API_TOKEN, true);

              //if() // Perform a refresh if fail (like restart thread or put on seperate thread)
              List<RealTimePrice> prices = client.GetRealTimePrices(StocksCode.Value); // enumeration
          }*/

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

    }
}