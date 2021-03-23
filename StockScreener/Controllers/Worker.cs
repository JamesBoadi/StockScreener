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
        private readonly IHubContext<StockHandler, IStockHandler> _stockHandler;

        private static bool init_called = false;

        private static bool _init_work = false;

        BackgroundServiceWorker serviceWorker = new BackgroundServiceWorker();

        public Worker(ILogger<Worker> logger, IHubContext<StockHandler, IStockHandler> stockHandler)
        {
            _logger = logger;
            _stockHandler = stockHandler;
        }

        protected override async Task ExecuteAsync(CancellationToken cancellationToken)
        {
            if (!cancellationToken.IsCancellationRequested)
            {

                if (init_called == false)
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


                await Task.Delay(100);



                await _stockHandler.Clients.All.requestData();

            }
            else
            {


            }
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