import React, { Component } from 'react';
import { TopNavbar } from './TopNavbar.js';
import { NotificationsTable } from './DashboardOne/NotificationsTable';
import { DashboardSettings } from './DashboardSettings';
import { StockTableTwo } from './DashboardOne/StockTableTwo';
import { AlertReducer } from './DashboardOne/js/AlertReducer.js';
import TableCache from './DashboardOne/js/TableCache.js';
import NotificationsCache from './DashboardOne/js/NotificationsCache.js';
import HistoryCalc from './Historical/js/HistoryCalc';
import AlertCache from './DashboardOne/js/AlertCache.js';
import AlertSettings from './DashboardOne/js/AlertSettings.js';
import PriceSettings from './DashboardOne/js/PriceSettings.js';
import DataServiceWorker from './DashboardOne/js/DataServiceWorker.js'

import {
  Box, NumberInput,
  NumberInputField, NumberInputStepper,
  NumberIncrementStepper, NumberDecrementStepper
} from '@chakra-ui/react';

import { Menu, Button } from 'antd';
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
    this.addToHistorical = this.addToHistorical.bind(this);

    this.setAlertTableRowBool = this.setAlertTableRowBool.bind(this);
    this.getAlertTableRowBool = this.getAlertTableRowBool.bind(this);
    this.setRemoveAlertTableRowBool = this.setRemoveAlertTableRowBool.bind(this);
    this.getRemoveAlertTableRowBool = this.getRemoveAlertTableRowBool.bind(this);

    this.selectAlertTableRow = this.selectAlertTableRow.bind(this);
    this.selectStockTableRow = this.selectStockTableRow.bind(this);
    this.resetTableID = this.resetTableID.bind(this);
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
    this.updateStockInfo = false;


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
      _updateCache: false,
      updateCache: false,

      addAlertTableRowBool: false,
      removeAlertTableRowBool: false,
      alertTableStocks: [],
      alertTableStack: [],
      clickedAlertTableRowID: null,
      target: 0,
      maxNumberOfAlertTableRows: 0,

      updateNotifications: false,
      start: 0,
      end: 50,

      stockInfoName: [],
      stockInfoHeader: [],
      stockInfoPrevPrice: [],
      stockInfoCurrPrice: [],
      stockInfoCode: [],

      updateStockInfo: false,

      cache: new cache(),

      collapsed: false,
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
    const connectionEstablished = localStorage.getItem('_connectionEstablished');
    this.intervalID = setInterval(() => {
      if (connectionEstablished && TableCache.getFill()) {
        console.log('ID ' + connectionEstablished)
        this.setState({ lock: true });
        this.setState({ updateCache: true });
        clearInterval(this.intervalID);
      }
    }, 3000);

  }

  componentWillUnmount() {

  }

  // Replace with event listener
  componentDidUpdate = (prevProps, prevState, snapshot) => {
    var t = [];

    // Display Stock Info
    if (this.updateStockInfo) {
      this.setState({ stockInfoHeader: this.state.stockInfoName[0] });
      this.setState({ stockInfoPrevPrice: this.state.stockInfoName[1] });
      this.setState({ stockInfoCurrPrice: this.state.stockInfoName[2] });
      this.setState({ stockInfoCode: this.state.stockInfoName[3] });

      this.updateStockInfo = false;
    }
    else if (this.state.lock === true) {
      t.push(<StockTableTwo
        {...this}
        alertInterval={this.props.state.alertInterval}
        endTime={this.props.state.endTime}
        cache={this.getCache()}
      />)

      this.addToNotificationsMenu();
      this.setState({ stockTableTwo: t });
      this.called = true;
      t = [];

      this.setState({ lock: false })
      this.forceUpdate();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {

    if (this.state.lock !== nextState.lock
      || this.updateStockInfo ||
      this.state.addAlertTableRowBool !== nextState.addAlertTableRowBool
      || this.state.removeAlertTableRowBool !== nextState.removeAlertTableRow
      || this.state.end !== nextState.end) {
      //   || nextProps.state.setNotifications !== this.props.state.setNotifications)
      return true;
    }

    return false;
  }

  updateCache(bool) {
    this.setState({ updateCache: bool });
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
        // const stock = this.stockDashBoardMap.get(pointer).StockCode;
        // const localStartPrice = this.stockDashBoardMap.get(pointer).LocalStartPrice;
        // const localTargetPrice = this.stockDashBoardMap.get(pointer).LocalTargetPrice;
        const stock = NotificationsCache.get(pointer).StockCode;
        const currentPrice_state = parseInt(NotificationsCache.get(pointer).ChangeArray[0]);
        const currentPrice = parseInt(NotificationsCache.get(pointer).CurrentPrice);
        const previousPrice = parseInt(NotificationsCache.getPreviousPrice(pointer));

        this.props.notifications(stock, previousPrice, currentPrice, currentPrice_state);

        if (pointer++ >= end) {
          clearInterval(this.notificationsInterval)
        }
      }, 7000);
    }, AlertSettings.getAlertInterval());
  }

  // Triggered when a table row is clicked
  selectStockTableRow(e) {
    const alertTableId = parseInt(e.target.id);
    console.log('Clicked ' + alertTableId)

    var info = [];

    info.push(<h1 style={{ position: 'absolute', textAlign: 'center', left: '270px', color: 'white' }}>
      {TableCache.get(alertTableId).StockName}</h1>);

    info.push(<h2 style={{ position: 'absolute', textAlign: 'center', top: '75px', left: '270px', color: 'white' }}>
      Previous: {TableCache.getPreviousPrice(alertTableId)}</h2>);

    info.push(<h2 style={{ position: 'absolute', textAlign: 'center', top: '120px', left: '270px', color: 'white' }}>
      Price: {TableCache.get(alertTableId).CurrentPrice}</h2>);

    info.push(<h1 style={{ position: 'absolute', textAlign: 'center', left: '0px', color: 'white' }}>
      {TableCache.get(alertTableId).StockCode}</h1>);

    this.setState({ stockInfoName: info });

    this.setState({ clickedAlertTableRowID: alertTableId });
    this.updateStockInfo = true;
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

  // Add a Row to Notifications table
  async addAlertTableRow(e) {
    var t = this.state.alertTableStack;
    var alertTableStocks = this.state.alertTableStocks;
    let target = parseInt(this.state.clickedAlertTableRowID);

    const exists = await this.keyExists(e, target);
    const maxRows = 45;

    if (exists || this.state.maxNumberOfAlertTableRows >= maxRows || 
      isNaN(target) || (target === null || target === undefined))
      return;
    // Read from Database

    // Stocks to be displayed in the Notifications table
    alertTableStocks.push(TableCache.get(target))
    let pointer = alertTableStocks.length - 1;

    t.push(
      <tbody>
        <tr key={pointer} >
          <td id={pointer} onClick={this.selectAlertTableRow}>{alertTableStocks[pointer].StockCode.toString()}</td>
          <td id={pointer} onClick={this.selectAlertTableRow}>{alertTableStocks[pointer].TimeStamp.toString()}</td>
          <td id={pointer} onClick={this.selectAlertTableRow}>{alertTableStocks[pointer].CurrentPrice.toString()} </td>
          <td id={pointer} onClick={this.selectAlertTableRow}>{alertTableStocks[pointer].ChangeP.toString()}</td>
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

  // Are you sure you want to remove this stock?
  removeAlertTableRow() {
    let target = parseInt(this.state.target);

    if (this.state.maxNumberOfAlertTableRows < 1 
      || isNaN(target) || (target === null || target === undefined))
      return;

    let pointer;
    let start = 0;
    let end = this.state.alertTableStocks.length - 1;
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

  // Add to History Table
  addToHistorical() {
    let target = parseInt(this.state.clickedAlertTableRowID);
    console.log('target '+ target);
    let txt;
    if (isNaN(target) || (target === null || target === undefined) ) {
      window.alert("No target is clicked ");
    }
    else
    {
      var r = window.confirm("Add to Historical Table?");
      if (r == true) {
        txt = "Yes";
      } else {
        txt = "Cancel";
      }

      if(txt === "Yes")
      {
        HistoryCalc.setUpdateHistoricalTable()
      }
    
    }
  }

  triggerAnimation(param) {
    console.log('CALL ACK HELL ' + param)
  }

  resetTableID(id)
  {
    this.setState({ clickedAlertTableRowID: id });
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
  }

  setCache(cache_) {
    let cache = this.state.cache;
    cache = cache_;
    this.setState({ cache: cache })
  }

  getCache() {
    return this.state.cache;
  }




  async addToCache() {
    var count = 0;
  }


  sendRequest(hubConnection) {
    var cache_ = new cache();
    // Change so that we don't have to call requests using string
  }

  onNotifReceived(res) {
    console.info('Yayyyyy, I just received a notification!!!', res);
  }

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

          {this.state.stockInfoCode}
          {this.state.stockInfoHeader}
          {this.state.stockInfoPrevPrice}
          {this.state.stockInfoCurrPrice}




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
            Add <br />to Table</Button>

          <Button onClick={this.removeAlertTableRow}
            style={{ position: 'absolute', bottom: '20px', right: '50px', width: '90px' }}>
            Remove  <br /> from Table</Button>

          <Button onClick={this.addToHistorical}
            style={{ position: 'absolute', bottom: '20px', left: '40px', width: '90px' }}>
            Add  <br /> to Portfolio</Button>
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