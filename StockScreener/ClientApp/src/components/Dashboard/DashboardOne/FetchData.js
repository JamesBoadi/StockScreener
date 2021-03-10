import React, { Component } from 'react';
import { DashboardNavbar } from '../DashboardNavbar';
import { NavBarData } from '../NavbarData.js';
import { TopNavbar } from '../TopNavbar.js';
import { NotificationsTable } from '../NotificationsTable';
import { SideBar } from '../SideBar';
import { DashboardSettings } from '../DashboardSettings';
import { StockTable } from '../StockTable';
import { StockTableTwo } from '../StockTableTwo';
import {
  Box, Button, NumberInput,
  NumberInputField, NumberInputStepper,
  NumberIncrementStepper, NumberDecrementStepper
} from '@chakra-ui/react';

import Nav from 'reactstrap/lib/Nav';
import * as signalR from '@aspnet/signalr';
import * as cache from 'cache-base';
import * as HashMap from 'hashmap';



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
    this.addAlertTableRow = this.addAlertTableRow.bind(this);
    this.removeAlertTableRow = this.removeAlertTableRow.bind(this);

    this.setAlertTableRowBool = this.setAlertTableRowBool.bind(this);
    this.getAlertTableRowBool = this.getAlertTableRowBool.bind(this);
    this.setRemoveAlertTableRowBool = this.setRemoveAlertTableRowBool.bind(this);
    this.getRemoveAlertTableRowBool = this.getRemoveAlertTableRowBool.bind(this);

    this.selectAlertTableRow = this.selectAlertTableRow.bind(this);
    this.selectStockTableRow = this.selectStockTableRow.bind(this);

    this.triggerAnimation = this.triggerAnimation.bind(this);

    this.keyExists = this.keyExists.bind(this);
    this.hubConnection = null;
    //this.startHubConnection = this.startHubConnection.bind(this);
    //this.createHubConnection = this.createHubConnection.bind(this);
    this.cache = new cache();
    this.called = false;
    this.alertTable = [];
    this.textInput = React.createRef();
    this.map = new HashMap();


    this.state = {
      stockTableTwo: [],
      isStreaming: false,
      lock: false,
      forecasts: [], loading: true,
      nick: '',
      message: '',
      messages: [],
      hubConnection: null,
      request_Calls: -1,
      request_Update: 0,
      MAX_CALLS: 896,
      called: true,

      green: false,
      red: false,
      priceChangeUp: false,
      validInput: false,
      display: [],
      stockRecord: 0,
      scroll: 0,
      query: {},

      addAlertTableRowBool: false,
      removeAlertTableRowBool: false,
      alertTableStocks: [],
      alertTableStack: [],
      clickAlertTableRow: 0,
      target: 0,

      maxNumberOfAlertTableRows: 0,

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
    var cache_ = new cache();
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
          string _currentTime = time.ToString("HH:mmttss"); */
        //stock.timestamp = _currentTime
        Request_Calls: 5,
        TimeStamp: "9:00",
        ChangeArray: "iii",
        Request_Calls: "1"
      }
  
      //console.log(P.StockCode + " " + "kkk");
      cache_.set(count.toString(), P);
    }

    this.cache = cache_;
    this.setState({ lock: true });
    this.forceUpdate()
    //this.sendRequest();
  }

  // Replace with event listener
  componentDidUpdate = () => {
    //  console.log('LOCK ' + this.state.lock) 
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
    if (this.state.lock) {
      this.setState({ lock: false });
      return true;
    }
    else if (this.state.addAlertTableRowBool !== nextState.addAlertTableRowBool
      || this.state.removeAlertTableRowBool !== nextState.removeAlertTableRow) {
      return true;
    }
    return false;
  }

  // Select a row from Stock Table
  selectStockTableRow(e) {
    const alertTableId = parseInt(e.target.id);
    this.setState({ clickAlertTableRow: alertTableId });
  }

  // Select a row from Alert Table
  selectAlertTableRow(e) {
    const alertTableId = parseInt(e.target.id);
    console.log('ALERT ID ' + alertTableId)
    this.setState({ target: alertTableId });
    this.setState({ addAlertTableRowBool: true });
  }

  // Disable button until a stock is CLICKED
  async keyExists(e, target) {
    //  e.persist();
    return new Promise(resolve => {
      setTimeout(() => {
        //    e.stopPropagation();
        const target_ = parseInt(target);

        for (const pair of this.map) {
          let value = parseInt(pair.value);
          if (target_ === value)
            resolve(true);
        }
        resolve(false);
      }, 100);
    });
  }

  async addAlertTableRow(e) {
    var t = this.state.alertTableStack;
    var alertTableStocks = this.state.alertTableStocks;
    let target = parseInt(this.state.clickAlertTableRow);

    const exists = await this.keyExists(e, target);
    const maxRows = 45;

    if (exists || this.state.maxNumberOfAlertTableRows >= maxRows)
      return;
    // Read from Database


    // Stocks to be displayed in alert table
    alertTableStocks.push(this.cache.get(target.toString()))
    let pointer = alertTableStocks.length - 1;

    t.push(
      <tbody>
        <tr key={pointer} >
          <td id={pointer} onClick={this.selectAlertTableRow}>{alertTableStocks[pointer].StockCode.toString()}</td>
          <td id={pointer} onClick={this.selectAlertTableRow}>{alertTableStocks[pointer].TimeStamp.toString()}</td>
          <td id={pointer} onClick={this.selectAlertTableRow}>{alertTableStocks[pointer].CurrentPrice.toString()} </td>
          <td id={pointer} onClick={this.selectAlertTableRow}>{alertTableStocks[pointer].ProfitLoss_Percentage.toString()}</td>
          <td id={pointer} onClick={this.selectAlertTableRow}>{alertTableStocks[pointer].Volume.toString()}</td>
        </tr>
      </tbody>
    )
    // Add id with its value to map
    // key: 0..N value: alertTable
    this.map.set(pointer, target);
    // Save to Database

    console.log('NEXT')

    // Force an update
    this.setState({ maxNumberOfAlertTableRows: this.state.maxNumberOfAlertTableRows + 1 });
    this.setState({ alertTableStack: t });
    this.setState({ alertTableStocks: alertTableStocks });
    this.setState({ addAlertTableRowBool: true });
  }

  triggerAnimation(param) {
    console.log('CALL ACK HELL ' + param)






  }

  // Are you sure you want to remove this stock?
  removeAlertTableRow() {
    if (this.state.maxNumberOfAlertTableRows < 1)
      return;

    let pointer;
    let start = 0;
    let end = this.state.alertTableStocks.length - 1;
    let target = parseInt(this.state.target);
    let alertTableStocks = [];

    for (pointer = start; pointer <= end; pointer++) {
      // console.log('alertTableId ' + pointer + ' target ' + target);
      if (pointer === target) {
        this.map.delete(pointer);
        continue;
      }
      else
        alertTableStocks.push(this.state.alertTableStocks[pointer]);
    }

    this.setState({ maxNumberOfAlertTableRows: this.state.maxNumberOfAlertTableRows - 1 });
    this.setState({ alertTableStocks: alertTableStocks });
    this.setState({ removeAlertTableRowBool: true });
  }

  setAlertTableRowBool(bool) {
    this.setState({ addAlertTableRowBool: bool });
  }

  getAlertTableRowBool() {
    return this.state.addAlertTableRowBool;
  }

  setRemoveAlertTableRowBool(bool) {
    this.setState({ removeAlertTableRowBool: bool });
  }

  getRemoveAlertTableRowBool() {
    return this.state.removeAlertTableRowBool;
  }

  set(bool) {
    this.setState({ addAlertTableRowBool: bool });
  }


  getAlertTableRowBool() {
    return this.state.addAlertTableRowBool;
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


    var cache_ = new cache();
    // Change so that we don't have to call requests using string
    hubConnection.stream("RequestData", this.state.request_Calls)
      .subscribe({
        next: (stockArray) => {
          cache_.clear();

          // Account for faliures in connection
          var count = 0;
          for (count = 0; count < stockArray.length; count++) {
            const item = JSON.parse(stockArray[count]);
            this.setState({ request_Calls: item.Request_Calls });
            cache_.set(count.toString(), item);
          }

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
    // Create multiple fetch datas for each dashboard
    //Dashboard
    return (

      <div>
        <Box
          style={{ position: 'absolute', top: '340px', left: '60px' }}
          bg='rgb(40,40,40)'
          boxShadow='sm'
          height='305px'
          width='62rem'
          rounded="lg"
          margin='auto'
          zIndex='0'>

          <h1 style={{ position: 'relative', textAlign: 'center', color: 'white' }}>AAPL (Apple Inc)</h1>
          <h3 style={{ position: 'relative', textAlign: 'center', color: 'white' }}>Price: 286.7</h3>
          <h4 style={{ position: 'relative', top: '30px', left: '0px', color: 'white' }}>Sector: Technology</h4>
          <h4 style={{ position: 'relative', top: '30px', left: '0px', color: 'white' }}>Message: Possible Reversal</h4>

          {/* Entry: Largest gap in either shorts or calls (Calculate in c#) */}
          <h4 style={{ position: 'relative', top: '35px', left: '0px', color: 'white' }}>Possible Entry:  </h4>
          <NumberInput
            style={{ left: '170px' }}
            size="md" maxW={70} defaultValue={15} min={10} max={20}>
            <NumberInputField />
            <NumberInputStepper >
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>

          <h4 style={{ position: 'relative', top: '10px', left: '0px', color: 'white' }}>Take Profit: 270.6</h4>

          <Button id="GreenArrow" style={{
            position: 'absolute', top: '60px', right: '180px'
            , visibility: (!this.state.red && this.state.green
              && this.state.priceChangeUp) ? "visible" : "hidden"
          }} colorScheme="blue" />

          <Button id="RedArrow" style={{
            position: 'absolute', top: '60px', right: '90px',
            visibility: (this.state.red && !this.state.green
              && !priceChangeUp) ? "visible" : "hidden"
          }} colorScheme="blue" />

          <Button onClick={this.addAlertTableRow}
            style={{ position: 'absolute', bottom: '20px', right: '180px', width: '90px' }}>
            Add <br />to Alerts</Button>

          <Button onClick={this.removeAlertTableRow}
            style={{ position: 'absolute', bottom: '20px', right: '50px', width: '90px' }}>
            Remove  <br /> from Alerts</Button>
        </Box>

          {/* <SideBar
          isStreaming={() => { return this.state.isStreaming }}
       /> */}
          <TopNavbar
            Data={this.state.data}
          />

          {/* ALERT TABLE */
            <NotificationsTable {...this} />
          }
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
