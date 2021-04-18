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
using StockScreener.Controllers;

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

        private static bool _sessionEnded = false;

        private readonly StockScreenerService _stockScreenerService;

        BackgroundServiceWorker serviceWorker = new BackgroundServiceWorker();

        CancellationToken cacheCancellationToken;

        public Worker(StockScreenerService service, ILogger<Worker> logger,
        IHubContext<StockHandler, IStockHandler> stockHandler)
        {
            _logger = logger;
            _stockScreenerService = service;
            _stockHandler = stockHandler;
        }

        protected override async Task ExecuteAsync(CancellationToken cancellationToken)
        {
            // Http Client // Do a manual call if this fails
            CancellationToken newToken;
            while (!cancellationToken.IsCancellationRequested)
            {

                // Put on a seperate thread

                // Read Database
                if (_init_called == false)
                {
                    Stocks.stocks.init(); // Change to singleton
                    _ = initialise_cache();
                    _init_called = !_init_called;
                }

                Time time = new Time();

                // Time Check
                /*   if (time.ReturnTime().Hours >= 17 && time.ReturnTime().Hours <= 8)
                   {
                       if (_cacheFull)
                       {
                           if (_sessionEnded == false ) // && getState sessionEnded=true
                           {
                               // Save last data to database
                               for (int key = 0; key < MAX; key++)
                               {
                                   String JSON = Cache.Get(key).Serialize();
                                   _ = saveEODdata(JSON);
                               }

                               // Stop the stream
                               _ = serviceWorker.StopAsync(cancellationToken);

                               newToken = new CancellationToken();
                               cancellationToken = newToken;

                               Console.WriteLine("STOP STREAM  ");

                               _sessionEnded = true;
                               _init_work = false;
                           }
                       }
                   }
                   else
                   {*/
                if (_sessionEnded)
                    _sessionEnded = false;

                if (_init_work == false)
                {
                    // Start the Service Worker
                    await _stockHandler.Clients.All.lockStream(serviceWorker.API_REQUESTS, false);
                    _ = serviceWorker.StartAsync(cancellationToken);
                    Console.WriteLine("START STREAM");
                    _init_work = !_init_work;
                }

                if (_cacheFull)
                {
                    for (int key = 0; key < MAX; key++)
                    {
                        String JSON = Cache.Get(key).Serialize();
                        await _stockHandler.Clients.All.requestData(key, JSON);
                    }
                }
                //  }

                await Task.Delay(5000);
            }
        }

        private async Task saveEODdata(string data) // convert to json
        {
            try
            {
                EndOfDayData eodData = EndOfDayData.Deserialize(data);
                bool idExists = _stockScreenerService.EODIdExists(eodData.Id);

                if (idExists)
                    _stockScreenerService.ClearEODdata(eodData.Id);

                _stockScreenerService.Create(eodData);

            }
            catch (Exception ex)
            {
                if (ex is System.ArgumentNullException || ex is System.TimeoutException)
                    Console.WriteLine("Exception " + ex);

                Console.WriteLine("Exception " + ex);
            }

            await Task.Delay(100);
            // Indicate lock stream
            await _stockHandler.Clients.All.lockStream(serviceWorker.API_REQUESTS, true);
        }

        private async Task copyTempToHistory() // convert to json
        {
            try
            {
                List<TempHistorical> list = _stockScreenerService.GetTempHistoricalData();

                for (int index = 0; index < list.Count; index++)
                {
                    _stockScreenerService.Create(list[index]);
                }

                int length = list.Count;
                for (int index = 0; index < length; index++)
                {
                    _stockScreenerService.Create(list[index]);
                }
            }
            catch (Exception ex)
            {
                if (ex is System.ArgumentNullException)
                    Console.WriteLine("Exception " + ex);

                Console.WriteLine("Exception " + ex);
            }

            await Task.Delay(100);
        }


        private async Task initialise_cache()
        {
            int start = 0;
            int end = 19;


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
                //  Console.WriteLine(start + " " + end);
                // await Task.Delay(delay, cancellationToken);
            }

            _cacheFull = true; // Cache is populated
            await Task.Delay(1000);
        }


        /*
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

                        /*   if (ReturnTime().Hours == 9 && ReturnTime().Minutes >= 0
                         && ReturnTime().Minutes <= 5)
                         {
                             if (serviceWorker._streamStarted)
                             {
                                 _ = serviceWorker.StartAsync(cacheCancellationToken);
                             }
                         }*/



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