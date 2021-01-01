using System;
using System.Collections.Generic;
using System.Configuration;
using System.Web;
using EODHistoricalData.NET;
using System.Net;
using System.IO;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Threading.Channels;

using System.Globalization;
// https://stackoverflow.com/questions/6381878/how-to-pass-the-multiple-parameters-to-the-system-threading-timer
namespace StockScreener
{
    public class BackgroundServiceWorker : IHostedService, IDisposable
    {
        private int executionCount = 0;
        private readonly ILogger<BackgroundServiceWorker> _logger;
        private Timer _timer;

        private string[] tradingHours =
        {"9:00am-12:30pm","2:30pm-4:45pm","4:50pm-5:00pm"};

        DateTime malaysiaTime = DateTime.UtcNow;

        const string easternZoneId = "Malaysia Time";

        private ChannelWriter<string[]> writer;

        public ChannelWriter<string[]> Writer
        {
            get { return writer; }
            set { writer = value; }
        }


        public BackgroundServiceWorker()//ILogger<BackgroundServiceWorker> logger)
        {
            // _logger = logger;
        }

        public CancellationToken CancellationToken { get; set; }
        // Type task for asyc operations
        public Task StartAsync(CancellationToken stoppingToken)
        {
            var channel = Channel.CreateUnbounded<string[]>();

            try
            {
                // _logger.LogInformation("Timed Hosted Service running.");
                _timer = new Timer(getData, null, TimeSpan.FromSeconds(5), TimeSpan.FromSeconds(30));
            }
            catch (Exception ex)
            {
                if (ex is StackOverflowException || ex is ArgumentNullException || ex is NullReferenceException ||
              ex is IndexOutOfRangeException ||
              ex is Newtonsoft.Json.JsonSerializationException
              || ex is MissingMemberException)
                    Console.WriteLine("exception one " + ex);
            }

            return Task.CompletedTask;
        }

        public async void getData(object current_state)
        {
            await Task.Delay(100);
            Console.WriteLine("Execution count ");

            try
            {
                for (int pointer = 0; pointer < Stocks.StocksCode.Value.Length; pointer++)
                {
                    await Writer.WriteAsync(Stocks.cache.Get(pointer), CancellationToken);
                }

                



            }
            catch (Exception ex)
            {
                if (ex is StackOverflowException || ex is ArgumentNullException || ex is NullReferenceException || ex is ArgumentException ||
                ex is IndexOutOfRangeException ||
                ex is Newtonsoft.Json.JsonSerializationException
                || ex is MissingMemberException
                || ex is OverflowException || ex is System.Threading.Tasks.TaskCanceledException || ex is System.Threading.Channels.ChannelClosedException)
                    Console.WriteLine("exception " + ex);
            }



        }
        /*
                private void DoWork(object state)
                {
                    var count = Interlocked.Increment(ref executionCount);

                    _logger.LogInformation(
                        "Timed Hosted Service is working. Count: {Count}", count);
                }*/

        public TimeSpan ReturnTime()
        {
            TimeZoneInfo easternZone = TimeZoneInfo.FindSystemTimeZoneById(easternZoneId);
            return TimeZoneInfo.ConvertTimeToUtc(malaysiaTime, easternZone).TimeOfDay;
        }

        public DateTime ReturnDate()
        {
            TimeZoneInfo easternZone = TimeZoneInfo.FindSystemTimeZoneById(easternZoneId);
            return TimeZoneInfo.ConvertTimeToUtc(malaysiaTime, easternZone).Date;
        }

        public Enum ReturnDay()
        {
            TimeZoneInfo easternZone = TimeZoneInfo.FindSystemTimeZoneById(easternZoneId);
            return TimeZoneInfo.ConvertTimeToUtc(malaysiaTime, easternZone).DayOfWeek;
        }

        public Task StopAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Timed Hosted Service is stopping.");

            _timer?.Change(Timeout.Infinite, 0);

            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }


    }

}