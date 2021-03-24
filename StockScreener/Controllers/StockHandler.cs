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
    public class StockHandler : Hub<IStockHandler>
    {
        static int counter = 0;

        // Dependency Injection and Inversion of Control
        public async Task requestData(int key, string data)
        {
            await Clients.All.requestData(key, data);
        }


        public async Task lockStream(int requests)
        {
            await Clients.All.lockStream(requests);
        }


        /*
                public async Task requests(int requests)
                {
                    await Clients.All.requests(requests);
                }*/

        // Call Hub methods that are not inverted (e.g. Task )
    }
}