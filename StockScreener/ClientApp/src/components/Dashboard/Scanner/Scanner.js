import React, { Component, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { render } from 'react-dom';
import {
    Box, Button, NumberInput,
    NumberInputField, NumberInputStepper,
    NumberIncrementStepper, NumberDecrementStepper,
    Input, InputGroup, InputRightElement, InputLeftElement,
    Menu, MenuButton, MenuList, MenuItem, MenuItemOption,
    MenuGroup, MenuOptionGroup, MenuIcon, MenuCommand, MenuDivider
} from '@chakra-ui/react';

import throttle from 'lodash.throttle';
import * as HashMap from 'hashmap';
import * as cache from 'cache-base';
import { FilterTable } from './FilterTable';
import ScannerCache from './js/ScannerCache.js';
import HistoryCalc from './js/HistoryCalc';

// Fetch data for dash board one
export class Scanner extends React.Component {
    constructor(props) {
        super(props);
        this.searchDatabase = this.searchDatabase.bind(this);
        this.selectRecords = this.selectRecords.bind(this);
        this.searchRecords = this.searchRecords.bind(this);
        this.scrollBy = this.scrollBy.bind(this);
        this.scroll_ = this.scroll_.bind(this);
        this.textInput = React.createRef();
        this.loadFromCache = this.loadFromCache.bind(this);
        this.scrollPosition = this.scrollPosition.bind(this);
        this.scrollToPosition = throttle(this.scrollToPosition, 1000);// this.scrollToPosition.bind(this);
        this.freezeScrollPosition = this.freezeScrollPosition.bind(this);


        this.selectRow = this.selectRow.bind(this);
        this.createTable = this.createTable.bind(this);
        this.newTable = this.newTable.bind(this);
        this.getDisplay = this.getDisplay.bind(this);
        this.getUnits = this.getUnits.bind(this);

        this.setScrollUpdate = this.setScrollUpdate.bind(this);
        this.disableScrolling = this.disableScrolling.bind(this);

        this.setFilterCache = this.setFilterCache.bind(this);
        this.setMaxNumberOfPortfolioRows = this.setMaxNumberOfPortfolioRows.bind(this);
        this.setUpdateFilterCache = this.setUpdateFilterCache.bind(this);

        this.timeout = null;
        this.cache = null;
        this.initialiseSearch = false;
        this.styleMap = new HashMap();
        this.multiplier = 50;
        this.scrollEnd = 16; // Max rows to scroll to

        this.updateTableData = false;
        this.triggerAnimation = false;
        this.filterCache = new cache();



        this.init = this.init.bind(this);
        this.updateFilterCache = this.updateFilterCache.bind(this);
        this.updateVariables = this.updateVariables.bind(this);

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
            maxScroll: 2250,

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

            maxNumberOfPortfolioRows: 0,
            updateFilterTable: false,
            updateFilterCache: false,
            manualUpdateClicked: false, // utton,,

            filterCacheStart: 0,
            filterCacheEnd: 50
        }
    }

    componentDidMount() {
        let id;
        for (id = 0; id < 897; id++) {
            this.styleMap.set(id, {});
        }
        this.setState({ scroll: this.scrollBy() })


        this.init(0, 50);
    }

    componentWillUnmount() {
        // Clear the interval right before component unmount

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const scroll = this.scrollBy();
        // Highlight rowtable if selected
        if (this.state.updateFilterCache) {
            this.init(this.state.filterCacheStart, this.state.filterCacheEnd);
            this.setState({ updateFilterCache: false });
        }
        else if (this.state.isSelected) {
            this.init(this.state.filterCacheStart, this.state.filterCacheEnd);
            this.newTable()
            this.setState({ start: this.state.tb2_scrollPosition * 50 }, () => {
                this.updateTable(this.state.start)
                this.forceUpdate()
            });

            this.setState({ isSelected: false });
        }
        // Update if scrolled
        else if (prevState.tb2_count === 1) {
            this.init(this.state.filterCacheStart, this.state.filterCacheEnd);
            this.newTable();
            this.setState({ start: this.state.tb2_scrollPosition * 50 }, () => {
                this.updateTable(this.state.start)
            });

            if (this.state.start === 0)
                this.textInput.current.scrollTop = 10;
            else
                this.textInput.current.scrollTop = 25;

            this.setState({ scrollUpdated: true });
            this.setState({ tb2_count: 0 });
        }
        // Search for a stock
        else if (this.state.validInput) {
            this.init(this.state.filterCacheStart, this.state.filterCacheEnd);
            this.setState({
                tb2_scrollPosition: (this.state.tb2_scrollPosition <= 17) ? this.getUnits(scroll) : 17
            }, () => {
                this.newTable()
                this.setState({ start: this.state.tb2_scrollPosition * 50 })
                this.updateTable(this.state.start)
            });

            if (this.state.start === 0)
                this.textInput.current.scrollTop = 10;
            else
                this.textInput.current.scrollTop = 25;

            this.setState({ validInput: false });
            this.setState({ queryRes: false });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!nextProps.state.updateCache) {
            return false;
        }
        else {
            if (nextState.tb2_count !== this.state.tb2_count)
                return true;
            else if (
                this.state.validInput || this.state.queryRes
                || this.state.isUpdating === false
                || this.state.updateFilterCache !== nextState.updateFilterCache
                || this.state.isSelected !== nextState.isSelected
                || this.state.updateStyleMap !== nextState.updateStyleMap
            )
                return true;
        }

        return false;
    }

    // **************************************************
    // Set and Update Filter Cache
    // **************************************************

    setFilterCache(key, item) {
        this.filterCache.set(key.toString(), item);
        console.log('size ' + this.filterCache.get(key.toString()).RSI);
    }

    setMaxNumberOfPortfolioRows(start, end) {
        this.setState({ filterCacheStart: start });
        this.setState({ filterCacheEnd: end });

    }

    setUpdateFilterCache(update) {
        this.setState({ updateFilterCache: update });
    }


    init(_start, _end) {
        let start = _start;
        for (var count = start; count < _end; count++) {
            this.setFilterCache(count);
        }
        //console.log('Calling Update Filter Cache ');
    }

    setFilterCache(
        tableID) {
        // Update Data
        this.updateVariables(tableID);
    }

    // Utility for setting cache
    updateFilterCache(tableID, json) {
        this.filterCache.set(
            tableID.toString(),
            {
                signalMessage: json.signalMessage,
                signal: json.signal,
                firstMACD: json.firstMACD,
                secondMACD: json.secondMACD,
                upperBand: json.upperBand, middleBand: json.middleBand,
                lowerBand: json.lowerBand, SMA: json.SMA,
                RSI: json.RSI, Volume: json.Volume
            }
        );
    }

    // Update variables and set 
    updateVariables(tableID) {
        HistoryCalc.setID(tableID);
        // Set variables
        const json = HistoryCalc.getJSON();
        this.updateFilterCache(tableID, json);
    }

    // Set at the very beggining
    updateSettingsHashMap(
        tableID,
        bollingerBandsNo,
        deviations,
        firstMovingAverageDays,
        secondMovingAverageDays,
        smoothing,
        rsiWeight,
        Volume) {

        this.props.updateSettingsHashMap(tableID,
            bollingerBandsNo,
            deviations,
            firstMovingAverageDays,
            secondMovingAverageDays,
            smoothing,
            rsiWeight,
            Volume);
    }

    // **************************************************

    // Disable scrolling
    disableScrolling(e) {
        this.setState({ disableScrolling: e.target.checked })
    }

    setScrollUpdate(bool) {
        this.setState({ scrollUpdated: bool })
    }

    // Search box retrieves stocks from database
    async searchDatabase(e) {
        // e.preventDefault();
        let input = new String(e.target.value);

        if (input.length < 1) {
            this.setState({ queryRes: false });
            this.setState({ display: "No Stocks Found" });
        }

        // Buggy, fix nulls
        if (!(!input || /^\s*$/.test(input))) {
            await fetch('searchstock/'.concat(input))
                .then(response => response.text())
                .then(data =>
                    this.setState({ query: JSON.parse(data) }),
                    this.setState({ queryRes: true }),
                    this.searchRecords()
                ).catch(error =>
                    console.log("error " + error),
                    //setValidInput(false)
                );
        }
        else {
            this.setState({ validInput: false })
            this.setState({ display: "No Stocks Found" })
        }
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

    getDisplay() {
        return this.state.display;
    }

    // create searchable records from dropdown list
    searchRecords() {
        var string = [];
        let arr = this.state.query.stockCode;

        if (arr !== undefined) {
            let count;
            for (count = 0; count < arr.length; count++) {

                let splitStr = arr[count].toString().split(',');
                let id = new Number(splitStr[0]);
                let value = splitStr[1];

                string.push(
                    <div
                        id={id}
                        class="record"
                        onClick={this.selectRecords}>
                        {value}
                        <br />
                    </div>
                );
            }
        }
        else {
            string.push("No Stocks Found");
            this.setState({ validInput: false });
        }

        this.setState({ display: string });
    }

    async freezeScrollPosition(e) {
        this.setState({ scroll: this.textInput.current.scrollTop })
        const result = await this.scroll_(e);
        if (result == "resolved") {
            // Check the position
            let position = this.loadFromCache();

            if (position !== 0) {
                this.scrollToPosition()
            }
            else {
                // Prevent re-rendering
                this.setState({ isUpdating: true });
            }
        }
        else {
            // 404
        }
    }

    // Trigger scrolling event
    async scroll_(e) {
        e.persist();
        return new Promise(resolve => {
            setTimeout(() => {
                e.stopPropagation();
                resolve('resolved');
            }, 900);
        });
    }

    /*
        units: 1 - Scroll Down
        units: -1 Scroll Up
        units: 0 No change
    */
    loadFromCache() {
        if (this.state.disableScrolling || ScannerCache.getDisableScroll())
            return 0;

        let units = (this.state.scroll);

        this.setState({
            maxScroll: (this.state.tb2_scrollPosition <= 1) ?
                1100 : 2250
        });

        console.log('units ' + units);

        return (units > this.state.maxScroll) ? 1 : (units <= 4) ? -1 : 0;
    }

    scrollPosition() {
        return (this.state.scroll);
    }

    // Re-render table while scrolling down or scrolling up
    scrollToPosition() {
        let mod;
        let endMod = 0;
        let end;

        if (this.loadFromCache() === 1) {
            // Scroll Down
            const scrollDownPosition = (this.state.tb2_scrollPosition <= 17) ?
                this.state.tb2_scrollPosition + 0.5 : 17;
            this.setState({
                tb2_scrollPosition: scrollDownPosition
            });

            if (scrollDownPosition === 0)
                mod = 0;
            else if (scrollDownPosition === 17) {
                endMod = 47;
                mod = 0;
            }
            else
                mod = 15;

            end = (scrollDownPosition * 50) + endMod;
            let start = (scrollDownPosition * 50) - mod;


            this.init(start, end);
            this.setMaxNumberOfPortfolioRows(start, end);

            this.setState({ updateFilterCache: true });
            this.setState({ tb2_count: 1 });
            this.setState({ isUpdating: false });
        }
        else if (this.loadFromCache() === -1) {
            // Scroll Up
            const scrollUpPosition = (this.state.tb2_scrollPosition <= 1) ?
                0 : this.state.tb2_scrollPosition - 0.5;
            this.setState({
                tb2_scrollPosition: scrollUpPosition
            });

            if (scrollUpPosition === 0)
                mod = 0;
            else if (scrollUpPosition === 17) {
                endMod = 47;
                mod = 0;
            }
            else
                mod = 15;

            end = (scrollUpPosition * 50) + endMod;
            let start = (scrollUpPosition * 50) - mod;

            this.init(start, end);
            this.setMaxNumberOfPortfolioRows(start, end);

            this.setState({ updateFilterCache: true });
            this.setState({ tb2_count: 1 });
            this.setState({ isUpdating: false });
        }
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
        if (ScannerCache.getResetScrollPosition()) {
            tb2_scrollPosition = 0;
            this.setState({ tb2_scrollPosition: 0 });
            ScannerCache.setResetScrollPosition(false);
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
        let start = (tb2_scrollPosition * 50) - mod;
        this.init(start, end);
        this.setMaxNumberOfPortfolioRows(start, end);
        //....................................

        style = {
            backgroundColor: "rgb(21,100,111)"
        };

        this.styleMap.set(target, style);

        for (id = start; id < end; id++) {
            // Get values from cache this.state.tb2_stack
            const list = ScannerCache.get(id);
            const item = this.filterCache.get(id.toString());

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
                            <br/>
                            <td id={id} onClick={this.selectRow}>{item.signalMessage}</td>
                            <td id={id} onClick={this.selectRow}>{item.signal}</td>
                            <td id={id} onClick={this.selectRow}>{item.firstMACD}</td>
                            <td id={id} onClick={this.selectRow}>{item.secondMACD}</td>
                            <td id={id} onClick={this.selectRow}>{item.upperBand}</td>
                            <td id={id} onClick={this.selectRow} >{item.middleBand}</td>
                            <td id={id} onClick={this.selectRow}>{item.lowerBand}</td>
                            <td id={id} onClick={this.selectRow}>{item.SMA}</td>
                            <td id={id} onClick={this.selectRow}>{item.RSI}</td>
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
                            <br/>
                            <td id={id} onClick={this.selectRow}>{item.signalMessage}</td>
                            <td id={id} onClick={this.selectRow}>{item.signal}</td>
                            <td id={id} onClick={this.selectRow}>{item.firstMACD}</td>
                            <td id={id} onClick={this.selectRow}>{item.secondMACD}</td>
                            <td id={id} onClick={this.selectRow}>{item.upperBand}</td>
                            <td id={id} onClick={this.selectRow} >{item.middleBand}</td>
                            <td id={id} onClick={this.selectRow}>{item.lowerBand}</td>
                            <td id={id} onClick={this.selectRow}>{item.SMA}</td>
                            <td id={id} onClick={this.selectRow}>{item.RSI}</td>
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
        let tb2_scrollPosition = this.state.tb2_scrollPosition;

        // Reset Scroll Position (Only done once)
        if (ScannerCache.getResetScrollPosition()) {
            tb2_scrollPosition = 0;
            this.setState({ tb2_scrollPosition: 0 });
            ScannerCache.setResetScrollPosition(false);
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
        let start = (tb2_scrollPosition * 50) - mod;

        this.init(start, end);
        this.setMaxNumberOfPortfolioRows(start, end);

        var array = [];
        let style;

        for (id = start; id < end; id++) {
            if (id == this.state.target) {
                style = { color: "green", backgroundColor: "rgb(21,100,111)" };
            }
            else
                style = {};

            // Get values from cache
            let list = ScannerCache.get(id);
            const item = this.filterCache.get(id.toString());

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
                        <br/>
                        <td id={id} onClick={this.selectRow}>{item.signalMessage}</td>
                        <td id={id} onClick={this.selectRow}>{item.signal}</td>
                        <td id={id} onClick={this.selectRow}>{item.firstMACD}</td>
                        <td id={id} onClick={this.selectRow}>{item.secondMACD}</td>
                        <td id={id} onClick={this.selectRow}>{item.upperBand}</td>
                        <td id={id} onClick={this.selectRow} >{item.middleBand}</td>
                        <td id={id} onClick={this.selectRow}>{item.lowerBand}</td>
                        <td id={id} onClick={this.selectRow}>{item.SMA}</td>
                        <td id={id} onClick={this.selectRow}>{item.RSI}</td>
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
        if (ScannerCache.getResetScrollPosition()) {
            tb2_scrollPosition = 0;
            this.setState({ tb2_scrollPosition: 0 });
            ScannerCache.setResetScrollPosition(false);
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

        // Get values from cache
        let list = ScannerCache.get(start);
        const item = this.filterCache.get(start.toString());
        //this.props.cache.get(start.toString());

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

                                <br/>
                                <th >{item.signalMessage}</th>
                                <th >{item.signal}</th>
                                <th >{item.firstMACD}</th>
                                <th>{item.secondMACD}</th>
                                <th >{item.upperBand}</th>
                                <th >{item.middleBand}</th>
                                <th >{item.lowerBand}</th>
                                <th >{item.SMA}</th>
                                <th >{item.RSI}</th>
                            </tr>
                        </thead>
                        {this.state.tb2_stack}
                    </table>
                </div>
            </div>
        </div>;


        this.setState({ tb2: t });

    }

    createTable() {
        var table = [];
        let id;
        const end = 50;
        this.setMaxNumberOfPortfolioRows(0, 50);

        for (id = 0; id < end; id++) {
            // Get values from cache
            let list = ScannerCache.get(id); //this.state.cache.get(id.toString());
            const item = this.filterCache.get(id.toString());
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
                        <td id={id} onClick={this.selectRow}>{item.signalMessage}</td>
                        <td id={id} onClick={this.selectRow}>{item.signal}</td>
                        <td id={id} onClick={this.selectRow}>{item.firstMACD}</td>
                        <td id={id} onClick={this.selectRow}>{item.secondMACD}</td>
                        <td id={id} onClick={this.selectRow}>{item.upperBand}</td>
                        <td id={id} onClick={this.selectRow}>{item.middleBand}</td>
                        <td id={id} onClick={this.selectRow}>{item.lowerBand}</td>
                        <td id={id} onClick={this.selectRow}>{item.SMA}</td>
                        <td id={id} onClick={this.selectRow}>{item.RSI}</td>
                    </tr>
                </tbody>)
        }

        this.setState({ updateFilterCache: true });
    }

    render() {
        let stockTableTwoHeader = 
      
        <table class="scannerHeader" aria-labelledby="tabelLabel"
            style={{ position: 'absolute', width: '80rem' }}>
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
                    <br />
                    <th>Signal <br /> Message </th>
                    <th>Signal <br /> Line</th>
                    <th>First <br /> MACD</th>
                    <th>Second <br /> MACD</th>
                    <th>Upper <br /> Band</th>
                    <th>Middle <br /> Band</th>
                    <th>Lower <br />Band</th>
                    <th>SMA </th>
                    <th>RSI</th>

                </tr>
            </thead>
        </table>;
      

        return (
            <div>

                <h2 style={{ position: 'absolute', top: '70px', left: '60px', color: 'wheat' }}>Screener</h2>

                    {/* STOCK TABLE TWO */}
                    <Box
                        style={{ position: 'absolute', top: '140px', left: '60px' }}
                        bg='rgb(30,30,30)'                      
                        textAlign='center'
                        height='35px'
                        width='82rem'
                        rounded="lg"
                        maxHeight='35px'
                        margin='auto'
                        zIndex='999'
                        color='white'>

                        <div style={{ position: 'absolute', top: '0px', left: '0px' }}>
                            <input class="disableScrolling" type="checkbox" onChange={this.disableScrolling} />
                            <label id="disableScrolling"> Disable Scrolling</label>
                        </div>


                        {/* Search Box  fix posiiitining*/}
                        <div style={{ position: 'absolute', left: '1260px' }}>
                            <div class="stockTableTwoMenu">
                                <div class="dropdown">

                                    <InputGroup>
                                        <Input
                                            style={{
                                                position: 'absolute', top: '0px',
                                                right: '16.5px', height: '29px',
                                                minWidth: '12.25rem',
                                                width: '12.25rem',
                                                color: 'black'
                                            }}

                                            onInput={this.searchDatabase}
                                            placeholder="Search "
                                        />

                                        <InputRightElement children={<img id="searchIcon" />} />
                                    </InputGroup>

                                    {/* Drop down Menu */}
                                    <div class="dropdown-content">
                                        <Box
                                            min-width='12.25rem'
                                            width='12.25rem'
                                            height='8rem'
                                            overflowY='auto'
                                            bg='#f9f9f9'
                                            top='0px'
                                            backgroundColor='rgb(40,40,40)'>

                                            {this.getDisplay()}

                                        </Box>
                                    </div>
                                </div>
                            </div>
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
                            width='82rem'
                            maxHeight='800px'
                            rounded="lg"
                            color='white'
                            zIndex='-999'>
                               
                            {this.state.tb2}
                           
                        </Box>
                    </Box>
            </div>
        );
    }
}