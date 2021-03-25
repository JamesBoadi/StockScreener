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
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace StockScreener
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;



        private static readonly int MAX = 897;

        private static int calls = 0;

        private readonly IHubContext<StockHandler, IStockHandler> _stockHandler;

        private static bool _init_called = false;

        private static bool _init_work = false;

        private static bool _cacheFull = false;


        DateTime malaysiaTime = DateTime.UtcNow;

        const string easternZoneId = "Singapore Standard Time";

        BackgroundServiceWorker serviceWorker = new BackgroundServiceWorker();

        CancellationToken cacheCancellationToken;

        public Worker(ILogger<Worker> logger, IHubContext<StockHandler, IStockHandler> stockHandler)
        {
            _logger = logger;
            _stockHandler = stockHandler;
            // Http Client // Do a manual call if cache not updated
        }

        protected override async Task ExecuteAsync(CancellationToken cancellationToken)
        {
            while (!cancellationToken.IsCancellationRequested)
            {

                // Read Database
                if (_init_called == false)
                {
                    Stocks.stocks.init();
                    _init_called = !_init_called;
                }

                // Initialise writer and cancellation tokens
                if (_init_work == false)
                {
                    _ = initialise_cache();
                    _init_work = !_init_work;
                    // Start the Service Worker
                     _ = serviceWorker.StartAsync(cancellationToken);
                }

                // Start Background Service (test)
             /*   if (ReturnTime().Hours == 9 && ReturnTime().Minutes >= 0
                && ReturnTime().Minutes <= 5)
                {
                    if (serviceWorker._streamStarted)
                    {
                        _ = serviceWorker.StartAsync(cacheCancellationToken);
                    }
                }*/

                // Cache requests between server and client
                if (serviceWorker.API_REQUESTS <= serviceWorker.MAX_API_REQUESTS
                && serviceWorker.API_REQUESTS != -1)
                {
                    await _stockHandler.Clients.All.lockStream(serviceWorker.API_REQUESTS);
                }
                else
                {
                  //  _ = serviceWorker.StopAsync(cacheCancellationToken);
                }

                if (_cacheFull)
                {
                    for (int key = 0; key < MAX; key++)
                    { 
                        String JSON = Cache.Get(key).Serialize();
                        await _stockHandler.Clients.All.requestData(key,JSON );
                    }
                }

                await Task.Delay(10000);
            }
        }

        public TimeSpan ReturnTime()
        {
            TimeZoneInfo easternZone = TimeZoneInfo.FindSystemTimeZoneById(easternZoneId);
            return TimeZoneInfo.ConvertTime(malaysiaTime, easternZone).TimeOfDay;
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
                    break;
                }

                Stocks.stocks.initialiseStocks(start, end);

                start += 20;
                end += 20;
                Console.WriteLine(start + " " + end);
                // await Task.Delay(delay, cancellationToken);
            }

            _cacheFull = true; // Cache is populated

            Console.WriteLine("Finished ");
        }




        /*
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


                /*
                public override async Task StartAsync(CancellationToken cancellationToken)
                {


                }

                public override async Task StopAsync(CancellationToken cancellationToken)
                {


                }*/
    }
}