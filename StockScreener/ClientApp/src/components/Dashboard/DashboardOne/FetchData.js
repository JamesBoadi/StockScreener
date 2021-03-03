import React, { Component } from 'react';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { DashboardNavbar } from '../DashboardNavbar';
import { NavBarData } from '../NavbarData.js';
import { TopNavbar } from '../TopNavbar.js';
import { SideBar } from '../SideBar';
import { Box } from '@chakra-ui/react';
import { DashboardSettings } from '../DashboardSettings';
import Nav from 'reactstrap/lib/Nav';
import { StockTableTwo } from '../StockTableTwo';
import * as signalR from '@aspnet/signalr';
import * as cache from 'cache-base';

/*
const hubConnection = new HubConnectionBuilder()
 .withUrl('https://localhost:44362/requestData')
 .withAutomaticReconnect()
 .build(); */

// Fetch data for dash board one
export class FetchData extends Component {
  static displayName = FetchData.name;
  static rowBuffer = [];

  constructor(props) {
    super(props);
    this.readNavBarData = this.readNavBarData.bind(this);
    this.onNotifReceived = this.onNotifReceived.bind(this);
    this.hubConnection = null;
    //this.startHubConnection = this.startHubConnection.bind(this);
    //this.createHubConnection = this.createHubConnection.bind(this);


    this.cache = new cache();
    this.called = false;

    this.state = {
      stockTableTwo: [],
      isStreaming: false,
      lock: false,
      forecasts: [], loading: true, hubConnection: HubConnectionBuilder(),
      nick: '',
      message: '',
      messages: [],
      hubConnection: null,
      request_Calls: -1,
      request_Update: 0,
      MAX_CALLS: 896,
      called: true,


      data: [
        {
          dashboardNum: null,
          indexValue: null,
          indexPercentage: null,
          startScan: null,
          lastScan: null,
          msCap: null,
          msCapPercentage: null,
          ACE: null,
          ACEpercentage: null
        }

        /* , stockData = [
        ] {stock data from other json file} (set Interval)
        */
      ]
    };
  }



  componentDidMount = () => {
    /* var cache_ = new cache();
     var count;
     for (count = 0; count < 897; count++) {
      
       const P = {
         StockCode: count,
         Change: 91,
         ChangeP: 1,
         Volume: 11,
         CurrentPrice: 102,
         ProfitLoss: 1,
         ProfitLoss_Percentage: 99,
         ChangeArray: 888,
         High: 10,
         Low: 14,
         Open: 76,
         Close: 10,
 
         /*  DateTime time = DateTime.Today.Add(service.ReturnTime());
           string _currentTime = time.ToString("HH:mmttss");
           
           stock.timestamp = _currentTime;
 
         Request_Calls: 5,
         TimeStamp: "9:00",
         ChangeArray: "iii",
         Request_Calls: "1"
       }
 
   //  console.log(P.StockCode + " " + "kkk");
       cache_.set(count.toString(), P);
       
     }
 
       this.setState({ cache: cache_ });
      this.setState({ lock: false });*/



    this.sendRequest();
  }

  // Replace with event listener
  componentDidUpdate = () => {
    var t = [];
    if (this.state.lock === true &&
      this.called === false) {
      t.push(<StockTableTwo
        {...this}
      />)

      this.setState({ stockTableTwo: t });
      this.called = true;
      //this.setState({ lock: true });
      t = [];
    }
  }

