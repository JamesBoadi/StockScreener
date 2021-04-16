using System;

namespace StockScreener
{
    public class Time
    {
        DateTime malaysiaTime = DateTime.UtcNow;

        const string easternZoneId = "Singapore Standard Time";

        public TimeSpan ReturnTime()
        {
            TimeZoneInfo easternZone = TimeZoneInfo.FindSystemTimeZoneById(easternZoneId);
            return TimeZoneInfo.ConvertTime(malaysiaTime, easternZone).TimeOfDay;
        }


    }
}