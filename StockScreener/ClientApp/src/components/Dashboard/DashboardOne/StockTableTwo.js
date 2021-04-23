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
import { StockTableTwoAlert } from './StockTableTwoAlert';
import throttle from 'lodash.throttle';
import * as HashMap from 'hashmap';
import * as cache from 'cache-base';

import TableCache from './js/TableCache.js';
import AlertSettings from './js/AlertSettings.js';
import { DisplayStock } from '../../Dashboard/DisplayStock';

import { AlertContext } from './AlertContext';

// Fetch data for dash board one
export class StockTableTwo extends React.Component {
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
        this.setAlertInterval = this.setAlertInterval.bind(this);

        this.selectRow = this.selectRow.bind(this);
        this.createTable = this.createTable.bind(this);
        this.newTable = this.newTable.bind(this);
        this.getDisplay = this.getDisplay.bind(this);
        this.getUnits = this.getUnits.bind(this);

        this.setScrollUpdate = this.setScrollUpdate.bind(this);
        this.addToStyleMap = this.addToStyleMap.bind(this);
        this.disableScrolling = this.disableScrolling.bind(this);

        this.toggleAlert = this.toggleAlert.bind(this);

        this.initialiseNotifications = this.initialiseNotifications.bind(this);
        this.addFirstRows = this.addFirstRows.bind(this);

        this.timeout = null;
        this.cache = null;
        this.initialiseSearch = false;
        this.styleMap = new HashMap();
        this.multiplier = 50;
        this.scrollEnd = 16; // Max rows to scroll to

        this.updateTableData = false;
        this.triggerAnimation = false;

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

