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


namespace StockScreener
{
    /// <summary> Cocurrent queue that accepts multiple channels
        // etc

    public interface IStockHandler {


        Task requestData(int key, string data);

        Task lockStream(int request_Calls);

      //  Task requests(int requests);

    /*
  static bool init_called = false;

        static bool _init_work = false;

        static ILogger<BackgroundServiceWorker> logger;// = new ILogger<BackgroundServiceWorker>();

        BackgroundServiceWorker serviceWorker = new BackgroundServiceWorker();

        // https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/generics/ Use this for type casting

        public ChannelReader<string[]> RequestData(int request_Calls, CancellationToken cancellationToken)
        {
            var channelTwo = Channel.CreateUnbounded<string[]>();
            try
            {
                // Trigger a background thread that does the sending
                /*    if (init_called == false)
                    {
                        Stocks.stocks.init();
                        init_called = !init_called;
                    }

                // Initialise writer and cancellation tokens
                if (_init_work == false)
                {
                    //   _ = initialise_cache();
                    _ = init_workOne(channelTwo.Writer, cancellationToken);
                    _init_work = !_init_work;

                    // Start a Service Worker
                    _ = serviceWorker.StartAsync(cancellationToken);
                }

             


                // Requests made
                //+  Stocks.stocks.Request_Calls = request_Calls;

                // Check if the task was cancelled
                /*    if (cancellationToken.IsCancellationRequested
                    && Stocks.API_REQUESTS <= Stocks.MAX_API_REQUESTS)
                    {
                        // REDIRECT TOOOO 404
                        _ = serviceWorker.StartAsync(cancellationToken);
                    }
                    else if (Stocks.API_REQUESTS == Stocks.MAX_API_REQUESTS)
                    {
                        // Dispose Timer
                       // serviceWorker.Dispose(); // Works
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

            return channelTwo.Reader;
        }

        /* Stop the stream at the end of day 
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

        // Restart stream on faliure
        public ChannelReader<object[]> RestartStream(object[] state, CancellationToken cancellationToken)
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

            for (int pointer = 0; pointer <= Stocks.stocks.MAX_CALLS; pointer++)
            {
                if (pointer == Stocks.stocks.MAX_CALLS)
                {
                    Stocks.stocks.initialiseStocks(start, start + Stocks.stocks.Mod);
                    Console.WriteLine("Fill Cache ");
                    break;
                }

                Stocks.stocks.initialiseStocks(start, end, 500 + pointer);

                start += 20;
                end += 20;
                Console.WriteLine(start + " " + end);
                // await Task.Delay(delay, cancellationToken);
            }

            Console.WriteLine("Finished ");
            UtilityFunctions.Tick = 1;
        }

        // Initialise service worker to write data
        private async Task init_workOne(ChannelWriter<string[]> writer, CancellationToken cancellationToken)
        {
            await Task.Delay(100);

            serviceWorker.WriterOne = writer;

            serviceWorker.CancellationToken = cancellationToken;
        }

        // Initialise service worker to write data
        private async Task init_workTwo(ChannelWriter<object[]> writer, CancellationToken cancellationToken)
        {
            await Task.Delay(100);

            serviceWorker.WriterTwo = writer;

            serviceWorker.CancellationToken = cancellationToken;
        }
    }*/}
}