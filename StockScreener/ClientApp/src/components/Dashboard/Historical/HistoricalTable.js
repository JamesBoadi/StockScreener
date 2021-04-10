import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { render } from 'react-dom';
import {
    Box, NumberInput,
    NumberInputField, NumberInputStepper,
    NumberIncrementStepper, NumberDecrementStepper,
    InputGroup, InputRightElement, InputLeftElement,
    Menu, MenuButton, MenuList, MenuItem, MenuItemOption,
    MenuGroup, MenuOptionGroup, MenuIcon, MenuCommand, MenuDivider
} from '@chakra-ui/react';
import 'antd/dist/antd.css';

import {
    Form,
    Input,
    Button,
    Radio,
    Select,
    Cascader,
    DatePicker,
    InputNumber,
    TreeSelect,
    Switch,
    AutoComplete
} from 'antd';

import { TopNavbar } from '../TopNavbar.js';
import { AddStockForm } from './AddStockForm';
import { EditStockForm } from './EditStockForm';
import { Search } from './Search';
import HistoryCache from './js/HistoryCache';
import PortfolioCalc from './js/HistoryCalc';
import * as HashMap from 'hashmap';


/**
* Historical Table that adds a stock to the table. 
* Includes live information for that stock and also
* includes live alerts and mathematical calculations
*/

export class HistoricalTable extends Component {
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
        this.setSelectedRecord = this.setSelectedRecord.bind(this);

        this.updateTableData = this.updateTableData.bind(this);

        // **************************************************
        // Form Functions
        // **************************************************

        this.addPortfolioTableRow = this.addPortfolioTableRow.bind(this);
        this.editPortfolioTableRow = this.editPortfolioTableRow.bind(this);
        this.removePortfolioTableRow = this.removePortfolioTableRow.bind(this);
        this.selectmad = this.selectmad.bind(this);
        this.keyExists = this.keyExists.bind(this);

        // Setters
        // **************************************************

        this.setShares = this.setShares.bind(this);
        this.setPrice = this.setPrice.bind(this);
        this.setDate = this.setDate.bind(this);
        this.setAddFormVisibility = this.setAddFormVisibility.bind(this);
        this.setEditFormVisibility = this.setEditFormVisibility.bind(this);

        // **************************************************

        this.setClearRecord = this.setClearRecord.bind(this);
        this.validateForm = this.validateForm.bind(this);

        // **************************************************
        // Static Variables
        // **************************************************

        let style = { color: "white;" };
        this.timeout = null;
        this.map = new HashMap();
        this.data = new HashMap();