            toggleAlert: false
        }
    }

    componentDidMount() {
        let id;
        for (id = 0; id < 897; id++) {
            this.styleMap.set(id, {});
        }

        this.initialiseNotifications();

        this.setState({ scroll: this.scrollBy() })
    }

    componentWillUnmount() {
        // Clear the interval right before component unmount
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const scroll = this.scrollBy();
        if (this.props.state.updateCache) {
           // console.log('SJ ' + this.props.state.updateCache);
            this.setState({ cache: TableCache.cache() }); // Cannot access value immediately

            // Update table data (fix)
            if (this.updateTableData === false) {
                console.log('props ' + this.props.state.updateCache
                    + '   ' + this.updateTableData);

                this.createTable()
                this.updateTable(15)
                this.updateTableData = true;
                this.setState({ enableAlerts: true });
            }

            //this.updateCache(false);
        } else
            // Trigger if Hide Bullish/Bearish Stocks Enabled
            if (TableCache.getUpdateHideStocks()) {
                console.log('  ---->  ' + 'THESE ARE MAH STOCKS!');
                this.newTable()
                this.setState({ start: this.state.tb2_scrollPosition * 50 }, () => {
                    this.updateTable(this.state.start)
                });

                if (this.state.start === 0)
                    this.textInput.current.scrollTop = 10;
                else
                    this.textInput.current.scrollTop = 25;

                TableCache.setDisableScroll(false);
                TableCache.setDisableScroll(false);
                TableCache.setUpdateHideStocks(false);
            }
            else if (this.props.state.saveSettings) {
                this.setState({ toggleAlert: true });
                console.log('NEW SETTINGS?')
                this.props.toggleSettings(false);
            }

            // Highlight rowtable if selected
            else if (this.state.isSelected) {
                this.newTable()
                this.setState({ start: this.state.tb2_scrollPosition * 50 }, () => {
                    this.updateTable(this.state.start)
                    this.forceUpdate()
                });

                this.setState({ isSelected: false });
            }
            // Update if scrolled
            else if (prevState.tb2_count === 1) {
                this.newTable()
                this.setState({ start: this.state.tb2_scrollPosition * 50 }, () => {
                    this.updateTable(this.state.start)
                });

                // console.log('SCROLL ');

                if (this.state.start === 0)
                    this.textInput.current.scrollTop = 10;
                else
                    this.textInput.current.scrollTop = 25;


                this.resetTableID(null); // Reset id
                this.setState({ scrollUpdated: true });
                this.setState({ tb2_count: 0 });

            }
            // Search for a stock
            else if (this.state.validInput) {

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

                this.resetTableID(this.state.stockRecord); // Reset id
                this.setState({ validInput: false });
                this.setState({ queryRes: false });
            }
            // Animation
            else if (this.state.updateStyleMap) {
                if (AlertSettings.getAuto()) {
                    this.setState({
                        tb2_scrollPosition: (this.getUnits(scroll) <= 17) ? this.getUnits(scroll) : 17
                    }, () => {
                        this.newTable()
                        this.setState({ start: this.state.tb2_scrollPosition * 50 })
                        this.updateTable(this.state.start);
                    });

                    // Top half or Bottom Half
                    const stockRecord = this.state.stockRecord;
                    let rem = stockRecord % 50;
                    this.textInput.current.scrollTop = parseInt((rem * (795 / 50)) + 55);
                }
                else if (AlertSettings.getManual()) {
                    this.newTable()
                    this.updateTable(this.state.start);
                }

                this.setState({ updateStyleMap: false })
            }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (TableCache.getUpdateHideStocks() ||
            this.props.state.saveSettings !== nextProps.state.saveSettings) {
            return true;
        }
        else if (this.props.state.updateCache !== nextProps.state.updateCache) {
            return true;
        }
        else if (nextState.tb2_count !== this.state.tb2_count)
            return true;
        else if (this.state.validInput || this.state.queryRes
            || this.state.isUpdating === false
            || this.state.isSelected !== nextState.isSelected
            || this.state.updateStyleMap !== nextState.updateStyleMap
        )
            return true;
        return false;
    }

    toggleAlert(state) {
        this.setState({ toggleAlert: state })
    }

    resetTableID(id) {
        this.setState({ clickedAlertTableRowID: id });
    }

    // **************************************************
    // Initialise Notifications
    // **************************************************

    // Initialise alert rows from database
    async initialiseNotifications() {
        // Read notifications from database
        await fetch('getallnotifications')
            .then(response => response.json())
            .then(response =>
                this.addFirstRows(response)
            )
            .catch(error => {
                console.log("error " + error) // 404
                return;
            }
        );
    }

    addFirstRows(response) {
        for (var i = 0; i < response.length; i++) {
            const item = JSON.parse(response[i]);
            this.props.initialiseNotifications(item.Alert, item.Time);
        }
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
        /*   let units = parseFloat((((scroll / 800) / 2) % 1).toFixed(2));
           let integer = Math.trunc(((scroll / 800) / 2));
   
           console.log("units " + units + ' ' + " integer " + integer);
           // Get Integer part
           if (units < 0.4)
               units = integer;
           else if (units > 0.4 && units < 0.7)
               units = integer + 0.5;
           else
               units = integer + 1;
   
           return units;*/
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
        if (this.state.disableScrolling || TableCache.getDisableScroll())
            return 0;

        let units = (this.state.scroll);

        this.setState({
            maxScroll: (this.state.tb2_scrollPosition <= 1) ?
                458 : 800
        });

        return (units > this.state.maxScroll) ? 1 : (units <= 4) ? -1 : 0;
    }

    scrollPosition() {
        return (this.state.scroll);
    }

    // Re-render table while scrolling down or scrolling up
    scrollToPosition() {
        if (this.loadFromCache() === 1) {
            // Scroll Down
            this.setState({
                tb2_scrollPosition: (this.state.tb2_scrollPosition <= 17) ?
                    this.state.tb2_scrollPosition + 0.5 : 17
            });

            //    console.log('Scroll Down ' + this.state.tb2_scrollPosition)
            this.setState({ tb2_count: 1 });
            this.setState({ isUpdating: false });
        }
        else if (this.loadFromCache() === -1) {
            // Scroll Up
            this.setState({
                tb2_scrollPosition: (this.state.tb2_scrollPosition <= 1) ?
                    0 : this.state.tb2_scrollPosition - 0.5
            });

            //     console.log('Scroll Up')
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
        const priceDetection = (TableCache.getPriceDetection());
        const max = (priceDetection) ? TableCache.getMax() : 17;
        let tb2_scrollPosition = this.state.tb2_scrollPosition;

        // Reset Scroll Position (Only done once)
        if (priceDetection && TableCache.getResetScrollPosition()) {
            tb2_scrollPosition = 0;
            this.setState({ tb2_scrollPosition: 0 });
            TableCache.setResetScrollPosition(false);
        }

        if (tb2_scrollPosition === 0)
            mod = 0;
        else if (tb2_scrollPosition === max) {
            endMod = (priceDetection) ? TableCache.getEndMod() : 47;
            mod = 0;
        }
        else
            mod = 15;

        end = (tb2_scrollPosition * 50) + endMod;
        let start = (tb2_scrollPosition * 50) - mod;

        //....................................

        style = {
            backgroundColor: "rgb(21,100,111)"
        };

        this.styleMap.set(target, style);

        for (id = start; id < end; id++) {
            // Get values from cache this.state.tb2_stack
            let list = (!priceDetection) ? TableCache.get(id) :
                TableCache.getOp(id);

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

        this.setState({ tb2_stack: array });
        this.setState({ isSelected: true });

        // Send Information to Display Stock
        //this.props.selectStockTableRow(e);
    }

    newTable() {
        let id;
        let mod = 0;
        let endMod = 50;
        let end;
        const priceDetection = (TableCache.getPriceDetection());
        const max = (priceDetection) ? TableCache.getMax() : 17;
        let tb2_scrollPosition = this.state.tb2_scrollPosition;

        // Reset Scroll Position (Only done once)
        if (priceDetection && TableCache.getResetScrollPosition()) {
            tb2_scrollPosition = 0;
            this.setState({ tb2_scrollPosition: 0 });
            TableCache.setResetScrollPosition(false);
        }

        if (tb2_scrollPosition === 0)
            mod = 0;
        else if (tb2_scrollPosition === max) {
            endMod = (priceDetection) ? TableCache.getEndMod() : 47;
            mod = 0;
        }
        else
            mod = 15;

        end = (tb2_scrollPosition * 50) + endMod;
        let start = (tb2_scrollPosition * 50) - mod;

        var array = [];
        let style;

        // Use shallow compare
        for (id = start; id < end; id++) {
            if (id == this.state.target) {
                style = { color: "green", backgroundColor: "rgb(21,100,111)" };
            }
            else
                style = {};

            // Get values from cache
            let list = (!priceDetection) ? TableCache.get(id) :
                TableCache.getOp(id);//this.state.cache.get(id.toString());


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
        this.setState({ tb2_stack: array });
    }

    updateTable(start) {
        let mod = 0;
        let endMod = 50;
        const priceDetection = (TableCache.getPriceDetection());
        const max = (priceDetection) ? TableCache.getMax() : 17;
        let tb2_scrollPosition = this.state.tb2_scrollPosition;

        // Reset Scroll Position (Only done once)
        if (priceDetection && TableCache.getResetScrollPosition()) {
            tb2_scrollPosition = 0;
            this.setState({ tb2_scrollPosition: 0 });
            TableCache.setResetScrollPosition(false);
        }

        if (tb2_scrollPosition === 0)
            mod = 0;
        else if (tb2_scrollPosition === max) {
            endMod = (priceDetection) ? TableCache.getEndMod() : 47;
            mod = 0;
        }
        else
            mod = 15;

        // console.log('tb2 ' + tb2_scrollPosition);

        start = (start <= 15 || (start === undefined || start === null)) ? 0 : start - mod;

        // Set start and end variables for FetchData
        // this.props.setStart(start);
        //  this.props.setEnd(start + endMod);
        // this.props.setUpdateNotifications(true);

        // Get values from cache
        let list = (!priceDetection) ? TableCache.get(start) :
            TableCache.getOp(start);
        //this.props.cache.get(start.toString());

        let t = <div>
            <div id="stack-wrapper">
                <div id="stack-scroll">
                    <table class="stockTableTwo" aria-labelledby="tabelLabel">
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
    }

    /** styleMap : { color,  transition} */
    addToStyleMap(triggerAlertID, triggerAlertColor, time) {
        //console.log(triggerAlertID + ' change ' + triggerAlertColor + ' time ' + time)
        let bool = true;
        let style;
        let i = 0;
        // Loop animation and add to style map
        var loop = setInterval(() => {
            if (bool) {
                style = {
                    backgroundColor: triggerAlertColor.toString(),
                    transition: 'background-color '.concat(`${time}ms linear`),
                };
            }
            else {
                style = {
                    backgroundColor: 'rgb(30,30,30)',
                    transition: 'background-color '.concat(`${time}ms linear`),
                };
            }

            this.styleMap.set(triggerAlertID, style);

            this.newTable()
            this.setState({ start: this.state.tb2_scrollPosition * 50 })
            this.updateTable(this.state.start)
            this.setState({ updateStyleMap: true });

            bool = !bool;

            if (i++ >= 3)
                clearInterval(loop);

        }, 2000);

        //   this.setState({ updateStyleMap: true });
        this.setState({ stockRecord: triggerAlertID });
        this.setState({ triggerAlertID: triggerAlertID });
        this.setState({ triggerAlertColor: triggerAlertColor });
    }

    // Calculate interval and number of alert notifcations (Auto only)
    setAlertInterval() {
        const triggerAlert = this.props.state.triggerAlert;
        const alertInterval = this.props.state.alertInterval;
        const startTime = this.props.state.startTime;
        const endTime = this.props.state.endTime;

        // Calculate number of notiifications
        let startTime_hours = startTime[0];
        let startTime_minutes = startTime[1];

        let endTime_hours = endTime[0];
        let endTime_minutes = endTime[1];

        // Calculate total minutes
        if (startTime_hours == 0) {
            startTime_minutes += 60;
        }
        else {
            startTime_minutes += (1 + startTime_hours) * 60;
        }

        if (endTime_hours == 0) {
            endTime_minutes += 60;
        }
        else {
            endTime_minutes += (1 + endTime_hours) * 60;
        }

        const maxNotifications = Math.round((Math.abs(startTime_minutes - endTime_minutes) / alertInterval));

        if (maxNotifications < 1) {
            window.alert("Increase Interval time frame");
        }
        this.setState({ maximumAlertNotifications: maxNotifications })
        this.setState({ triggerAlert: triggerAlert })
        this.setState({ alertInterval: alertInterval })
    }

    createTable() {
        var table = [];
        let id;

        const priceDetection = (TableCache.getPriceDetection());
        const end = (!priceDetection) ? TableCache.getEnd() : 50;

        for (id = 0; id < end; id++) {
            // Get values from cache
            let list = TableCache.get(id); //this.state.cache.get(id.toString());

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
    }

    // **************************************************
    // Save Notifications
    // **************************************************

    async saveNotifications(notifications) {
        await fetch('savenotifications/{query?}'.concat(notifications))
            .then(response => response.status)
            .then(response => {
                if (!response.ok) {
                    // 404 
                    return false;
                }
                else return true;
            })
            .catch(error => {
                console.log("error " + error) // 404
                return false;
            }
            );

        return false;
    }

    // Add Notifications to notifications menu
    async addToNotificationsMenu() {
        const defaultInterval = 60000;
        const clickedAlertTableRowID = this.state.clickedAlertTableRowID

        let pointer = 0;//this.state.start;
        const end = 897;//this.state.end;

        // Add the database (last known pointer)
        this.notificationsDelayInterval = setInterval(() => {
            // const stock = this.stockDashBoardMap.get(pointer).StockCode;
            // const localStartPrice = this.stockDashBoardMap.get(pointer).LocalStartPrice;
            // const localTargetPrice = this.stockDashBoardMap.get(pointer).LocalTargetPrice;
            const stock = TableCache.get(pointer).StockCode;
            const currentPrice_state = parseInt(TableCache.get(pointer).ChangeArray[0]);

            if (currentPrice_state === 0) {
                pointer++;
            }

            const currentPrice = parseInt(TableCache.get(pointer).CurrentPrice);
            const previousPrice = parseInt(TableCache.getPreviousPrice(pointer));

            let obj = this.props.notifications(pointer, stock, previousPrice, currentPrice, currentPrice_state);
            this.saveNotifications(JSON.stringify(obj)) // Save to database

            if (pointer++ >= end) {
                pointer = 0; // Add the database (last known pointer)
            }
        }, 7000);
    }

    // **********************************************************


    render() {
        let stockTableTwoHeader = <table class="stockTableTwoHeader" aria-labelledby="tabelLabel">
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

        return (
            <div>

                {/* DISPLAY STOCK */}

                <DisplayStock {...this} />

                {/* STOCK TABLE TWO */}
                <Box
                    style={{ position: 'absolute', top: '520px', left: '60px' }}
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

                    <div style={{ position: 'absolute', top: '0px', left: '0px' }}>
                        <input class="disableScrolling" type="checkbox" onChange={this.disableScrolling} />
                        <label id="disableScrolling"> Disable Scrolling</label>
                    </div>

                    {/* Search Box */}
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


                {/* StockTableTwo Alert Table */}
                <StockTableTwoAlert
                    updateCache={this.props.state.updateCache}
                    updateSettings={this.props.updateSettings}
                    {...this} />

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