import React, { Component } from 'react';
import { TopNavbar } from '../TopNavbar.js';
import { NotificationsTable } from './NotificationsTable';
import { SideBar } from '../SideBar';
import { DashboardSettings } from '../DashboardSettings';
import { StockTableTwo } from './StockTableTwo';
import { AlertReducer } from './js/AlertReducer.js';
import TableCache from './js/TableCache.js';
import AlertCache from './js/AlertCache.js';
import PriceSettings from './js/PriceSettings.js';
import DataServiceWorker from './js/DataServiceWorker.js'

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

    // Add, remove Table Rows
    this.addAlertTableRow = this.addAlertTableRow.bind(this);
    this.removeAlertTableRow = this.removeAlertTableRow.bind(this);
    this.addToPortfolio = this.addToPortfolio.bind(this);

    this.setAlertTableRowBool = this.setAlertTableRowBool.bind(this);
    this.getAlertTableRowBool = this.getAlertTableRowBool.bind(this);
    this.setRemoveAlertTableRowBool = this.setRemoveAlertTableRowBool.bind(this);
    this.getRemoveAlertTableRowBool = this.getRemoveAlertTableRowBool.bind(this);

    this.selectAlertTableRow = this.selectAlertTableRow.bind(this);
    this.selectStockTableRow = this.selectStockTableRow.bind(this);

    this.setEnd = this.setEnd.bind(this);
    this.setStart = this.setStart.bind(this);
    this.setRemoveAlertTableRowBool = this.setRemoveAlertTableRowBool.bind(this);

    this.getCache = this.getCache.bind(this);


    this.triggerAnimation = this.triggerAnimation.bind(this);
    this.keyExists = this.keyExists.bind(this);
    this.addToNotificationsMenu = this.addToNotificationsMenu.bind(this);
    this.hubConnection = null;
    //this.startHubConnection = this.startHubConnection.bind(this);
    //this.createHubConnection = this.createHubConnection.bind(this);
    this.setCache = this.setCache.bind(this);
    this.updateCache = this.updateCache.bind(this);
    this.setUpdateNotifications = this.setUpdateNotifications.bind(this);
    this.connectionTimeout = this.connectionTimeout.bind(this);
    this.hubConnection_ = this.hubConnection_.bind(this);
    this.addToCache = this.addToCache.bind(this);

    //this.updateAll = this.updateAll.bind(this);

    this.cache = new cache();
    this.called = false;
    this.alertTable = [];
    this.textInput = React.createRef();
  
    this.map = new HashMap();
    this.stockDashBoardMap = new HashMap();

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:44362/stock')
      .configureLogging(signalR.LogLevel.Information)
      .build();

   // this.updateCache = false;
    this.lock = false;
    this.connected = false;
    this.keyCount = 0;

    this.state = {
      stockTableTwo: [],
      isStreaming: false,
      lock: false,
      hubConnection: null,
      request_Calls: -1,
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
      clickedAlertTableRowID: 0,
      target: 0,
      maxNumberOfAlertTableRows: 0,

      updateNotifications: false,
      start: 0,
      end: 50,

      _updateCache: false,
      cache: new cache(),

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
    /*  this.intervalID = setInterval(() => {
       let state = [-1, 2];
       var cache_ = new cache();
       var count;
       for (count = 0; count < 897; count++) {
         let start2 = parseInt(Math.floor(Math.random() * state.length));
         let changeArr = [state[start2], state[start2], state[start2],
         state[start2], state[start2], state[start2]];
 
         const item = {
           StockCode: count,
           Change: 91,
           ChangeP: 1,
           Volume: 11,
           CurrentPrice: 102,
           ProfitLoss: 1,
           ProfitLoss_Percentage: 99,
           High: 10,
           Low: 14,
           Open: 76,
           Close: 10,
 
           ChangeArray: changeArr,
           /*  DateTime time = DateTime.Today.Add(service.ReturnTime());
             string _currentTime = time.ToString("HH:mmttss");
           //stock.timestamp = _currentTime
           Request_Calls: 5,
           TimeStamp: "9:00",
 
           Request_Calls: "1"
         }
         //cache_.set(count.toString(), item);
         TableCache.set(count, item);
         AlertCache.set(count, item);
 
         console.log(' count ' + TableCache.get(count));
       }
 
   //    this.cache = cache_;
 
       //this.setState({ cache: cache_ })
       this.setState({ updateCache: true });
       this.setState({ lock: true });
    
    //   this.forceUpdate()
     }, 5000); */


    // Override local prices
    // this.overrideLocalPrices(this.props.state.globalStartPrice, this.props.state.globalTargetPrice);



    
    



    this.hubConnection_(); // iF FALSE 404 PAGE


    // Data Service Worker

    // this.addToNotificationsMenu();
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  // Replace with event listener
  componentDidUpdate = (prevProps, prevState, snapshot) => {
    var t = [];
    if (this.state.lock === true && this.called === false) {

      t.push(<StockTableTwo
        {...this}
        alertInterval={this.props.state.alertInterval}
        endTime={this.props.state.endTime}
        cache={this.getCache()}
       
      />)

      this.setState({ stockTableTwo: t });
      this.called = true;
      t = [];
      this.setState({ lock: false })
    }

    // Update only if on manual mode and the user has scrolled down
    if (this.state.updateNotifications) { // || this.state.setManualNotifications
      // clearInterval(this.notificationsInterval)
      // this.addToNotificationsMenu(); 
      this.setState({ updateNotifications: false });
    }

    /*
        if (this.props.state.setNotifications && this.props.state.notificationsEnabled === 0) {
          clearInterval(this.interval)
        }
        else if (this.props.state.setNotifications && this.props.state.notificationsEnabled === 1) {
          this.addToNotificationsMenu()
        }*/
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.lock !== nextState.lock) {

      return true;
    }
    else if (this.state.addAlertTableRowBool !== nextState.addAlertTableRowBool
      || this.state.removeAlertTableRowBool !== nextState.removeAlertTableRow
      || this.state.end !== nextState.end) {
      //   || nextProps.state.setNotifications !== this.props.state.setNotifications)
      return true;
    }
    return false;
  }


  updateCache(bool) {
    this.setState({updateCache: bool});
  }

  // Update Notifications Setter
  setUpdateNotifications(bool) {
    this.setState({ updateNotifications: bool });
  }

  // Start variable Setter
  setStart(bool) {
    this.setState({ start: bool });
  }

  // End variable Setter
  setEnd(bool) {
    this.setState({ end: bool });
  }

  // Add Notifications to notifications menu
  addToNotificationsMenu() {
    const defaultInterval = 60000;
    const clickedAlertTableRowID = this.state.clickedAlertTableRowID;

    // Clear Interval only on manual mode
    this.notificationsInterval = setInterval(() => {
      let pointer = 0;//this.state.start;
      const end = 897;//this.state.end;

      this.notificationsDelayInterval = setInterval(() => {
        const stock = this.stockDashBoardMap.get(pointer).StockCode;
        const localStartPrice = this.stockDashBoardMap.get(pointer).LocalStartPrice;
        const localTargetPrice = this.stockDashBoardMap.get(pointer).LocalTargetPrice;
        const currentPrice_state = parseInt(this.cache.get(pointer.toString()).ChangeArray[0]);
        const currentPrice = parseInt(this.cache.get(pointer.toString()).CurrentPrice);
        const previousPrice = parseInt(this.cache.get(pointer.toString()).CurrentPrice)
          - parseInt(this.cache.get(pointer.toString()).Change);

        this.props.notifications(stock, previousPrice, currentPrice,
          localStartPrice, localTargetPrice, currentPrice_state);

        if (pointer++ >= end) {
          clearInterval(this.notificationsInterval)
        }
      }, 1750);
    }, (!this.props.state.manualAlert) ? defaultInterval : this.props.state.alertInterval);
  }

  // ID Setter
  selectStockTableRow(e) {
    const alertTableId = parseInt(e.target.id);
    this.setState({ clickedAlertTableRowID: alertTableId });
  }

  // Select Row Setter
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
    let target = parseInt(this.state.clickedAlertTableRowID);

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

  addToPortfolio()
  {

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
  }

  setCache(cache_) {
    let cache = this.state.cache;
    cache = cache_;
    this.setState({ cache: cache })
  }

  getCache() {
    return this.state.cache;
  }

  async connectionTimeout() {
    var count = 0;

    return new Promise(resolve => {
      this.interval = setInterval(() => {
        // Number of retries allowed: 3
        if (this.connected == true) {
          clearInterval(this.interval)
          resolve(true)
        }
        else if (count >= 3) {
          clearInterval(this.interval)
          resolve(false)
        }
        count++;
      }, 8000);
    });
  }

  async addToCache() {
    var count = 0;

    return new Promise(resolve => {
    });
  }


  // this.hubConnection.invoke() timeout 60 * 5, must reach 897 by 5 minutes or return error
  // Max wait per value 60 seconds
  /** Establish a Signal R connection */
  async hubConnection_() {
    var count = 0;

    await this.hubConnection
      .start()
      .then(() => {
        console.log('Successfully connected');
        this.hubConnection.on('lockStream', function (request_Calls) {
          // Add Timeout
          this.request_Calls = request_Calls;
        })
        this.hubConnection.on('requestData', (key, data) => {
            let item = JSON.parse(data);
           TableCache.set(key, item);
           AlertCache.set(key, item);


          //  console.log(key + "  " + AlertCache.get(key) + "  " + TableCache.get(key));
          if (count < 897) {
            count += 1;
            // count - key !== 1 --> 404 reconnect the whole thing
          }
          else {

            count = 0;
            console.log("Ok")
            this.connected = true;
          }
        })
      }) // Bind to constructor
      .catch(err => {
        console.log('Error while establishing hubConnection :( ')
        this.connected = false;
      }); // Redirect to 404 page


    const res = await this.connectionTimeout();

    console.log('res  ' + this.connected);
    this.setState({ updateCache: res });
    this.setState({ lock: res });
  }

  sendRequest(hubConnection) {
    var cache_ = new cache();
    // Change so that we don't have to call requests using string
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
        {/* Stock Dashboard */}
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
          <h2 style={{ position: 'relative', left: '150px', color: 'white' }}>Previous: 286.5</h2>
          <h2 style={{ position: 'relative', top: '-55.5px', left: '600px', color: 'white' }}>Price: 299.5</h2>
       
       
       {/*   <h4 style={{ position: 'relative', top: '38px', left: '5px', color: 'white' }}>Start Price:  </h4>

          <NumberInput
             ref={this.startPriceRef}
            style={{ position: 'relative', top: '0px', left: '150px' }}
            size="md" maxW={70} maxH={10} defaultValue={15} min={10} max={20}>
            <NumberInputField />
            <NumberInputStepper >
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>


          <h4 style={{ position: 'relative', top: '38px', left: '5px', color: 'white' }}>Target Price:  </h4>

          <NumberInput
            // ref={this.targetPriceRef}
            style={{ position: 'relative', top: '0px', left: '150px' }}
            size="md" maxW={70} defaultValue={15} min={10} max={20}>
            <NumberInputField />
            <NumberInputStepper >
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
    </NumberInput> */}

          <Button onClick={this.addAlertTableRow}
            style={{ position: 'absolute', bottom: '20px', right: '180px', width: '90px' }}>
            Add <br/>to Table</Button>

          <Button onClick={this.removeAlertTableRow}
            style={{ position: 'absolute', bottom: '20px', right: '50px', width: '90px' }}>
            Remove  <br/> from Table</Button>

          <Button onClick={this.addToPortfolio}
            style={{ position: 'absolute', bottom: '20px', left: '40px', width: '90px' }}>
            Add  <br/> to Portfolio</Button>
        </Box>

        {/* <SideBar isStreaming={() => { return this.state.isStreaming }}/>  */}

        <TopNavbar
          Data={this.state.data}
        />

        {/* ALERT TABLE */}
        <NotificationsTable {...this} />

        <div id="tableContainer">
          {this.state.stockTableTwo}
        </div>

      </div>
    );
  }
}

