using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Channels;
using System.Runtime.CompilerServices;

namespace StockScreener.Controllers
{
    public class StockController : Hub
    {
        static string[] request_arr = new string[2];

        static bool init_called = false;

        static bool _init_work = false;

        static string[] stockArray;

        Stocks stocks = new Stocks();

        static ChannelWriter<string[]> Writer { get; set; }

        static CancellationToken CancellationToken { get; set; }
        
        static ILogger<BackgroundServiceWorker> logger;// = new ILogger<BackgroundServiceWorker>();

        BackgroundServiceWorker serviceWorker = new BackgroundServiceWorker();

        // https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/generics/ Use this for type casting

        public ChannelReader<string[]> RequestData(string[] arr, CancellationToken cancellationToken)
        {
            var channelTwo = Channel.CreateUnbounded<string[]>();

            // Trigger a background thread that does the sending
            if (init_called == false)
            {
                stocks.init();
                init_called = !init_called;
            }

            if (_init_work == false)
            {
                _ = initialise_cache();
                _ = init_workOne(channelTwo.Writer, cancellationToken);
                _init_work = !_init_work;
            }
            // _ = WriteItemsAsync(channelTwo.Writer, arr, cancellationToken);

            _ = serviceWorker.StartAsync(cancellationToken);

            return channelTwo.Reader;
        }

        public ChannelReader<object[]> LockStream(object[] state, CancellationToken cancellationToken)
        {
            var channelOne = Channel.CreateUnbounded<object[]>();
            bool _state = (bool)state[0];

            _ = init_workTwo(channelOne.Writer, cancellationToken);

            if (!_state) { }
            // Stop the stream if stopasync is called
            else
            {
                // Restart the stream if not already called
            }

            return channelOne.Reader;
        }

        private async Task initialise_cache()
        {
            int start = 0;
            int end = 19;

            await Task.Delay(100);

            for (int pointer = 0; pointer <= stocks.MAX_CALLS; pointer++)
            {
                if (pointer == stocks.MAX_CALLS)
                {
                    stocks.get(start, start + stocks.Mod, 500 + pointer);
                    Console.WriteLine("Called ");
                    break;
                }

                stocks.get(start, end, 500 + pointer);
                stocks.Request_Calls = pointer;

                start += 20;
                end += 20;
                Console.WriteLine(start + " " + end);
                // await Task.Delay(delay, cancellationToken);
            }

            Console.WriteLine("Finished ");
        }

        private async Task init_workOne(ChannelWriter<string[]> writer, CancellationToken cancellationToken)
        {
            await Task.Delay(100);

            serviceWorker.WriterOne = writer;

            serviceWorker.CancellationToken = cancellationToken;
        }

        private async Task init_workTwo(ChannelWriter<object[]> writer, CancellationToken cancellationToken)
        {
            await Task.Delay(100);

            serviceWorker.WriterTwo = writer;

            serviceWorker.CancellationToken = cancellationToken;
        }

        // The logger factory! With priority queue!

        /*   private async Task WriteItemsAsync(
                      )
                   {
                       Exception localException = null;
                       try
                       {
                           int request_Calls = Int32.Parse(arr[0]);
                           int delay = Int32.Parse(arr[1]);

                           for (int pointer = 0; pointer < Stocks.StocksCode.Value.Length; pointer++)
                           {
                               await writer.WriteAsync(Stocks.cache.Get(20), Stocks.CancellationToken);

                           } //   _ = serviceWorker.StartAsync(CancellationToken);

                           Console.WriteLine("cancelled " + Stocks.CancellationToken.IsCancellationRequested);

                           // await writer.WriteAsync(Stocks.cache.Get(20), Stocks.CancellationToken);
                           //  await serviceWorker.StartAsync(Stocks.CancellationToken);
                       }

                       catch (Exception ex)
                       {
                           if (ex is StackOverflowException || ex is ArgumentNullException || ex is NullReferenceException ||
                           ex is IndexOutOfRangeException ||
                           ex is Newtonsoft.Json.JsonSerializationException
                           || ex is MissingMemberException)
                               Console.WriteLine("exception_ " + ex);

                           localException = ex;
                       }
                       finally
                       {
                           writer.Complete(localException);
                       }
                   }*/



        /* public IActionResult Index()
         {
             return View();
         }*/
    }
}