  // Equality check against IMMUTABLE data
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.lock){
      this.setState({ lock: false });
      return true;
    }
    return false;
  }

  readNavBarData = (num) => {
  }

  // Add the Row
  addRow = () => {
    FetchData.rowBuffer.push(<tbody>
      {forecasts.map(forecast =>
        <tr key={forecast.date}>
          <td>{forecast.date}</td>
        </tr>
      )}
    </tbody>)
  }

  // Replace with signal R (Keep th e cache)
  async temporaryStore() {
    setInterval(() => {

    }, 1000);
  }

  async sendRequest() {
    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:44362/stock')
      .configureLogging(signalR.LogLevel.Information)
      .build();

    await hubConnection
      .start()
      .then(() => console.log('Connection started!'))
      .catch(err => console.log('Error while establishing hubConnection :(')); // Redirect to 404 page

    console.log("CONNECTION " + hubConnection);

    let called = false;

    // Change so that we don't have to call requests using string
    hubConnection.stream("RequestData", this.state.request_Calls)
      .subscribe({
        next: (stockArray) => {

          var cache_ = new cache();
       
          // Account for faliures in connection
          var count = 0;
          for (count = 0; count < stockArray.length; count++) {
            const item = JSON.parse(stockArray[count]);
            this.setState({ request_Calls: item.Request_Calls });
            cache_.set(count.toString(), item);
            //console.log(item.StockCode + " " + "kkk");
          }

          /*   this.setState({ cache: cache_ });*/

          cache_.clear();

          //
        console.log("REQUESTS " + this.state.request_Calls)
          this.cache = cache_;

          this.setState({ lock: true });

          /*
          if (this.state.request_Calls !== this.state.MAX_CALLS) {
            this.setState({ request_Calls: request_Calls });

            // Start a countdown timer and disconnect if we don't get a response
          }
          else {
            this.setState({ lock: false });
            this.setState({ request_Calls: -1 });
          }*/
        },
        complete: () => {
          // render table
          console.log('End of DAY CALLS');
        },
        error: (err) => {
          console.log('err ' + err);
        }
      });
  }

  onNotifReceived(res) {
    console.info('Yayyyyy, I just received a notification!!!', res);
  }

  // https://www.codetinkerer.com/2018/06/05/aspnet-core-websockets.html

  render() {

    this.readNavBarData(0);

    // Create multiple fetch datas for each dashboard
    //Dashboard
    return (

      <div>
        {/* <SideBar
          isStreaming={() => { return this.state.isStreaming }}
       /> */}
        <TopNavbar
          Data={this.state.data}
        />

        <DashboardNavbar
          {...this}
        />

        <div id="tableContainer">
          {this.state.stockTableTwo}
        </div>
      </div>
    );
  }
}



    //  FetchData.sendRequest("I have a message", "of glory");
/*

 static convertFrombytes() {
console.log('I am running!');
/* writeToScreen("CONNECTED");
doSend("WebSocket rocks");
console.log("Sample application");
}
    const protocol = new signalR.JsonHubProtocol();
    const transport = signalR.HttpTransportType.ServerSentEvents;

    const options = {
      transport,
      logMessageContent: true,
      logger: signalR.LogLevel.Trace,
      //accessTokenFactory: () => this.props.accessToken,
    };

    // create the hubConnection instance
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:44362/stock')
      .build();

    //  this.hubConnection.on('RequestData', this.onNotifReceived);
    //this.hubConnection.on('DownloadSession', this.onNotifReceived);
    //this.hubConnection.on('UploadSession', this.onNotifReceived);

    this.hubConnection.start()
      .then(() => console.info('SignalR Connected'))
      .catch(err => console.error('SignalR Connection Error: ', err));



  <br />
    <input
      type="text"
      value={this.state.message}
      onChange={e => this.setState({ message: e.target.value })}
    />

    <button onClick={
      this.sendRequest}>Send</button>
    <div>

      {this.state.messages.map((message, index) => (
        <span style={{ display: 'block' }} key={index}> {message} </span>
      ))}
    </div>

    {this.renderTable(obj)}
*/

/*   var streamTwo_ = this.state.hubConnection.stream("LockStream", arr)
              .subscribe({
                next: (sessionProperties) => {
                 const session = parseInt(sessionProperties[0]); // Get the session to display time
                  const state = Boolean(sessionProperties[1]);

                  if (state === -1)
                    this.setState({ lock: true });
                  else {
                    if (this.state.lock !== false)
                      this.setState({ lock: false });
                  }
                },
                complete: () => {
                  // render table
                  console.log('complete');
                },
                error: (err) => {
                  console.log('err ' + err);
                }
              });

          /*  if (this.state.lock) {
              console.log('ERASED');
              stream_.dispose(); // Dispose stream if lock is true
            }*/