{/*   <Button id="GreenArrow" style={{
            position: 'absolute', top: '60px', right: '180px'
            , visibility: (!this.state.red && this.state.green
              && this.state.priceChangeUp) ? "visible" : "hidden"
          }} colorScheme="blue" />

          <Button id="RedArrow" style={{
            position: 'absolute', top: '60px', right: '90px',
            visibility: (this.state.red && !this.state.green
              && !priceChangeUp) ? "visible" : "hidden"
          }} colorScheme="blue" />*/


  /*
     //.stream("RequestData", this.state.request_Calls)
     this.hubConnection.subscribe({
          next: (stockArray) => {
            // cache_.clear();
            console.log('State ' + stockArray)
  
            /* // Account for faliures in connection
             var count = 0;
             for (count = 0; count < stockArray.length; count++) {
               const item = JSON.parse(stockArray[count]);
               this.setState({ request_Calls: item.Request_Calls });
     
               cache_.set(count.toString(), item);
     
               TableCache.set(count, item);
               AlertCache.set(count, item);
               // console.log('State 1 ' + item.ChangeArray[0] )
             }
     
     
             this.setCache(cache_);
             this.cache = cache_;
             this.setState({ cache: cache_ })
             this.setState({ updateCache: true });
             this.setState({ lock: true });
     
             /*
             if (this.state.request_Calls !== this.state.MAX_CALLS) {
               this.setState({ request_Calls: request_Calls });
               // Start a countdown timer and disconnect if we don't get a response
             }
     
             else {
               this.setState({ lock: false });
               this.setState({ request_Calls: -1 });
             }*         
          },
  
          complete: () => {
            // render table
            console.log('End of DAY CALLS');
          },
          error: (err) => {
            console.log('err ' + err);
          }
        });*/







}