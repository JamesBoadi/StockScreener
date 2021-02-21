import React, { Component } from 'react';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { sendRequest } from '@microsoft/signalr/dist/esm/Utils';
import { StockTable } from '../StockTable';
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
    this.cache = new Map();
    this.readNavBarData = this.readNavBarData.bind(this);
    this.onNotifReceived = this.onNotifReceived.bind(this);
    this.hubConnection = null
    //this.startHubConnection = this.startHubConnection.bind(this);
    //this.createHubConnection = this.createHubConnection.bind(this);
    this.startStreaming = this.startStreaming.bind(this);
    this.cache = new cache();

    this.state = {
      isStreaming: false,
      lock: false,
      forecasts: [], loading: true, hubConnection: HubConnectionBuilder(),
      nick: '',
      message: '',
      messages: [],
      hubConnection: null,
      column_counter: 0,
      MAX_CALLS: null,

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
    //this.sendRequest();
  }


  readNavBarData = (num) => {
    var NavBar = NavBarData.navBar;
    var currentData = this.state.data;

    currentData[0].dashboardNum = NavBar[num].dashboardNum;
    currentData[0].indexValue = NavBar[num].indexValue;
    currentData[0].indexPercentage = NavBar[num].indexPercentage;
    currentData[0].startScan = NavBar[num].startScan;
    currentData[0].lastScan = NavBar[num].lastScan;
    currentData[0].msCap = NavBar[num].msCap;
    currentData[0].msCapPercentage = NavBar[num].msCapPercentage;
    currentData[0].ACE = NavBar[num].ACE;
    currentData[0].ACEpercentage = NavBar[num].ACEpercentage;

    this.state.data = currentData;
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

  async startStreaming(hubConnection) {
    let isOK = false;
    var t = ["ahhhhhhhhhhhhhhh"];
    console.log(this.hubConnection)
    try {
      await hubConnection.stream("RequestData", t)
        .subscribe({
          next: stockArray => {
            try {
              console.log('HELLO' + stockArray)

              var count = 0;

              for (count = 0; count < stockArray.length; count++) {
                console.log("next " + stockArray[count]);
              }

            }
            catch (err) {
              console.error('Comm: Error in hub streaming callback. ' + err);
            }
          },
          complete: () => console.log('Comm: Hub streaming completed.'),
          error: err => console.error('Comm: Error in hub streaming subscription. ' + err)
        });

      console.log('Comm: Hub streaming started.');
      isOK = true;
    }
    catch (err) {
      console.error('Comm: Error in hub startStreaming(). ' + err);
    }

    return isOK;
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

    // Set the state of this column counter
    this.setState({ column_counter: this.state.column_counter + 1 });
    var arr = ["k"];

    // arr.push(this.state.column_counter.toString());
    // arr.push("500");
    hubConnection.stream("RequestData", arr)
      .subscribe({
        next: (stockArray) => {

          // Account for faliures in connection
          var count = 0;
          for (count = 0; count < stockArray.length; count++) {
            let item = JSON.parse(stockArray[count]);
            this.cache.set(count, item);
          }



          /*
                      const request_Calls = parseInt(stockArray[5]);
                      const max_Calls = parseInt(stockArray[6]);
          
                      this.setState({ column_counter: request_Calls });
          
                      if (this.state.MAX_CALLS == null || this.state.MAX_CALLS != max_Calls)
                        this.setState({ MAX_CALLS: max_Calls });
          
                      if (this.state.column_counter == this.state.MAX_CALLS) {
                        this.setState({ lock: true })
                      }
          
                      //   console.log(stockArray + " " + request_Calls + " " + max_Calls);
                      //   console.log("Array " + stockArray);*/
        },
        complete: () => {
          // render table
          console.log('complete');
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
          Data={this.state.data}
        />

        <div id="tableContainer">
          <StockTableTwo
          {...this}
          />
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
