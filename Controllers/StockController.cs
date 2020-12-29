using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using System.Threading.Channels;
using System.Runtime.CompilerServices;

namespace StockScreener.Controllers
{
    public class StockController : Hub
    {
        static string[] request_arr = new string[2];

        static bool init_called = false;

        static string[] stockArray;

        Stocks stocks = new Stocks();

        // https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/generics/ Use this for type casting

        public ChannelReader<string[]> Counter(
        string[] arr,
       CancellationToken cancellationToken)
        {

             // Trigger a background thread that does the sending


            if (init_called == false)
            {
                stocks.init();
                init_called = !init_called;
            }

            //  Console.WriteLine(Stocks.MAX_CALLS);
            var channel = Channel.CreateUnbounded<string[]>();

            _ = WriteItemsAsync(channel.Writer, arr, cancellationToken);

            return channel.Reader;
        }


        private async Task WriteItemsAsync(
            ChannelWriter<string[]> writer,
            string[] arr,
            CancellationToken cancellationToken)
        {
            Exception localException = null;
            try
            {
                int request_Calls = Int32.Parse(arr[0]);
                int delay = Int32.Parse(arr[1]);
                
                initialise_cache();

                
            }

            catch (Exception ex)
            {
                if (ex is ArgumentNullException || ex is NullReferenceException ||
                ex is IndexOutOfRangeException ||
                ex is Newtonsoft.Json.JsonSerializationException
                || ex is MissingMemberException)
                    Console.WriteLine("exception one " + ex);

                localException = ex;
            }
            finally
            {
                writer.Complete(localException);
            }
        }

        // The logger factory! With priority queue!
        public async Task ScanRequest(string request_Calls)
        {
            if (init_called == false)
            {
                //init();
                init_called = !init_called;
            }
            try
            {
                int calls = 0;
                bool success = Int32.TryParse(request_Calls, out calls); // Set this variable

                if (success)
                {
                    stocks.Request_Calls += calls;
                }
                else
                    Console.Write("fail");

            }
            catch (Exception ex)
            {
                if (ex is NullReferenceException || ex is Newtonsoft.Json.JsonSerializationException || ex is MissingMemberException)
                    Console.WriteLine("exception first " + ex); // Redirect also if timeout
            }

            // stockArray = stocks.getAllRealTimePrices(0);
            stockArray[5] = stocks.Request_Calls.ToString();
            //   stockArray[6] = stocks.MAX_CALLS.ToString();
            await Clients.All.SendAsync("ScanResponse", stockArray, request_arr);
        }


        private async void initialise_cache()
        {
            int start = 0;
            int end = 19;

            for (int pointer = 0; pointer <= stocks.MAX_CALLS; pointer++)
            {
                if (pointer == stocks.MAX_CALLS)
                {
                    stocks.getAllRealTimePrices(start, start + stocks.Mod);
                    Console.WriteLine("Called");
                    break;
                }

                stocks.getAllRealTimePrices(start, end);
                stocks.Request_Calls = pointer;

                start += 20;
                end += 20;
                Console.WriteLine(start + " " + end);
              
                // await Task.Delay(delay, cancellationToken);
            }
        }



        private void init_backgroundWorker()
        {



        }


        // Return data from cache
        private async void getData(ChannelWriter<string[]> writer, CancellationToken cancellationToken)
        {
            for (int pointer = 0; pointer < Stocks.StocksCode.Value.Length; pointer++)
            {
                  await writer.WriteAsync(Stocks.cache.Get(pointer), cancellationToken);
            }
        }



        /* public IActionResult Index()
         {
             return View();
         }*/
    }
}