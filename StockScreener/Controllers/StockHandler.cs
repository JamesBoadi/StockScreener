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
    public class StockHandler : Hub
    {
        static string[] request_arr = new string[2];

        static bool init_called = false;

        static bool _init_work = false;

        static string[] stockArray;

        static ChannelWriter<string[]> Writer { get; set; }

        static CancellationToken CancellationToken { get; set; }

        static ILogger<BackgroundServiceWorker> logger;// = new ILogger<BackgroundServiceWorker>();

        BackgroundServiceWorker serviceWorker = new BackgroundServiceWorker();

        // https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/generics/ Use this for type casting

        public ChannelReader<string[]> RequestData(string[] arr, CancellationToken cancellationToken)
        {
            var channelTwo = Channel.CreateUnbounded<string[]>();
            try
            {
                // Trigger a background thread that does the sending
                if (init_called == false)
                {
                    Stocks.stocks.init();
                    init_called = !init_called;
                }

                if (_init_work == false)
                {
                    _ = initialise_cache();
                    _ = init_workOne(channelTwo.Writer, cancellationToken);
                    _init_work = !_init_work;
                }

                // Start a service worker
                _ = serviceWorker.StartAsync(cancellationToken); 
            }
            catch (Exception ex)
            {
                if (ex is StackOverflowException || ex is KeyNotFoundException|| ex is ArgumentNullException || ex is NullReferenceException || ex is ArgumentException ||
                  ex is IndexOutOfRangeException ||
                  ex is Newtonsoft.Json.JsonSerializationException
                  || ex is MissingMemberException
                  || ex is OverflowException || ex is System.Threading.Tasks.TaskCanceledException)
                    Console.WriteLine("exception " + ex); // Redirect also if timeout
            }

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
                    Stocks.stocks.initialiseStocks(start, start + Stocks.stocks.Mod, 500 + pointer);
                    Console.WriteLine("Fill Cache ");
                    break;
                }

                Stocks.stocks.initialiseStocks(start, end, 500 + pointer);
                Stocks.stocks.Request_Calls = pointer;

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
    }
}