using System;
using Xunit;
using StockScreener;
using Xunit.Abstractions;

namespace StockScreener.Tests
{
    public class UnitTest1
    {


        private readonly ITestOutputHelper output;

        public UnitTest1(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public void Test1()
        {

            BackgroundServiceWorker service = new BackgroundServiceWorker();
            TimeSpan time = service.ReturnTime();
            
            service.convertTime(0, time);

         

           // output.WriteLine(  );
            Assert.Equal(1, 1);
        }
    }
}
