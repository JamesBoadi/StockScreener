import React, { Component } from 'react';
import { TopNavbar } from './TopNavbar.js';
import { SavedStockTable } from './DashboardOne/SavedStockTable';
import { DashboardSettings } from './DashboardSettings';
import { StockTableTwo } from './DashboardOne/StockTableTwo';
import { AlertReducer } from './DashboardOne/js/AlertReducer.js';
import TableCache from './DashboardOne/js/TableCache.js';
import SavedStockCache from './DashboardOne/js/SavedStockCache.js';
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

    this.initialiseAlertTable = this.initialiseAlertTable.bind(this);
    this.addFirstRows = this.addFirstRows.bind(this);
    this.saveHistoricalData = this.saveHistoricalData.bind(this);

    this.getJSON = this.getJSON.bind(this);

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
      alertTableStack: [], // remove later on (ambigious with notifications)
      clickedAlertTableRowID: null,
      target: 0,
      maxNumberOfAlertTableRows: 0,

      updateNotifications: false,
      start: 0,
      end: 50,

      // Display Stock
      stockInfoName: [],
      stockInfoHeader: [],
      stockInfoPrevPrice: [],
      stockInfoCurrPrice: [],
      stockInfoCode: [],
      updateStockInfo: false,
      alertMessagePopUp: "",
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
    }, 1000);
  }

  componentWillUnmount() {
  }

  // Replace with event listener
  componentDidUpdate = (prevProps, prevState, snapshot) => {
    var t = [];

    
    if (this.state.lock === true) {
      t.push(<StockTableTwo
        {...this}
        updateSettings={this.props.updateSettings} 
        alertInterval={this.props.state.alertInterval}
        endTime={this.props.state.endTime}
        cache={this.getCache()}
      />)

      this.addToNotificationsMenu();
      this.setState({ stockTableTwo: t });
      this.called = true;
      t = [];

      this.initialiseAlertTable(); // Populate Alert Table
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
    console.log('ALERT ID ' + alertTableId);

    this.setState({ target: alertTableId });
    this.setState({ addAlertTableRowBool: true });
  }

  triggerAnimation(param) {
    console.log('CALL ACK HELL ' + param)
  }

  resetTableID(id) {
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

          <Button onClick={this.addAlertTableRow}
            style={{ position: 'absolute', bottom: '20px', right: '180px', width: '90px' }}>
            Add <br />to Table</Button>

          <Button onClick={this.removeAlertTableRow}
            style={{ position: 'absolute', bottom: '20px', right: '50px', width: '90px' }}>
            Remove  <br /> from Table</Button>

          <Button onClick={this.addToHistorical}
            style={{ position: 'absolute', bottom: '20px', left: '40px', width: '90px' }}>
            Add  <br /> to Historical</Button>
        </Box>

        {/* <SideBar isStreaming={() => { return this.state.isStreaming }}/>  */}

        {/* ALERT TABLE */}
        <SavedStockTable {...this} />

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