        this.state = {
            green: false,
            red: false,
            priceChangeUp: false,
            validInput: false,
            display: [],
            stockRecordID: 0,
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
            portfolioTable: [],

            isScrolled: false,
            scrollUp_: 0,
            scrollDown_: 0,
            componentSize: 'default',

            // **************************************************
            // Form
            // **************************************************

            addStockFormVisible: "visible",
            editStockFormVisible: "hidden",
            closeForm: true,
            stockFormID: null,
            selectedRecordValue: "",
            clearRecord: false,
            date: "",
            shares: 0,
            price: 0,
            target: 0,
            portfolioTableRowBool: true,

            // **************************************************
            // Portfolio Table Variables
            // **************************************************

            highlightTableRow: false,
            addPortfolioTableRowBool: false,
            updatePortfolioTableData: false,
            editPortfolioTable: false,
            removePortfolioTableRowBool: false,
            portfolioTableStocks: [],
            portfolioTableStack: [],
            clickedPortfolioTableRowID: 0,
            maxNumberOfPortfolioTableRows: 0

        };
    }

    onFormLayoutChange = ({ size }) => {
        this.setState({ componentSize: size })
    };

    componentDidMount() {
        // Add to database initialise
        this.interval = setInterval(() => {
            if (this.props.state.updateCache) {
                clearInterval(this.interval);
            }
        }, 1000);

        

         // setHistorical( , , )   Set Historical Data


        //HistoryCache.setUpdateData(this.updateTableData);

        /* this.createTable()
         this.updateTable()
 
         setInterval(() => {
             window.location.reload();
         }, 20000000);
 
         this.setState({ scroll: this.scrollBy() })*/
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.highlightTableRow) {
            this.newTable();
            this.updateTable(this.state.start);
            this.setState({ highlightTableRow: false });
        }
        else if (this.state.addPortfolioTableRowBool) {
            this.newTable();
            this.setState({ start: this.state.tb2_scrollPosition * 50 }, () => {
                this.updateTable(this.state.start);
            });

            this.setState({ addPortfolioTableRowBool: false });
        }
        else if (this.state.updatePortfolioTableData) {
            this.newTable();
            this.updateTable();

            this.setState({ updatePortfolioTableData: false });
        }
        else if (this.state.editPortfolioTable) {

            this.updateTable();

            this.setState({ editPortfolioTable: false });
        }

        if (this.state.validInput) {
            this.setState({ validInput: false });
            this.setState({ queryRes: false });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!nextProps.state.updateCache) {
            return false;
        }
        else {
            if (this.state.highlightTableRow !== nextState.highlightTableRow ||
                this.state.editPortfolioTable !== nextState.editPortfolioTable ||
                this.state.closeForm !== nextState.closeForm ||
                this.state.addPortfolioTableRowBool !== nextProps.addPortfolioTableRowBool
                || this.state.updatePortfolioTableData !== nextState.updatePortfolioTableData ||
                this.state.validInput || this.state.queryRes
                || nextState.selectedRecordValue !== this.state.selectedRecordValue) {
                // console.log('NEXT ')

                return true;
            }
        }
        return false;
    }
    selectmad(e) {
        const portfolioTableId = parseInt(e.target.id);
        //   console.log('portfolio ' + portfolioTableId);

    }

    // **************************************************
    // Form Functionality Methods
    // **************************************************

    // Triggered and highlighted when a row is clicked
    select(e) {
        const portfolioTableId = parseInt(e.target.id);
        //  console.log('portfolio ' + portfolioTableId);
        this.setState({ stockRecordID: portfolioTableId });
        this.setState({ highlightTableRow: true });

    }

    // Validates the Form before adding a stock to the table 
    validateForm() {
        let alertPostfix = " is missing!"
        let alertPrefix = "";
        let validate = true;
        if (this.state.selectedRecordValue == null || this.state.selectedRecordValue == undefined
            || this.state.selectedRecordValue.length < 1) {
            alertPrefix += "Stock";
            validate = false;
        }
        else if ((this.state.price == null) || (this.state.price == undefined)) {
            alertPrefix += "Price";
            validate = false;
        } //else if  (!((this.state.price !== null) || (this.state.price !== undefined))  ) {
        //alertPrefix += "";
        //}
        if (alertPrefix !== "") {
            console.log("PREFIX")
            window.alert(alertPrefix + alertPostfix);
        }
        else
            console.log("No errors")

        return validate;
    }

    /* Checks if the key was added to the map
    * Iterates through map and determines 
    * if a stock was added to the table
    */
    async keyExists(e, target) {
        if (isNaN(target) || (target === null || target === undefined))
            resolve(false);

        return new Promise(resolve => {
            setTimeout(() => {
                //    e.stopPropagation();
                const target_ = parseInt(target);

                for (const pair of this.map) {
                    let value = parseInt(pair.value);
                    if (target_ === value) {
                        window.alert('This stock already exists ');
                        resolve(true);
                    }
                }
                resolve(false);
            }, 100);
        });
    }

    // Add a Row to Portfolio table
    async addPortfolioTableRow(e) {
        this.setState({ closeForm: false });
        this.setState({ editStockFormVisible: "hidden" });
        const res = this.validateForm();

        if (!res)
            return;

        var t = this.state.portfolioTableStack;
        var portfolioTableStocks = this.state.portfolioTableStocks;
        let target = parseInt(HistoryCache.getTableID());

        const exists = await this.keyExists(e, target);
        const maxRows = 45;

        if (exists) {
            window.alert('Key already added to the table ');
            return;
        }
        else if (this.state.maxNumberOfAlertTableRows >= maxRows) {
            window.alert('Maximum stocks for portfolio exceeded, limit: 200 ');
            return
        }
        /*  PortfolioCalc.setPortfolio(this.state.price, this.state.shares,
              this.state.price * this.state.shares);*/

        // Stocks to be displayed in the Portfolio table
        portfolioTableStocks.push(HistoryCache.get(target));
        let pointer = parseInt(portfolioTableStocks.length - 1);

        t.push(
            <tbody key={pointer}>
                <tr>
                    <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].StockName.toString()}</td>
                    <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].StockCode.toString()}</td>
                    <td id={pointer} onClick={this.select.bind(this)}>{this.data.get(pointer).price}</td>
                    <td id={pointer} onClick={this.select.bind(this)}>{this.data.get(pointer).shares}</td>
                    <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getExpenditure()}</td>
                    <td id={pointer} onClick={this.select.bind(this)}>{this.data.get(pointer).date}</td>
                    <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].PrevOpen.toString()}</td>
                    <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].CurrentPrice.toString()}</td>
                    <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].Change.toString()}</td>
                    <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getProfitLoss()}</td>
                    <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getProfitLossPercentage()}</td>
                </tr>
            </tbody>
        )
        // Add id with its value to map
        // key: 0..N
        this.map.set(pointer, target);

        // Save to Database

        // Force an update

        this.setState({ maxNumberOfPortfolioRows: this.state.maxNumberOfPortfolioTableRows + 1 });
        this.setState({ portfolioTableStack: t });
        this.setState({ portfolioTableStocks: portfolioTableStocks });
        this.setState({ addPortfolioTableRowBool: true });
    }

    // Edit Portfolio
    async editPortfolioTableRow(e) {
        this.setState({ closeForm: false });
        this.setState({ addStockFormVisible: "hidden" });
        const res = this.validateForm();

        if (!res)
            return;

        const exists = await this.keyExists(e, this.state.stockFormID);

        if (exists || (this.state.stockFormID === null || this.state.stockFormID === undefined))
            return;

        var new_stack = [];
        var new_portfolioTableStocks = [];

        // Add a key so it adds to a map updated by the database
        PortfolioCalc.setPortfolio(this.state.price, this.state.shares,
            this.state.price * this.state.shares);

        for (let pointer = 0; pointer < this.map.size; pointer++) {
            if (parseInt(this.state.stockRecordID) == parseInt(pointer)) {

                // Update maps
                this.data.set(pointer, { price: this.state.price, shares: this.state.shares, date: this.state.date });
                this.map.set(pointer, this.state.stockFormID);

                new_portfolioTableStocks[pointer] = HistoryCache.get(this.state.stockFormID); // New information
                console.log("Update state " + new_portfolioTableStocks[pointer].StockName.toString());

                new_stack[pointer] =
                    <tbody>
                        <tr>
                            <td id={pointer} onClick={this.select.bind(this)}>{new_portfolioTableStocks[pointer].StockName.toString()}</td>
                            <td id={pointer} onClick={this.select.bind(this)}>{new_portfolioTableStocks[pointer].StockCode.toString()}</td>
                            <td id={pointer} onClick={this.select.bind(this)}>{this.data.get(pointer).price}</td>
                            <td id={pointer} onClick={this.select.bind(this)}>{this.data.get(pointer).shares}</td>
                            <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getExpenditure()}</td>
                            <td id={pointer} onClick={this.select.bind(this)}>{this.data.get(pointer).date}</td>
                            <td id={pointer} onClick={this.select.bind(this)}>{new_portfolioTableStocks[pointer].PrevOpen.toString()}</td>
                            <td id={pointer} onClick={this.select.bind(this)}>{new_portfolioTableStocks[pointer].CurrentPrice.toString()}</td>
                            <td id={pointer} onClick={this.select.bind(this)}>{new_portfolioTableStocks[pointer].Change.toString()}</td>
                            <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getProfitLoss()}</td>
                            <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getProfitLossPercentage()}</td>
                        </tr>
                    </tbody>;
            }
            else {
                new_portfolioTableStocks[pointer] = this.state.portfolioTableStocks[pointer];
                new_stack[pointer] = this.state.portfolioTableStack[pointer];
            }
        }

        this.setState({ portfolioTableStack: new_stack });
        this.setState({ portfolioTableStocks: new_portfolioTableStocks });
        this.setState({ editPortfolioTable: true });
    }

    // Are you sure you want to remove this stock?
    removePortfolioTableRow() {
        /*  if (this.state.maxNumberOfAlertTableRows < 1)
              return;
  
          let pointer;
          let start = 0;
          let end = this.state.alertTableStocks.length - 1;
          let target = parseInt(this.state.target);
          let portfolioTableStack = [];
  
          for (pointer = start; pointer <= end; pointer++) {
              // console.log('alertTableId ' + pointer + ' target ' + target);
              if (pointer === target) {
                  this.map.delete(pointer);
                  continue;
              }
              else
                  portfolioTableStack.push(this.state.portfolioTableStack[pointer]);
          }
  
          this.setState({ maxNumberOfAlertTableRows: this.state.maxNumberOfAlertTableRows - 1 });
          this.setState({ alertTableStocks: alertTableStocks });
          this.setState({ removeAlertTableRowBool: true });*/


        var txt;
        if (window.confirm("Confirm to delete this stock")) {
            txt = "Yes";
        } else {
            txt = "No";
        }

        /* if (txt === "Yes") {
             
         }*/

    }

    // Search box retrieves stocks from database
    async searchDatabase(e) {
        // e.preventDefault();
        let input = new String(e.target.value);

        if (input.length < 1) {
            this.setState({ queryRes: false });
            this.setState({
                display: <div
                    style={{ color: 'wheat' }}>
                    No Stocks Found
            </div>
            });
        }

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
            this.setState({
                display: <div
                    style={{ color: 'wheat' }}>
                    No Stocks Found
                </div>
            })
        }
    }

    getDisplay() {
        return this.state.display;
    }

    setAddFormVisibility(value) {
        this.setState({ addStockFormVisible: value })
        this.setState({ closeForm: true })
    }


    setEditFormVisibility(value) {
        this.setState({ editStockFormVisible: value })
        this.setState({ closeForm: true })
    }

    setShares(value) {
        this.setState({ shares: value });
    }

    setPrice(value) {
        this.setState({ price: value });
    }

    setDate(date, dateString) {
        this.setState({ date: dateString });
    }

    // Clears the record from the form
    setClearRecord(bool) {
        this.setState({ selectedRecordValue: "" });
        this.setState({ clearRecord: bool });
    }

    // select record from dropdown list
    selectRecords(e) {
        var id = new Number(e.target.id);
        this.setState({ stockRecordID: id });
        this.setState({ validInput: true });

        console.log("ID " + id)
        if (this.map.has(this.state.stockRecordID))
            this.setState({ stockFormID: id });

        const stockName = HistoryCache.get(id).StockName;
        this.setState({ selectedRecordValue: stockName });
        this.setState({ clearRecord: false });
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
                        style={{ color: 'wheat', cursor: 'pointer' }}
                        onClick={this.selectRecords} >
                        {(value.length > 8) ? `${value}` : `${value}`}
                        <br />
                    </div>
                );// Seperate spaces
            }
        }
        else {
            string.push(<div
                style={{ color: 'wheat' }}>
                No Stocks Found
                </div>);
            this.setState({ validInput: false });
        }

        this.setState({ display: string });
    }

    setSelectedRecord(value) {
        this.setState({ selectedRecordValue: value });
    }

    // **************************************************

    // **************************************************
    // Scroll Functionality Methods
    // **************************************************

    // Units to scroll by to find record in search stocks
    scrollBy() {
        const height = 800;
        const scroll = 34;

        const stockRecordID = this.state.stockRecordID;
        let heightUnits = (stockRecordID / scroll);
        let count = height * heightUnits;

        return count;
    }

    // Trigger scrolling event
    scroll_() {
        this.setState({ scroll: this.textInput.current.scrollTop })
        this.scrollToPosition()
        //this.setState({ scrollUp_: scrollUp_ + 0.5 })
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

    // **************************************************

    // **************************************************
    // Table Functionality Methods
    // **************************************************

    // Create a new table
    newTable() {
        var t = [];
        let style = {};
        let pointer;
        let start = 0;
        let end = this.state.portfolioTableStocks.length - 1;
        var portfolioTableStocks = this.state.portfolioTableStocks;
        // console.log('UPDATE ' );

        for (pointer = start; pointer <= end; pointer++) {
            if (parseInt(this.state.stockRecordID) == parseInt(pointer)) {

                style = { backgroundColor: "rgb(21,100,111)" };
            }
            else
                style = {};

            t.push(
                <tbody>
                    <tr style={style} >
                        <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].StockName.toString()}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].StockCode.toString()}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{this.data.get(pointer).price}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{this.data.get(pointer).shares}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getExpenditure()}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{this.data.get(pointer).date}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].PrevOpen.toString()}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].CurrentPrice.toString()}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].Change.toString()}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getProfitLoss()}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getProfitLossPercentage()}</td>
                    </tr>
                </tbody>);
        }

        this.setState({ portfolioTableStack: t });
        this.setState({ addPortfolioTableRowBool: true });
    }

    // Remove row from table
    removeRow() {
        let t = [];
        let style = {};
        var portfolioTableStocks = this.state.portfolioTableStocks;
        let pointer = 0;
        let start = 0;
        let end = this.state.portfolioTableStocks.length - 1;

        for (pointer = start; pointer <= end; pointer++) {
            //      console.log('POINTER ' + pointer + ' TARGET ' + this.props.state.target);

            t.push(
                <tbody>
                    <tr>
                        <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].StockName.toString()}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].StockCode.toString()}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{this.data.get(pointer).price}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{this.data.get(pointer).shares}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getExpenditure()}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{this.data.get(pointer).date}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].PrevOpen.toString()}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].CurrentPrice.toString()}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].Change.toString()}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getProfitLoss()}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getProfitLossPercentage()}</td>
                    </tr>
                </tbody>);
        }

        this.setState({ portfolioTableStack: t });
    }

    // Update the table
    updateTable() {
        let t = <div>
            <table class="historicalTable" aria-labelledby="tabelLabel">
                <thead></thead>
                {this.state.portfolioTableStack}
            </table>
        </div>;
        // console.log('UPDATE ');
        this.setState({ portfolioTable: t });
        this.forceUpdate();
    }

    // Update the table's data
    updateTableData() {
        let portfolioTableStocks = [];

        if (this.map.size === 0)
            return;

        for (let pointer = 0; pointer < this.map.size; pointer++) {
            let target = parseInt(this.map.get(pointer));
            portfolioTableStocks.push(HistoryCache.get(target));

            /*     t.push(
                     <tbody>
                         <tr>
                             <td id={pointer} onClick={this.select}>{portfolioTableStocks[pointer].StockName.toString()}</td>
                             <td id={pointer} onClick={this.select}>{portfolioTableStocks[pointer].StockCode.toString()}</td>
                             <td id={pointer} onClick={this.select}>{this.state.price}</td>
                             <td id={pointer} onClick={this.select}>{this.state.shares}</td>
                             <td id={pointer} onClick={this.select}>{PortfolioCalc.getExpenditure()}</td>
                             <td id={pointer} onClick={this.select}>{this.state.date}</td>
                             <td id={pointer} onClick={this.select}>{portfolioTableStocks[pointer].PrevOpen.toString()}</td>
                             <td id={pointer} onClick={this.select}>{portfolioTableStocks[pointer].CurrentPrice.toString()}</td>
                             <td id={pointer} onClick={this.select}>{portfolioTableStocks[pointer].Change.toString()}</td>
                             <td id={pointer} onClick={this.select}>{PortfolioCalc.getProfitLoss()}</td>
                             <td id={pointer} onClick={this.select}>{PortfolioCalc.getProfitLossPercentage()}</td>
                         </tr>
                     </tbody>*
                 )*/
        }


        this.setState({ portfolioTableStocks: portfolioTableStocks });
        this.setState({ updatePortfolioTableData: true });
    }

    // **************************************************

    render() {
        let portfolioTableHeader = <table class="historicalTableHeader" aria-labelledby="tabelLabel"
            style={{ zIndex: '999' }}>
            <thead>
                <tr>
                    <th>Stock <br /> Name</th>
                    <th>Stock <br /> Code</th>
                    <th>Current <br /> Price</th>
                    <th>Date </th>
                    <th>Close <br />(Previous)</th>
                    <th>Change</th>
                    <th>ChangeP</th>
                </tr>
            </thead>
        </table>;

        let filterTableHeader = <table class="historicalTableHeader" aria-labelledby="tabelLabel"
            style={{ zIndex: '999', position: 'absolute', left: '700px' }}>
            <thead>
                <tr>
                    <th>UpperBand</th>
                    <th>MiddleBand</th>
                    <th>LowerBand</th>
                    <th>SMA </th>
                    <th>Signal</th>
                    <th>Volume</th>
                    <th>RSI</th>
                </tr>
            </thead>
        </table>;

        return (
            <div>
                <div class="historical">


                    {/* TOP NAVBAR */}
                    <Box
                        min-width='12.25rem'
                        width='36rem'
                        height='22rem'
                        overflowY='auto'
                        bg='#f9f9f9'
                        top='0px'
                        justifyContent='center'
                        visibility={this.state.addStockFormVisible}
                        backgroundColor='whiteAlpha.508'
                        style={{ position: 'absolute', left: '845px', top: '230px' }}
                        zIndex='999'
                    >
                        <h4 style={{ position: 'absolute', color: 'black' }}>Filter </h4>
                        <p style={{
                            position: 'absolute', color: 'black', fontWeight: 'bold',
                            fontSize: '15px', top: '5px', right: '20px', cursor: 'pointer'
                        }}
                            onClick={() => this.setAddFormVisibility("hidden")}>Close</p>
                        <AddStockForm {...this} />
                    </Box>

                    <Box
                        min-width='12.25rem'
                        width='20rem'
                        height='6rem'
                        overflowY='auto'
                        bg='#f9f9f9'
                        top='0px'
                        justifyContent='center'
                        visibility={this.state.editStockFormVisible}
                        backgroundColor='whiteAlpha.508'
                        style={{ position: 'absolute', left: '800px', top: '220px' }}
                        zIndex='999'
                    >
                        <h4 style={{ position: 'absolute', color: 'black' }}>Edit Stock </h4>
                        <p style={{
                            position: 'absolute', color: 'black', fontWeight: 'bold',
                            fontSize: '15px', top: '5px', right: '20px', cursor: 'pointer'
                        }}
                            onClick={() => this.setEditFormVisibility("hidden")}>Close</p>

                        <EditStockForm {...this} />
                    </Box>

                    {/* TOP NAVBAR */}
                    <TopNavbar />

                    <div class="addStock" style={{ zIndex: '999', transform: 'translateX(20px)' }}>
                        <Button onClick={() => {
                            this.setAddFormVisibility("visible")
                            this.setEditFormVisibility("hidden")
                        }}>Filter</Button>
                    </div>

                    <div class="removeStock" style={{ zIndex: '999' }}>
                        <Button onClick={() => this.removePortfolioTableRow()}>Remove</Button>
                    </div>

                    {/* <Button class="addStock" style={{ position: 'absolute', top: '130px', left: '1030px' }}
                         onClick={() => this.setAddFormVisibility("visible")}>Add a Stock</Button>*/}

                    <h2 style={{ position: 'absolute', top: '100px', left: '80px', color: 'wheat' }}>Historical Information</h2>

                    {/* PORTFOLIO TABLE */}

                    <Box
                        style={{ position: 'absolute', top: '125px', left: '80px' }}
                        //     bg='rgb(30,30,30)'
                        boxShadow='sm'
                        textAlign='center'
                        height='45px'
                        width='78rem'
                        rounded="lg"
                        margin='auto'
                        color='white'
                    >
                        {portfolioTableHeader}
                        {filterTableHeader}

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
                            width='78rem'
                            rounded="lg"
                            margin='auto'
                            color='white'
                        >

                            {this.state.portfolioTable}

                        </Box>
                    </Box>



                </div>
            </div>
        );
    }
}

