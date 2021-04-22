import React, { Component } from 'react';
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
import SavedStockCache from './js/SavedStockCache.js';
import * as HashMap from 'hashmap';

/* Table for adding Alerts */
export class SavedStockTable extends Component {
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
        this.scrollToPosition = this.scrollToPosition.bind(this);
        this.newTable = this.newTable.bind(this);
        this.getDisplay = this.getDisplay.bind(this);
        this.removeRow = this.removeRow.bind(this);

        this.initialiseAlertTable = this.initialiseAlertTable.bind(this);
        this.addFirstRows = this.addFirstRows.bind(this);
        this.selectAlertTableRow = this.selectAlertTableRow.bind(this);
    
        //this.resetTableID = this.resetTableID.bind(this);

        let style = { color: "white;" };
        this.timeout = null;
        this.map = new HashMap();

        this.state = {
            green: false,
            red: false,
            priceChangeUp: false,
            validInput: false,
            display: [],
            stockRecord: 0,
            scroll: 0,
            query: {},
            start: 0,

            tb2: [],
            tb2_temp: [],
            tb2_scrollPosition: 0,
            tb2_updateTable: false,
            tb2_stack: [], // Render 100 elements per scroll
            tb2_cache: [],
            tb2_count: 0,
            tb2_numberOfClicks: [],

            // Alert Table States
            alertTableStack: [],
            alertTable: [],
            isScrolled: false,
            scrollUp_: 0,
            scrollDown_: 0,

            populateTable: false,
            target: null,


            addAlertTableRowBool: false,
            removeAlertTableRowBool: false,
            alertTableStocks: [],
            alertTableStack: [], // remove later on (ambigious with notifications)
            clickedAlertTableRowID: null,
            target: 0,
            maxNumberOfAlertTableRows: 0


        };
    }

    componentDidMount() {
        this.setState({ populateTable: true });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.populateTable) {
            this.initialiseAlertTable();
            this.setState({ populateTable: false });
        }

        if (this.state.addAlertTableRowBool) {
            //console.log('mounted  ' + this.state.alertTableStack.length);
            this.newTable();
            this.setState({ start: this.state.tb2_scrollPosition * 50 }, () => {
                this.updateTable(this.state.start);
            });

            this.setState({ addAlertTableRowBool: false });
        }
        if (this.props.state.removeAlertTableRowBool) {
            this.removeRow();
            this.setState({ start: this.state.tb2_scrollPosition * 50 }, () => {
                this.updateTable(this.state.start);
            });
            window.alert('This stock has been removed ');
            this.props.setRemoveAlertTableRowBool(false);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.addAlertTableRowBool !== nextState.addAlertTableRowBool) {
            return true;
        } else if (this.props.state.populateTable !== nextState.populateTable) {
            return true;
        }
        return false;
    }

    // **************************************************
    // Initialise Saved Stock Rows
    // **************************************************

    // Initialise alert rows from database
    async initialiseAlertTable() {
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
        var t = [];
        var alertTableStocks = this.state.alertTableStocks;

        for (var i = 0; i < response.length; i++) {
            const item = JSON.parse(response[i]);
            const pointer = parseInt(item.Id);
            console.log('pointer ' + pointer);


            t.push(item);
            alertTableStocks.push(item);
            this.map.set(i, pointer);
        }

        this.setState({ maxNumberOfAlertTableRows: response.length });
        this.setState({ alertTableStack: t });
        this.setState({ alertTableStocks: alertTableStocks });
        this.setState({ addAlertTableRowBool: true });
    }

    // **************************************************

    async searchDatabase(e) {
        e.preventDefault();
        let input = new String(e.target.value);

        if (input.length < 1) {
            this.setState({ display: "No Stocks Found" });
        }
        // Buggy, fix nulls
        if (!(!input || /^\s*$/.test(input))) {
            await fetch('test/'.concat(input))
                .then(response => response.text())
                .then(data =>
                    this.setState({ query: JSON.parse(data) }),
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

    getDisplay() {
        return this.state.display;
    }

    // select record from dropdown list
    selectRecords(e) {
        var id = new Number(e.target.id);
        this.setState({ stockRecord: id });
        this.setState({ validInput: true });
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

    // Units to scroll by to find record in search stocks
    scrollBy() {
        const height = 800;
        const scroll = 34;

        const stockRecord = this.state.stockRecord;

        let heightUnits = (stockRecord / scroll);

        let count = height * heightUnits;

        return count;
    }

    // Trigger scrolling event
    scroll_() {
        this.setState({ scroll: this.textInput.current.scrollTop })
        this.scrollToPosition()
    }

    /*
        units: 1 - Scroll Down
        units: -1 Scroll Up
        units: 0 No change
    */
    loadFromCache() {
        let units = (this.state.scroll);
        console.log("units " + units);
        return (units > 430) ? 1 : (units < 13 || units < 4) ? -1 : 0;
    }

    scrollPosition() {
        return (this.state.scroll);
    }

    // Re-render table while scrolling down or scrolling up
    scrollToPosition() {
        if (this.loadFromCache() === 1) {
            // Scroll Down
            this.setState({
                tb2_scrollPosition: (this.state.tb2_scrollPosition <= 15) ?
                    this.state.tb2_scrollPosition + 1 : 15
            });
            this.setState({ start: this.state.tb2_scrollPosition * 50 });

            this.setState({ isScrolled: true });
            this.setState({ tb2_count: 1 });
            console.log('Scroll Down ' + this.state.tb2_scrollPosition)

        }
        else if (this.loadFromCache() === -1) {
            // Scroll Up
            this.setState({
                tb2_scrollPosition: (this.state.tb2_scrollPosition < 1) ?
                    0 : this.state.tb2_scrollPosition - 1
            });

            this.setState({
                start: (this.state.tb2_scrollPosition < 1) ?
                    0 : this.state.tb2_scrollPosition * 50
            });

            this.setState({ isScrolled: true });
            this.setState({ tb2_count: 1 });
            console.log('Scroll Up');
        }
    }

    //**********************************************


    // Select Row Setter
    selectAlertTableRow(e) {
        const alertTableId = parseInt(e.target.id);
        console.log('ALERT ID ' + alertTableId);

        this.setState({ target: alertTableId });
        this.setState({ addAlertTableRowBool: true });
    }



    // Create a new table
    newTable() {
        var t = [];
        let style = {};
        let pointer;
        let start = 0;
        let alertTableStacks = this.state.alertTableStack;
        let end = this.state.alertTableStocks.length - 1;

        //console.log('target ' + this.props.state.target + ' length  ' + end);
        // console.log('UPDATE ' );

        for (pointer = start; pointer <= end; pointer++) {
            if (pointer === this.state.target) {
                style = { backgroundColor: "rgb(21,100,111)" };
                console.log('Click on this ' + pointer);
            }
            else
                style = {};

            t.push(
                <tbody>
                    <tr key={pointer} style={style}>
                        <td id={pointer} onClick={this.selectAlertTableRow}>
                            {this.state.alertTableStocks[pointer].StockCode.toString()}</td>
                        <td id={pointer} onClick={this.selectAlertTableRow}>
                            {this.state.alertTableStocks[pointer].TimeStamp.toString()}</td>
                        <td id={pointer} onClick={this.selectAlertTableRow}>
                            {this.state.alertTableStocks[pointer].CurrentPrice.toString()} </td>
                        <td id={pointer} onClick={this.selectAlertTableRow}>
                            {this.state.alertTableStocks[pointer].ChangeP.toString()}</td>
                        <td id={pointer} onClick={this.selectAlertTableRow}>
                            {this.state.alertTableStocks[pointer].Volume.toString()}</td>
                    </tr>
                </tbody>);
        }

        this.setState({ alertTableStack: t });
    }

    // Remove row from table
    removeRow() {
        let t = [];
        let style = {};

        let pointer = 0;
        let start = 0;
        let end = this.state.alertTableStocks.length - 1;

        for (pointer = start; pointer <= end; pointer++) {
            //      console.log('POINTER ' + pointer + ' TARGET ' + this.props.state.target);
            t.push(
                <tbody>
                    <tr key={pointer} style={style}>
                        <td id={pointer} onClick={this.selectAlertTableRow}>
                            {this.state.alertTableStocks[pointer].StockCode.toString()}</td>
                        <td id={pointer} onClick={this.selectAlertTableRow}>
                            {this.state.alertTableStocks[pointer].TimeStamp.toString()}</td>
                        <td id={pointer} onClick={this.selectAlertTableRow}>
                            {this.state.alertTableStocks[pointer].CurrentPrice.toString()} </td>
                        <td id={pointer} onClick={this.selectAlertTableRow}>
                            {this.state.alertTableStocks[pointer].ChangeP.toString()}</td>
                        <td id={pointer} onClick={this.selectAlertTableRow}>
                            {this.state.alertTableStocks[pointer].Volume.toString()}</td>
                    </tr>
                </tbody>);
        }

        this.setState({ alertTableStack: t });
    }


    // Update the table
    updateTable() {
        // Get values from cache
        const pointer = 0;
        let id = 0;

        let t = <div>
            <div id="stack-wrapper">
                <div id="stack-scroll">
                    <table class="alertTable" aria-labelledby="tabelLabel">
                        <thead>
                            {/* <tr>
                                <th id={id} onClick={this.props.selectAlertTableRow}>
                                    {this.props.state.alertTableStocks[pointer].StockCode.toString()}</th>
                                <th id={id} onClick={this.props.selectAlertTableRow}>
                                    {this.props.state.alertTableStocks[pointer].TimeStamp.toString()}</th>
                                <th id={id} onClick={this.props.selectAlertTableRow}>
                                    {this.props.state.alertTableStocks[pointer].CurrentPrice.toString()} </th>
                                <th id={id} onClick={this.props.selectAlertTableRow}>
                                    {this.props.state.alertTableStocks[pointer].ProfitLoss_Percentage.toString()}</th>
                                <th id={id} onClick={this.props.selectAlertTableRow}>
                                    {this.props.state.alertTableStocks[pointer].Volume.toString()}</th>
                           </tr>*/}
                        </thead>

                        {this.state.alertTableStack}

                    </table>
                </div>
            </div>
        </div>;

        // console.log('UPDATE ');
        this.setState({ alertTable: t });
    }

    // **************************************************
    // Add to Saved Stocks Table
    // **************************************************


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

    // Add a Row to  Saved Stocks Table
    async addAlertTableRow(e) {
        var t = this.state.alertTableStack;
        var alertTableStocks = this.state.alertTableStocks;
        const target = parseInt(this.state.clickedAlertTableRowID);

        const exists = await this.keyExists(e, target);
        const maxRows = 45;

        // Change from defensive to error class (call from errorr class) 
        if (exists || this.state.maxNumberOfAlertTableRows >= maxRows ||
            isNaN(target) || (target === null || target === undefined)) {
            window.alert('This stock already exists ');
            return;
        }

        // Save to Database
        const json = SavedStockCache.get(target);

        const obj =
        {
            Id: json.Id,
            StockCode: json.StockCode,
            TimeStamp: json.TimeStamp,
            CurrentPrice: json.CurrentPrice,
            ChangeP: json.ChangeP,
            Volume: json.Volume,
        };

        var jsonString = JSON.stringify(obj);

        await fetch('savenotifications/'.concat(jsonString))
            .then(response => response.status)
            .then(response => {
                if (!response.ok) {
                    // 404 
                    return;
                }
            })
            .catch(error => {
                console.log("error " + error) // 404
                return;
            }
            );

        // Stocks to be displayed in the Notifications table
        alertTableStocks.push(json);
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
    async removeAlertTableRow() {
        let target = parseInt(this.state.target);

        if (this.state.maxNumberOfAlertTableRows < 1
            || isNaN(target) || (target === null || target === undefined))
            return;


        let pointer;
        let start = 0;
        let end = this.state.alertTableStocks.length - 1;
        let alertTableStocks = [];

        let deleteId;

        for (pointer = start; pointer <= end; pointer++) {
            // console.log('alertTableId ' + pointer + ' target ' + target);
            if (pointer === target) {
                deleteId = pointer;
                continue;
            }
            else
                alertTableStocks.push(this.state.alertTableStocks[pointer]);
        }

        await fetch('deletenotification/'.concat(this.map.get(target)))
            .then(response => response.status)
            .then(response => {
                if (!response.ok) {
                    // 404 
                    return;
                }
            })
            .catch(error => {
                console.log("error " + error) // 404
                return;
            }
            );

        console.log('delete id ' + deleteId);

        if ((deleteId !== null || deleteId !== undefined))
            this.map.delete(deleteId);
        else
            return;

        this.setState({ maxNumberOfAlertTableRows: this.state.maxNumberOfAlertTableRows - 1 });
        this.setState({ alertTableStocks: alertTableStocks });
        this.setState({ removeAlertTableRowBool: true });
    }

    // **************************************************

    render() {
        let alertTableHeader = <table class="alertTableHeader" aria-labelledby="tabelLabel">
            <thead>
                <tr>
                    <th>Stock <br /> Name</th>
                    <th>Alert <br /> Time</th>
                    <th>Price</th>
                    <th>ChangeP</th>
                    <th>Volume</th>
                </tr>
            </thead>
        </table>;

        return (
            <div>
                {/* ALERT TABLE */}
                <Box
                    style={{ position: 'absolute', top: '315px', left: '1070px', zIndex: -888 }}
                    //     bg='rgb(30,30,30)'
                    boxShadow='sm'
                    textAlign='center'
                    height='45px'
                    width='50rem'
                    rounded="lg"
                    margin='auto'
                    color='white'
                    zIndex='999'>


                    {alertTableHeader}

                    <Box
                        style={{
                            position: 'absolute',
                            overflowY: 'auto',
                            top: '45px'
                        }}
                        overflowX='hidden'
                        boxShadow='sm'
                        textAlign='center'
                        height='1110px'
                        width='52rem'
                        rounded="lg"
                        margin='auto'
                        color='white'
                        zIndex='-999'>

                        {this.state.alertTable}

                    </Box>
                </Box>
            </div>
        );
    }

}