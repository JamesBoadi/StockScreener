import React, { Component } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { sendRequest } from '@microsoft/signalr/dist/esm/Utils';
import StockTable from '../StockTable';
import { DashboardNavbar } from '../DashboardNavbar';
import {NavBarData }from '../NavbarData.js';
import Nav from 'reactstrap/lib/Nav';

/*
const connection = new HubConnectionBuilder()
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

    this.state = {
      isStreaming: false,
      lock: false,
      forecasts: [], loading: true, connection: HubConnectionBuilder(),
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


  readNavBarData = () => {
    var NavBar = NavBarData;
    var currentData = this.state.data[0];

    currentData.dashboardNum = NavBar.dashboardNum;
    currentData.indexValue = NavBar.indexValue;
    currentData.indexPercentage = NavBar.indexPercentage;
    currentData.startScan = NavBar.startScan;
    currentData.lastScan = NavBar.lastScan;
    currentData.msCap = NavBar.msCap;
    currentData.msCapPercentage = NavBar.msCapPercentage;
    currentData.ACE = NavBar.ACE;
    currentData.ACEpercentage = NavBar.ACEpercentage;

    this.state.data[0] = currentData;
  }



  /*
    setInterval(() => {
      
    }, interval);
    
    */


  // Render the Table
  renderTable = (forecasts) => {
    let table = <table className='table table-striped' aria-labelledby="tabelLabel">
      <thead>
        <tr>
          <th>Open</th>
          <th>Name</th>
          <th>Change</th>
          <th>ChangePercentage</th>
          <th>Volume</th>
        </tr>
      </thead>

      {FetchData.rowBuffer}
    </table>;

    return table;
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

  componentDidMount = () => {
    /*  const hubConnection = new HubConnectionBuilder()
        .withUrl('https://localhost:44362/requestScan')
        .withAutomaticReconnect()
        .build();
  
      this.setState({ hubConnection: hubConnection }, () => {
        this.state.hubConnection
          .start()
          .then(() => console.log('Connection started!'))
          .catch(err => console.log('Error while establishing connection :(')); // Redirect to 404 page
        /* Returns stockarray (Data) and request array (calls and max calls) */
    /*   this.state.hubConnection.on('ScanResponse',
         (stockArray, requestArray) => {
 
           const request_Calls = parseInt(requestArray[0]);
           const max_Calls = parseInt(requestArray[1]);
 
           if (this.state.MAX_CALLS == null || this.state.MAX_CALLS != max_Calls)
             this.setState({ MAX_CALLS: max_Calls });
 
           if (this.state.column_counter == this.state.MAX_CALLS)
             this.setState({ lock: true })
 
           console.log(stockArray + " " + request_Calls + " " + max_Calls);
 
           if (this.state.lock == false)
             this.sendRequest(); // Send message again
         });
  }); */
  }

  sendRequest = () => {
    // Set the state of this column counter
    //this.setState({ column_counter: this.state.column_counter + 1 });
    /*  var arr = [];
      arr.push(this.state.column_counter.toString());
      arr.push("500");
  
      var stream_ = this.state.hubConnection.stream("RequestData", arr)
        .subscribe({
  
          next: (stockArray) => {
            var i = 0;
  
            for (i = 0; i < stockArray.length; i++) {
              console.log("next " + stockArray[i]);
            }
  
            /*     const request_Calls = parseInt(stockArray[5]);
                 const max_Calls = parseInt(stockArray[6]);
       
                 this.setState({ column_counter: request_Calls });
       
                 if (this.state.MAX_CALLS == null || this.state.MAX_CALLS != max_Calls)
                   this.setState({ MAX_CALLS: max_Calls });
       
                 if (this.state.column_counter == this.state.MAX_CALLS) {
                   this.setState({ lock: true })
                 }
  
            //   console.log(stockArray + " " + request_Calls + " " + max_Calls);
  
            //   console.log("Array " + stockArray);
          },
          complete: () => {
            // render table
            console.log('complete');
          },
          error: (err) => {
            console.log('err ' + err);
          }
        });
  
      var streamTwo_ = this.state.hubConnection.stream("LockStream", arr)
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
  
      if (this.state.lock) {
        console.log('ERASED');
        stream_.dispose(); // Dispose stream if lock is true
      }*/
  }




  // https://www.codetinkerer.com/2018/06/05/aspnet-core-websockets.html


  render() {
    //  FetchData.sendRequest("I have a message", "of glory");

    /*
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

    // Create multiple fetch datas for each dashboard
    //Dashboard
    return (
      <div>
        <DashboardNavbar
          Data={() => { return this.state.data[0] }}
        />
        <StockTable
          isStreaming={() => { return this.state.isStreaming }}
          Data={() => { return this.state.data[1] }}
        />
      </div>
    );
  }

  static convertFrombytes() {
    console.log('I am running!');
    /* writeToScreen("CONNECTED");
    doSend("WebSocket rocks");
    console.log("Sample application");*/
  }


  // Replace with signal R (Keep th e cache)
  async temporaryStore() {
    setInterval(() => {

    }, 1000);
  }

}
