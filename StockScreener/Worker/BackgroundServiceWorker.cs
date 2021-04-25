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

        private readonly ILogger<BackgroundServiceWorker> _logger;
        private Timer _timer;

        public readonly int MAX_API_REQUESTS = (8 * 60 * 60) / 290;

        public int API_REQUESTS = 0;

        public bool _streamStarted = true;

        private string[] tradingHours = { "09:00am-12:30pm", "02:30pm-05:00pm" };

        DateTime malaysiaTime = DateTime.UtcNow;

        const string easternZoneId = "Singapore Standard Time";

        static int REQUESTS = 1;

        //  private readonly MemoryCache memoryCache;// = new MemoryCache();

        private Manager stocks = new Manager();

        public CancellationToken CancellationToken { get; set; }

        // Start operation for retreving stocks every 30 seconds
        public Task StartAsync(CancellationToken cancellationToken)
        {
            try
            {
                _timer = new Timer(getDataFromCache, null,
                TimeSpan.FromSeconds(5), TimeSpan.FromSeconds(30));
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

        public async void getDataFromCache(object current_state)
        {
            int length = Manager.ManagerCode.Value.Length;
            try
            {
               /* if (API_REQUESTS == MAX_API_REQUESTS)
                {
                    API_REQUESTS = -1;
                    _streamStarted = false;
                    return;
                }
                else
                {
                    if (_streamStarted == false)
                        _streamStarted = true;
                    if (API_REQUESTS == -1)
                    {
                        API_REQUESTS = 0;
                    }
                }*/

                /*  TimeSpan time = ReturnTime();
                  int count = -1;

                  while (count < 2)
                      convertTime(++count, time);*/

                // Update stocks
                // var count = Interlocked.Increment(ref executionCount);

                Manager.stocks.updateManager(0, length);
                API_REQUESTS += 1;

                await Task.Delay(100);
            }
            catch (Exception ex)
            {
                if (ex is StackOverflowException || ex is KeyNotFoundException || ex is ArgumentNullException || ex is NullReferenceException || ex is ArgumentException ||
                ex is IndexOutOfRangeException ||
                ex is Newtonsoft.Json.JsonSerializationException
                || ex is MissingMemberException
                || ex is OverflowException || ex is System.Threading.Tasks.TaskCanceledException || ex is System.Threading.Channels.ChannelClosedException)
                    // Redirect?      
                    Console.WriteLine("exception " + ex);
            }
        }

        public TimeSpan ReturnTime()
        {
            TimeZoneInfo easternZone = TimeZoneInfo.FindSystemTimeZoneById(easternZoneId);
            return TimeZoneInfo.ConvertTime(malaysiaTime, easternZone).TimeOfDay;
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

        // Stop the timer
        public Task StopAsync(CancellationToken stoppingToken)
        {
            //  _logger.LogInformation("Timed Hosted Service is stopping.");
            Console.WriteLine("STOP STREAM CHOW  ");
            
            _timer?.Change(Timeout.Infinite, 0);

            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }


    }

}

/*
  private ChannelWriter<string[]> writerOne;

        public ChannelWriter<string[]> WriterOne
        {
            get { return writerOne; }
            set { writerOne = value; }
        }

        private ChannelWriter<object[]> writerTwo;

        public ChannelWriter<object[]> WriterTwo
        {
            get { return writerTwo; }
            set { writerTwo = value; }
        }

        private static int[] timeArray = new int[2];

        bool sessionOneBool = false;
        bool sessionTwoBool = false;

        bool sessionThreeBool = false;

        private object[] setSession;

        public object[] SetSession
        {
            get
            {
                return setSession;
            }
            set
            {
                setSession = value;

                int session = (int)setSession[0];
                bool state = (bool)setSession[1];

                if (session == 0)
                {
                    sessionOneBool = state;
                }
                else if (session == 1)
                {
                    sessionTwoBool = state;
                }
                else if (session == 2)
                {
                    sessionThreeBool = state;
                }

                if (!(sessionOneBool && sessionTwoBool && sessionThreeBool))
                {
                    setSession[0] = -1;
                    setSession[1] = null;
                    setSession = value;
                }
            }
        }

        
        public static int[] returnCurrentTime(TimeSpan currentTime)
        {
            DateTime time = DateTime.Today.Add(currentTime);
            string _currentTime = time.ToString("HH:mmtt");

            String _currentTime_meridian = _currentTime.Substring(5, 2).ToLower();

            String _currentTime_hours = (_currentTime.Substring(0, 1) != "0") ? _currentTime.Substring(0, 2) : _currentTime.Substring(1, 1);
            String _currentTime_minutes = (_currentTime.Substring(3, 1) != "0") ? _currentTime.Substring(3, 2) : _currentTime.Substring(4, 1);

            int _currentTime_hours_ = Int32.Parse(_currentTime_hours);
            int _currentTime_minutes_ = Int32.Parse(_currentTime_minutes);

            return new int[] { _currentTime_hours_, _currentTime_minutes_ };
        }

        object[] sessionProperties = new object[2];

        public void convertTime(int session, TimeSpan currentTime)
        {
            /*  String sessionPeriod = tradingHours[session];

              String lowerBound = sessionPeriod.Substring(0, 5);
              String upperBound = sessionPeriod.Substring(8, 5);

              String lowerBound_meridian = sessionPeriod.Substring(5, 2);
              String upperBound_meridian = sessionPeriod.Substring(13, 2);

              String lb_hours = (lowerBound.Substring(0, 1) != "0") ? lowerBound.Substring(0, 2) : lowerBound.Substring(1, 1);
              String lb_minutes = (lowerBound.Substring(3, 1) != "0") ? lowerBound.Substring(3, 2) : lowerBound.Substring(4, 1);

              String ub_hours = (upperBound.Substring(0, 1) != "0") ? upperBound.Substring(0, 2) : upperBound.Substring(1, 1);
              String ub_minutes = (upperBound.Substring(3, 1) != "0") ? upperBound.Substring(3, 2) : upperBound.Substring(3, 1);

              int _lb_hours = Int32.Parse(lb_hours);
              int _lb_minutes = Int32.Parse(lb_minutes);

              int _ub_hours = Int32.Parse(ub_hours);
              int _ub_minutes = Int32.Parse(ub_minutes);

              DateTime time = DateTime.Today.Add(currentTime);
              string _currentTime = time.ToString("HH:mmtt");

              String _currentTime_meridian = _currentTime.Substring(5, 2).ToLower();

              int[] arr = returnCurrentTime(currentTime);
              int currentTime_hours = arr[0];
              int currentTime_minutes = arr[1];


              // Return a session based on a number
              switch (session)
              {
                  case 0:
                      if (currentTime_hours > _lb_hours && currentTime_hours < _ub_hours
                          && _currentTime_meridian != upperBound_meridian)
                      {
                          sessionProperties[0] = 0;
                          sessionProperties[1] = true;
                      }
                      else
                      {
                          sessionProperties[0] = 0;
                          sessionProperties[1] = false;
                      }
                      break;

                  case 1:
                      if (currentTime_hours > _lb_hours && currentTime_hours < _ub_hours
                          && _currentTime_meridian != upperBound_meridian)
                      {
                          sessionProperties[0] = 1;
                          sessionProperties[1] = true;
                      }
                      else
                      {
                          sessionProperties[0] = 1;
                          sessionProperties[1] = false;
                      }
                      break;

                  case 2:
                      if (currentTime_hours > _lb_hours && currentTime_hours < _ub_hours
                          && _currentTime_meridian != upperBound_meridian)
                      {
                          sessionProperties[0] = 2;
                          sessionProperties[1] = true;
                      }
                      else
                      {
                          sessionProperties[0] = 2;
                          sessionProperties[1] = false;
                      }
                      break;
              }

              // Reset the day move to zero (next day)
              if(currentTime_hours == 0 && currentTime_minutes == 0)
               {
                  UtilityFunctions.DayMove = 0;
                  UtilityFunctions.TDays = (UtilityFunctions.TDays < 10) ? UtilityFunctions.TDays += 1 : 1;
               }   

              SetSession = sessionProperties;*/




