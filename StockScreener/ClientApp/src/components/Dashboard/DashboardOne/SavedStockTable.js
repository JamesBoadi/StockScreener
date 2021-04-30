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
import TableCache from './js/TableCache.js';

/* Table for adding Alerts */
export class SavedStockTable extends Component {
    constructor(props) {
        super(props);

        this.textInput = React.createRef();
        this.highlightRow = this.highlightRow.bind(this);
        this.initialiseAlertTable = this.initialiseAlertTable.bind(this);
        this.addFirstRows = this.addFirstRows.bind(this);

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
        this.initialiseAlertTable();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (this.state.populateTable) {
            this.initialiseAlertTable();
            this.setState({ populateTable: false });
        }
        if (this.props.state.addAlertTableRowBool) {
            this.addAlertTableRow();
        
            this.props.setAddAlertTableRowBool(false);
        }
        else if (this.props.state.removeAlertTableRowBool) {
            this.removeAlertTableRow();
            this.props.setRemoveAlertTableRowBool(false);
        }
        else if (this.state.addAlertTableRowBool) {
         //   this.highlightRow();
            this.setState({ start: this.state.tb2_scrollPosition * 50 }, () => {
                this.updateTable(this.state.start);
            });
            const name = SavedStockCache.get(this.props.state.clickedAlertTableRowID).StockName;
            window.alert('Stock ' + name + ' has been added ');
            this.setState({ addAlertTableRowBool: false });
        }
        else if (this.state.removeAlertTableRowBool) {
            //this.removeRow();
            this.setState({ start: this.state.tb2_scrollPosition * 50 }, () => {
                this.updateTable(this.state.start);
            });
            const name = SavedStockCache.get(this.props.state.clickedAlertTableRowID).StockName;
            window.alert('Stock ' + name + ' has been removed ');
            this.setState({ removeAlertTableRowBool: false });
        }
        else if (this.props.state.isSelected) {
            this.props.displayStock(this.props.state.clickedAlertTableRowID);
            this.highlightRow();

            this.setState({ start: this.state.tb2_scrollPosition * 50 }, () => {
                this.updateTable(this.state.start);
            });

            this.props.setIsSelected(false);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.state.addAlertTableRowBool !== nextProps.state.addAlertTableRowBool
            || this.props.state.removeAlertTableRow !== nextProps.state.removeAlertTableRow
            || this.props.state.update !== nextProps.state.update
            || this.state.addAlertTableRowBool !== nextState.addAlertTableRowBool
            || this.state.removeAlertTableRowBool !== nextState.removeAlertTableRowBool
            || this.props.state.isSelected !== nextProps.state.isSelected
        ) {
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
        await fetch('getallsavedstocks')
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
        if (response.length === 0 || response === null || response === undefined)
            return;
        
        
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

    // Create a new table
    highlightRow() {
        var t = [];
        let style = {};
        let pointer;
        let start = 0;
        let alertTableStacks = this.state.alertTableStack;
        let end = this.state.alertTableStocks.length - 1;

        const target = this.props.state.clickedAlertTableRowID;

        for (pointer = start; pointer <= end; pointer++) {
            if (pointer == target) {
                style = { backgroundColor: "rgb(21,100,111)" };
                console.log('Click on this ' + pointer);
            }
            else
                style = {};

            t.push(
                <tbody key={pointer}>
                    <tr id={pointer} style={style}>
                        <td id={pointer} onClick={this.props.selectAlertTableRow}>
                            {this.state.alertTableStocks[pointer].StockCode.toString()}</td>
                        <td id={pointer} onClick={this.props.selectAlertTableRow}>
                            {this.state.alertTableStocks[pointer].TimeStamp.toString()}</td>
                        <td id={pointer} onClick={this.props.selectAlertTableRow}>
                            {this.state.alertTableStocks[pointer].CurrentPrice.toString()} </td>
                        <td id={pointer} onClick={this.props.selectAlertTableRow}>
                            {this.state.alertTableStocks[pointer].ChangeP.toString()}</td>
                        <td id={pointer} onClick={this.props.selectAlertTableRow}>
                            {this.state.alertTableStocks[pointer].Volume.toString()}</td>
                    </tr>
                </tbody>);
        }

        this.setState({ alertTableStack: t });
        this.props.setIsSelected(true);
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
    async addAlertTableRow() {
        var t = this.state.alertTableStack;
        var alertTableStocks = this.state.alertTableStocks;
        const target = parseInt(this.props.state.clickedAlertTableRowID);

        const exists = await this.keyExists(null, target);
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

        await fetch('savestocks/'.concat(jsonString))
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
            <tbody key={pointer}>
                <tr  id={pointer}>
                    <td id={pointer} onClick={this.props.selectAlertTableRow}>{alertTableStocks[pointer].StockCode.toString()}</td>
                    <td id={pointer} onClick={this.props.selectAlertTableRow}>{alertTableStocks[pointer].TimeStamp.toString()}</td>
                    <td id={pointer} onClick={this.props.selectAlertTableRow}>{alertTableStocks[pointer].CurrentPrice.toString()} </td>
                    <td id={pointer} onClick={this.props.selectAlertTableRow}>{alertTableStocks[pointer].ChangeP.toString()}</td>
                    <td id={pointer} onClick={this.props.selectAlertTableRow}>{alertTableStocks[pointer].Volume.toString()}</td>
                </tr>
            </tbody>
        )
        // Add id with its value to map
        // key: 0..N value: alertTable
        this.map.set(pointer, target);
        // Save to Database

        console.log('NEXT')

        this.highlightRow();

        // Force an update
        this.setState({ maxNumberOfAlertTableRows: this.state.maxNumberOfAlertTableRows + 1 });
        this.setState({ alertTableStack: t });
        this.setState({ alertTableStocks: alertTableStocks });
        this.setState({ addAlertTableRowBool: true });
    }

    // Are you sure you want to remove this stock?
    async removeAlertTableRow() {
        const target = parseInt(this.props.state.clickedAlertTableRowID);

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

        await fetch('deletesavedstocks/'.concat(this.map.get(target)))
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
                    style={{ position: 'absolute', top: '315px', left: '1070px', zIndex: 0 }}
                    //     bg='rgb(30,30,30)'
                    boxShadow='sm'
                    textAlign='center'
                    height='45px'
                    width='50rem'
                    rounded="lg"
                    margin='auto'
                    color='white'
                    >


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
                        >

                        {this.state.alertTable}

                    </Box>
                </Box>
            </div>
        );
    }

}