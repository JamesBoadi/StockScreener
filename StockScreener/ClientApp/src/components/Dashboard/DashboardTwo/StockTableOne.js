import React, { Component, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { render } from 'react-dom';

import {
    Box
} from '@chakra-ui/react';
import { Menu, Dropdown, Button, Space } from 'antd';
import throttle from 'lodash.throttle';
import * as HashMap from 'hashmap';
import * as cache from 'cache-base';

import DashboardTwoCache from './js/DashboardTwoCache.js';
import AlertSettings from './js/AlertSettings.js';
import HistoryCalc from '../Historical/js/HistoryCalc.js';
import { DisplayStock } from '../../Dashboard/DisplayStock.js';


// Fetch data for dash board one
export class StockTableOne extends React.Component {
    constructor(props) {
        super(props);

        this.selectRecords = this.selectRecords.bind(this);
        this.scrollBy = this.scrollBy.bind(this);
        this.textInput = React.createRef();
        this.selectRow = this.selectRow.bind(this);
        this.createTable = this.createTable.bind(this);
        this.newTable = this.newTable.bind(this);
        this.getUnits = this.getUnits.bind(this);

        // Filter Stocks
        this.selectStockTableRow = this.selectStockTableRow.bind(this);
        this.overBoughtStocks = this.overBoughtStocks.bind(this);
        this.overSoldStocks = this.overSoldStocks.bind(this);
        this.highestGainers = this.highestGainers.bind(this);
        this.biggestLosers = this.biggestLosers.bind(this);
        this.trendingStocks = this.trendingStocks.bind(this);

        this.timeout = null;
        this.cache = null;
        this.initialiseSearch = false;
        this.styleMap = new HashMap();
        this.multiplier = 50;
        this.scrollEnd = 16; // Max rows to scroll to
        this.updateTableData = false;
        this.triggerAnimation = false;
        this.called = false;

        this.state = {
            green: false,
            red: false,
            priceChangeUp: false,
            validInput: false,
            display: [],
            stockRecord: 0,
            scroll: 1,
            query: {},
            queryRes: false,
            start: 0,
            maxScroll: 456,

            tb2: [],
            tb2_style: {},
            tb2_temp: [],
            tb2_scrollPosition: 0,
            tb2_updateTable: false,
            tb2_stack: [], // Render 100 elements per scroll
            tb2_cache: [],
            tb2_count: 1,
            tb2_numberOfClicks: [],

            isUpdating: false,
            isScrolled: true,
            scrollUp_: 0,
            scrollDown_: 0,

            updateStyleMap: true,
            isSelected: false,
            lock: false,
            target: 0,
            scrollUpdated: false,
            triggerAlertID: false,
            triggerAlertColor: "",
            disableScrolling: false,
            alertInterval: 30000,
            maximumAlertNotifications: 11,

            // Rows to add from stock table to alert table
            cachedRows: [],
            enableAlerts: false,
            cache: new cache(),
            animationsCache: new cache(),

            // Display Stock
            stockInfoName: [],
            stockInfoHeader: [],
            stockInfoPrevPrice: [],
            stockInfoCurrPrice: [],
            stockInfoCode: [],
            updateStockInfo: false,

            // Filter
            filterStocks: false,
            tempID: [],
            ID: [],
            updateTable: false,
            clearTable: false

        }
    }

    componentDidMount() {
        let id;
        for (id = 0; id < 897; id++) {
            this.styleMap.set(id, {});
        }
    }

    componentWillUnmount() {
        // Clear the interval right before component unmount

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const scroll = this.scrollBy();
        if (false) {

            console.log('IS THE LOCK SET 4');
            this.newTable()
            this.setState({ start: this.state.tb2_scrollPosition * 50 }, () => {
                this.updateTable(this.state.start)
                this.forceUpdate()
            });

            this.called = true;
            // this.props.updateCache(false);*/
        } else
            if (this.state.filterStocks) {
                this.setState({ ID: this.state.tempID });

                this.setState({ updateTable: true });
                this.setState({ filterStocks: false })
            }
        // Display Stock Info
        if (this.updateStockInfo) {
            this.setState({ stockInfoHeader: this.state.stockInfoName[0] });
            this.setState({ stockInfoPrevPrice: this.state.stockInfoName[1] });
            this.setState({ stockInfoCurrPrice: this.state.stockInfoName[2] });
            this.setState({ stockInfoCode: this.state.stockInfoName[3] });

            this.updateStockInfo = false;
        }
        // Highlight rowtable if selected
        else if (this.state.isSelected) {
            this.createTable();
            this.updateTable(0);
            this.setState({ isSelected: false });
        }
        if (this.state.updateTable) {
            this.createTable();
            this.updateTable();
            this.setState({ updateTable: false });
        }
        else if (this.state.clearTable) {
            this.setState({ tb2: [] });
            this.setState({ clearTable: false });
        }

    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.tb2_count !== this.state.tb2_count
            || this.state.filterStocks !== nextState.filterCache
            || this.state.updateTable !== nextState.updateTable
            || this.updateStockInfo
            || this.state.validInput || this.state.queryRes
            || this.state.isUpdating === false
            || this.state.isSelected !== nextState.isSelected
            || this.state.updateStyleMap !== nextState.updateStyleMap
        )
            return true;

        return false;
    }

    // Select Stocks from dropdown list
    selectRecords(e) {
        this.setState({ validInput: true });
        this.forceUpdate();

        var id = new Number(e.target.id);
        console.log("Selected Id " + id);
        this.setState({ stockRecord: id });

        const scroll = this.scrollBy();
        this.setState({
            tb2_scrollPosition: (this.state.tb2_scrollPosition <= 17) ? this.getUnits(scroll) : 17
        }, () => {
            this.newTable()
            this.setState({ start: this.state.tb2_scrollPosition * 50 })
            this.updateTable(this.state.start)
        });
    }

    // Calculate units to scroll to a specific position in the table
    getUnits(scroll) {
        const stockRecord = this.state.stockRecord;
        let rem = stockRecord % 50;
        let units = parseInt((stockRecord - rem) / 50);

        return units;
    }

    // Units to scroll by to find record in search stocks
    scrollBy() {
        const height = 790;
        const scroll = 33;

        const stockRecord = this.state.stockRecord;
        let heightUnits = (stockRecord / scroll);
        let count = height * heightUnits;

        return count;
    }


    /* Select row from the table
       Triggers re-rendering of table */
    selectRow(e) {
        var array = [];

        let style = {
            backgroundColor: ""
        };

        this.styleMap.set(this.state.target, style);

        var target = new Number(e.target.id);
        this.setState({ target: target });

        let id;
        let mod = 0;
        let endMod = 50;
        let end;
        const max = 17;
        let tb2_scrollPosition = this.state.tb2_scrollPosition;

        // Reset Scroll Position (Only done once)
        if (DashboardTwoCache.getResetScrollPosition()) {
            tb2_scrollPosition = 0;
            this.setState({ tb2_scrollPosition: 0 });
            DashboardTwoCache.setResetScrollPosition(false);
        }

        if (tb2_scrollPosition === 0)
            mod = 0;
        else if (tb2_scrollPosition === max) {
            endMod = 47;
            mod = 0;
        }
        else
            mod = 15;

        end = (tb2_scrollPosition * 50) + endMod;
        let start = 0;

        //....................................

        style = {
            backgroundColor: "rgb(21,100,111)"
        };

        this.styleMap.set(target, style);
        const ID = this.state.ID;

        for (id = start; id < ID.length; id++) {
            // Get values from cache this.state.tb2_stack
            const _id = ID[id];
            const list = DashboardTwoCache.get(_id);

            if (id == target) {

                array.push(
                    <tbody key={id} >
                        <tr style={this.styleMap.get(id)}>
                            <td id={id} onClick={this.selectRow}>{list.StockCode.toString()}</td>
                            <td id={id} onClick={this.selectRow}>{list.TimeStamp.toString()}</td>
                            <td id={id} onClick={this.selectRow}>{list.CurrentPrice.toString()} </td>
                            <td id={id} onClick={this.selectRow}>{list.High.toString()}</td>
                            <td id={id} onClick={this.selectRow}>{list.Low.toString()}</td>
                            <td id={id} onClick={this.selectRow}>{list.Change.toString()}</td>
                            <td id={id} onClick={this.selectRow}>{list.ChangeP.toString()}</td>
                            <td id={id} onClick={this.selectRow}>{list.Volume.toString()}</td>
                        </tr>
                    </tbody>)
            }

            else {
                array.push(
                    <tbody key={id} >
                        <tr style={this.styleMap.get(id)}>
                            <td id={id} onClick={this.selectRow}>{list.StockCode.toString()}</td>
                            <td id={id} onClick={this.selectRow}>{list.TimeStamp.toString()}</td>
                            <td id={id} onClick={this.selectRow}>{list.CurrentPrice.toString()} </td>
                            <td id={id} onClick={this.selectRow}>{list.High.toString()}</td>
                            <td id={id} onClick={this.selectRow}>{list.Low.toString()}</td>
                            <td id={id} onClick={this.selectRow}>{list.Change.toString()}</td>
                            <td id={id} onClick={this.selectRow}>{list.ChangeP.toString()}</td>
                            <td id={id} onClick={this.selectRow}>{list.Volume.toString()}</td>

                        </tr>
                    </tbody>)
            }
        }

        this.setState({ updateFilterCache: true });
        this.setState({ tb2_stack: array });
        this.setState({ isSelected: true });
    }

    newTable() {
        let id;
        let mod = 0;
        let endMod = 50;
        let end;
        const max = 17;
        let start = 0;

        var array = [];
        let style;


        console.log('  new   TABLE   ')

        for (id = start; id < end; id++) {
            if (id == this.state.target) {
                style = { color: "green", backgroundColor: "rgb(21,100,111)" };
            }
            else
                style = {};

            // Get values from cache
            let list = DashboardTwoCache.get(id);

            //  console.log( 'WORK WORK ' + id);
            array.push(
                <tbody key={id} style={this.styleMap.get(id)}>
                    <tr >
                        <td id={id} onClick={this.selectRow}>{list.StockCode.toString()}</td>
                        <td id={id} onClick={this.selectRow}>{list.TimeStamp.toString()}</td>
                        <td id={id} onClick={this.selectRow}>{list.CurrentPrice.toString()} </td>
                        <td id={id} onClick={this.selectRow}>{list.High.toString()}</td>
                        <td id={id} onClick={this.selectRow}>{list.Low.toString()}</td>
                        <td id={id} onClick={this.selectRow}>{list.Change.toString()}</td>
                        <td id={id} onClick={this.selectRow}>{list.ChangeP.toString()}</td>
                        <td id={id} onClick={this.selectRow}>{list.Volume.toString()}</td>

                    </tr>
                </tbody>);
        }
        this.setState({ updateFilterCache: true });
        this.setState({ tb2_stack: array });
    }


    updateTable(start) {
        let mod = 0;
        let endMod = 50;
        const max = 47;
        let tb2_scrollPosition = this.state.tb2_scrollPosition;

        // Reset Scroll Position (Only done once)
        if (DashboardTwoCache.getResetScrollPosition()) {
            tb2_scrollPosition = 0;
            this.setState({ tb2_scrollPosition: 0 });
            DashboardTwoCache.setResetScrollPosition(false);
        }

        if (tb2_scrollPosition === 0)
            mod = 0;
        else if (tb2_scrollPosition === max) {
            endMod = 47;
            mod = 0;
        }
        else
            mod = 15;

        // console.log('tb2 ' + tb2_scrollPosition);

        start = (start <= 15 || (start === undefined || start === null)) ? 0 : start - mod;
        const ID = this.state.ID;

        // Get values from cache
        let list = DashboardTwoCache.get(ID[0]);

        let t = <div>
            <div id="stack-wrapper">
                <div id="stack-scroll">
                    <table class="scannerTable" aria-labelledby="tabelLabel">
                        <thead>
                            <tr>
                                <th>{list.StockCode.toString()}</th>
                                <th>{list.TimeStamp.toString()}</th>
                                <th>{list.CurrentPrice.toString()}</th>
                                <th>{list.High.toString()}</th>
                                <th>{list.Low.toString()}</th>
                                <th>{list.Change.toString()}</th>
                                <th>{list.ChangeP.toString()}</th>
                                <th>{list.Volume.toString()}</th>
                            </tr>
                        </thead>
                        {this.state.tb2_stack}
                    </table>
                </div>
            </div>
        </div>;

        this.setState({ tb2: t });
        this.setState({ updateTable: true });
    }

    createTable() {
        var table = [];
        let id;
        const end = 100;
        const ID = this.state.ID;
        for (id = 0; id < ID.length; id++) {
            const _id = ID[id];

            // Get values from cache
            let list = DashboardTwoCache.get(_id);
            this.state.tb2_stack.push(
                <tbody key={id} style={this.styleMap.get(id)}>
                    <tr>
                        <td id={id} onClick={this.selectRow}>{list.StockCode.toString()}</td>
                        <td id={id} onClick={this.selectRow}>{list.TimeStamp.toString()}</td>
                        <td id={id} onClick={this.selectRow}>{list.CurrentPrice.toString()} </td>
                        <td id={id} onClick={this.selectRow}>{list.High.toString()}</td>
                        <td id={id} onClick={this.selectRow}>{list.Low.toString()}</td>
                        <td id={id} onClick={this.selectRow}>{list.Change.toString()}</td>
                        <td id={id} onClick={this.selectRow}>{list.ChangeP.toString()}</td>
                        <td id={id} onClick={this.selectRow}>{list.Volume.toString()}</td>

                    </tr>
                </tbody>)
        }

        this.setState({ updateTable: true });
    }


    // **************************************************

    // **************************************************
    // Display Stocks
    // **************************************************

    // Triggered when a table row is clicked
    selectStockTableRow(e) {
        const alertTableId = parseInt(e.target.id);
        console.log('Clicked ' + alertTableId)

        var info = [];

        info.push(<h1 style={{ position: 'absolute', textAlign: 'center', left: '270px', color: 'white' }}>
            {DashboardTwoCache.get(alertTableId).StockName}</h1>);

        info.push(<h2 style={{ position: 'absolute', textAlign: 'center', top: '75px', left: '270px', color: 'white' }}>
            Previous: {DashboardTwoCache.getPreviousPrice(alertTableId)}</h2>);

        info.push(<h2 style={{ position: 'absolute', textAlign: 'center', top: '120px', left: '270px', color: 'white' }}>
            Price: {DashboardTwoCache.get(alertTableId).CurrentPrice}</h2>);

        info.push(<h1 style={{ position: 'absolute', textAlign: 'center', left: '0px', color: 'white' }}>
            {DashboardTwoCache.get(alertTableId).StockCode}</h1>);

        this.setState({ stockInfoName: info });

        this.setState({ clickedAlertTableRowID: alertTableId });
        this.updateStockInfo = true;
    }

    // **************************************************

    // **************************************************
    // Filter Stocks
    // **************************************************

    overBoughtStocks() {
        let rsiArray = [];
        let tempID = [];
        let id = [];

        // Replace with two pointers
        for (let index = 0; index < 897; index++) {
            HistoryCalc.setID(index);
            const item = HistoryCalc.getJSON();
            rsiArray[index] = new Number(item.RSI);
            tempID[index] = parseInt(index);
        }

        for (let i = 0; i < 897; i++) {
            for (let j = 0; j < 897; j++) {
                if (rsiArray[j] > rsiArray[j + 1]) {
                    let tmp = rsiArray[j];
                    rsiArray[j] = rsiArray[j + 1];
                    rsiArray[j + 1] = tmp;
                }
            }
        }

        let pointer = 0;

        for (let index = 0; index < 897; index++) {
            if (pointer >= 100)
                break;

            const rsi = rsiArray[index];
            if (rsi >= 70) {
                id[pointer++] = tempID[index]; // Save id
            }
        }

        for (let index = 0; index < id.length; index++) {
            console.log(' id ' + id[index]);
        }

        this.setState({ tb2_stack: [] });

        if (id.length === 0) {

            this.setState({ tempID: [] });
            this.setState({ clearTable: true });
        }
        else {
            this.setState({ tempID: id });
            this.setState({ filterStocks: true });
        }
    }

    overSoldStocks() {
        let rsiArray = [];
        let tempID = [];
        let id = [];

        // Replace with two pointers
        for (let index = 0; index < 897; index++) {
            HistoryCalc.setID(index);
            const item = HistoryCalc.getJSON();
            rsiArray[index] = new Number(item.RSI);
            tempID[index] = parseInt(index);
        }

        for (let i = 0; i < 897; i++) {
            for (let j = 0; j < 897; j++) {
                if (rsiArray[j] > rsiArray[j + 1]) {
                    let tmp = rsiArray[j];
                    rsiArray[j] = rsiArray[j + 1];
                    rsiArray[j + 1] = tmp;
                }
            }
        }

        let pointer = 0;

        for (let index = 0; index < 897; index++) {
            if (pointer >= 100)
                break;

            const rsi = rsiArray[index];
            if (rsi <= 30) {
                id[pointer++] = tempID[index]; // Save id
            }
        }

        for (let index = 0; index < id.length; index++) {
            console.log(' id ' + id[index]);
        }

        this.setState({ tb2_stack: [] });
        if (id.length === 0) {

            this.setState({ tempID: [] });
            this.setState({ clearTable: true });
        }
        else {
            this.setState({ tempID: id });
            this.setState({ filterStocks: true });
        }
    }

    highestGainers() {
        let gainers = [];
        let tempID = [];
        let id = [];

        // Replace with two pointers
        for (let index = 0; index < 897; index++) {
            HistoryCalc.setID(index);
            const item = DashboardTwoCache.get(index);
            const price_diff = item.CurrentPrice - item.prevOpen;
            gainers[index] = price_diff;
            tempID[index] = index;
        }

        for (let i = 0; i < 897; i++) {
            for (let j = 0; j < 897; j++) {
                if (gainers[j] > gainers[j + 1]) {
                    let tmp = gainers[j];
                    gainers[j] = gainers[j + 1];
                    gainers[j + 1] = tmp;
                }
            }
        }

        let pointer = 0;

        for (let index = 0; index < 897; index++) {
            if (pointer >= 100)
                break;

            const price_diff = gainers[index];
            if (price_diff > 0) {
                id[pointer++] = tempID[index]; // Save id
            }
        }

        for (let index = 0; index < id.length; index++) {
            console.log(' id ' + id[index]);
        }

        this.setState({ tb2_stack: [] });
        if (id.length === 0) {

            this.setState({ tempID: [] });
            this.setState({ clearTable: true });
        }
        else {

            this.setState({ tempID: id });
            this.setState({ filterStocks: true });
        }
    }

    biggestLosers() {
        let gainers = [];
        let tempID = [];
        let id = [];

        // Replace with two pointers
        for (let index = 0; index < 897; index++) {
            HistoryCalc.setID(index);
            const item = DashboardTwoCache.get(index);
            const price_diff = item.CurrentPrice - item.prevOpen;
            gainers[index] = price_diff;
            tempID[index] = index;
        }

        for (let i = 0; i < 897; i++) {
            for (let j = 0; j < 897; j++) {
                if (gainers[j] > gainers[j + 1]) {
                    let tmp = gainers[j];
                    gainers[j] = gainers[j + 1];
                    gainers[j + 1] = tmp;
                }
            }
        }

        let pointer = 0;

        for (let index = 0; index < 897; index++) {
            if (pointer >= 100)
                break;

            const price_diff = gainers[index];
            if (price_diff < 0) {
                id[pointer++] = tempID[index]; // Save id
            }
        }

        for (let index = 0; index < id.length; index++) {
            console.log(' id ' + id[index]);
        }

        this.setState({ tb2_stack: [] });
        if (id.length === 0) {

            this.setState({ tempID: [] });
            this.setState({ clearTable: true });
        }
        else {

            this.setState({ tempID: id });
            this.setState({ filterStocks: true });
        }

    }

    trendingStocks() {
        let gainers = [];
        let tempID = [];
        let id = [];

        // Replace with two pointers
        for (let index = 0; index < 897; index++) {
            HistoryCalc.setID(index);
            const item = DashboardTwoCache.get(index);
            const price_diff = item.CurrentPrice - item.prevOpen;
            gainers[index] = price_diff;
            tempID[index] = index;
        }

        for (let i = 0; i < 897; i++) {
            for (let j = 0; j < 897; j++) {
                if (gainers[j] > gainers[j + 1]) {
                    let tmp = gainers[j];
                    gainers[j] = gainers[j + 1];
                    gainers[j + 1] = tmp;
                }
            }
        }

        let pointer = 0;

        for (let index = 0; index < 897; index++) {
            if (pointer >= 100)
                break;

            const price_diff = gainers[index];
            if (price_diff > 30) {
                id[pointer++] = tempID[index]; // Save id
            }
        }

        for (let index = 0; index < id.length; index++) {
            console.log(' id ' + id[index]);
        }

        this.setState({ tb2_stack: [] });

        if (id.length === 0) {
            this.setState({ tempID: [] });
            this.setState({ clearTable: true });
        }
        else {

            this.setState({ tempID: id });
            this.setState({ filterStocks: true });
        }
    }


    render() {
        const stockTableTwoHeader = <table class="stockTableTwoHeader" aria-labelledby="tabelLabel">
            <thead>
                <tr>
                    <th>Stock Name</th>
                    <th>Time</th>
                    <th>Price</th>
                    <th>High</th>

                    <th>Low</th>
                    <th>Change</th>
                    <th>ChangeP %</th>
                    <th>Volume</th>
                </tr>
            </thead>
        </table>;

        const menu = (
            <Menu>
                <Menu.Item>
                    <a onClick={this.overBoughtStocks}>
                        OverBought
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a onClick={this.overSoldStocks}>
                        OverSold
                    </a>
                </Menu.Item>
                <Menu.Item >
                    <a onClick={this.highestGainers}>
                        Highest Gainers (24 Hours)
                    </a>
                </Menu.Item>
                <Menu.Item >
                    <a onClick={this.biggestLosers} >
                        Biggest Losers (24 Hours)
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a onClick={this.trendingStocks}>
                        Trending Stocks
                    </a>
                </Menu.Item>
            </Menu>
        );

        return (
            <div>

                <DisplayStock {...this} />


                <div class="stockTableOneWrap">

                    {/* STOCK TABLE TWO */}
                    <Box
                        style={{ position: 'absolute', top: '405px', left: '1070px' }}
                        bg='rgb(30,30,30)'

                        boxShadow='sm'
                        textAlign='center'
                        height='35px'
                        width='60rem'
                        rounded="lg"
                        maxHeight='35px'
                        margin='auto'
                        zIndex='999'
                        color='white'>

                        {/* Filter Options */}
                        <div style={{ position: 'absolute', top: '-5px', right: '0px' }}>
                            <Dropdown overlay={menu} placement="bottomCenter">
                                <Button>Filter</Button>
                            </Dropdown>
                        </div>

                        {stockTableTwoHeader}

                        <Box
                            style={this.state.tb2_style}
                            position='absolute'
                            overflowY='initial'
                            top='35px'
                            ref={this.textInput}
                            onScroll={this.freezeScrollPosition}
                            overflowX='hidden'
                            bg='rgb(30,30,30)'
                            boxShadow='sm'
                            textAlign='center'
                            height='800px'
                            width='62rem'
                            maxHeight='800px'
                            rounded="lg"
                            color='white'
                            zIndex='-999'>
                            {this.state.tb2}
                        </Box>
                    </Box>
                </div>
            </div>
        );
    }

    /*  setInterval(() => {
             let i;
             for (i = 0; i < 897; i++) {
                 let list = this.props.state.cache.get(i.toString());
                 console.log("cache TWO " +
                     list.StockCode.toString() + " " +
                     list.High.toString() + " " +
                     list.CurrentPrice.toString() + " " +
                     list.Low.toString() + " " +
                     list.ProfitLoss.toString() + " " +
                     list.ProfitLoss_Percentage.toString() + " " +
                     list.Volume.toString()
                 )
             }
         }, 10000);*/


}