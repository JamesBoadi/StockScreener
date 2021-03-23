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

        public async Task requestData(string[] data)
        {
            await Clients.All.requestData(data);
        }

        public async Task requests(int requests)
        {
            

            await Clients.All.requests(requests);
        }
    }
}