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

        private string[] tradingHours = { "09:00am,12:30pm", "02:30pm,04:45pm", "04:50pm,05:00pm" };

        DateTime malaysiaTime = DateTime.UtcNow;

        const string easternZoneId = "Malaysia Time";

        private ChannelWriter<string[]> writerOne;

        public ChannelWriter<string[]> WriterOne
        {
            get { return writerOne; }
            set { writerOne = value; }
        }

        private ChannelWriter<bool> writerTwo;

        public ChannelWriter<bool> WriterTwo
        {
            get { return writerTwo; }
            set { writerTwo = value; }
        }

        public BackgroundServiceWorker()//ILogger<BackgroundServiceWorker> logger)
        {
            // _logger = logger;
        }

        public CancellationToken CancellationToken { get; set; }

        // Type task for asyc operations
        public Task StartAsync(CancellationToken stoppingToken)
        {
            try
            {
                // _logger.LogInformation("Timed Hosted Service running.");
                _timer = new Timer(getDataFromCache, null, TimeSpan.FromSeconds(5), TimeSpan.FromSeconds(30));
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






        public bool convertTime(int session, TimeSpan currentTime)
        {
            string sessionPeriod = tradingHours[session];

            String lowerBound = sessionPeriod.Substring(0, 5);
            String upperBound = sessionPeriod.Substring(7, 13);

            String lowerBound_meridian = lowerBound.Substring(3, 5);
            String upperBound_meridian = upperBound.Substring(3, 5);

            String lb_hours = (lowerBound.Substring(0, 1) != "0") ? lowerBound.Substring(0, 2) : lowerBound.Substring(0, 1);
            String lb_minutes = (lowerBound.Substring(0, 1) != "0") ? lowerBound.Substring(3, 4) : lowerBound.Substring(2, 4);

            String ub_hours = (upperBound.Substring(0, 1) != "0") ? upperBound.Substring(0, 2) : upperBound.Substring(0, 1);
            String ub_minutes = (upperBound.Substring(0, 1) != "0") ? upperBound.Substring(3, 4) : upperBound.Substring(2, 4);

            int _lb_hours = Int32.Parse(lb_hours);
            int _lb_minutes = Int32.Parse(lb_minutes);

            int _ub_hours = Int32.Parse(ub_hours);
            int _ub_minutes = Int32.Parse(ub_minutes);

            DateTime time = DateTime.Today.Add(currentTime);

            string _currentTime = time.ToString("hh:mm tt");

            int _currentTime_hours = 0;//Int32.Parse(lb_hours);
            int _currentTime_minutes = 0;
            String _currentTime_meridian = _currentTime.Substring(3, 5);

            if (_currentTime_hours > _lb_hours && _currentTime_hours < _ub_hours
                && !(_currentTime_meridian.Equals(upperBound_meridian)))
                return true;
            else
                return false;
            //            return displayTime;
        }

        public async void getDataFromCache(object current_state)
        {
            await Task.Delay(100);
            Console.WriteLine("Execution count ");
            try
            {
                TimeSpan time = ReturnTime();

                bool sessionOneTime = convertTime(0, time);
                bool sessionTwoTime = convertTime(1, time);
                bool sessionThreeTime = convertTime(2, time);

                if (!(sessionOneTime && sessionTwoTime && sessionThreeTime))
                    await WriterTwo.WriteAsync(false, CancellationToken);
                else
                    await WriterTwo.WriteAsync(true, CancellationToken);

                for (int pointer = 0; pointer < Stocks.StocksCode.Value.Length; pointer++)
                {
                    await WriterOne.WriteAsync(Stocks.cache.Get(pointer), CancellationToken);
                }
            }

            catch (Exception ex)
            {
                if (ex is StackOverflowException || ex is ArgumentNullException || ex is NullReferenceException || ex is ArgumentException ||
                ex is IndexOutOfRangeException ||
                ex is Newtonsoft.Json.JsonSerializationException
                || ex is MissingMemberException
                || ex is OverflowException || ex is System.Threading.Tasks.TaskCanceledException || ex is System.Threading.Channels.ChannelClosedException)

                // Redirect?      
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