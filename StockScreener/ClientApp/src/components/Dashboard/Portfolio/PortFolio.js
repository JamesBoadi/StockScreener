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
import PortfolioCache from './js/PortfolioCache';
import PortfolioCalc from './js/PortfolioCalc';
import throttle from 'lodash.throttle';
import * as HashMap from 'hashmap';


/**
* Portfolio Table that adds a stock to the table 
* Includes live information for that stock but does
* not send live alerts
*/
export class PortFolio extends Component {
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
        this.setSelectedRecord = this.setSelectedRecord.bind(this);
        this.initialisePortfolio = this.initialisePortfolio.bind(this);
        this.addFirstRows = this.addFirstRows.bind(this);

        this.updateTableData = this.updateTableData.bind(this);
        this.deselectRow = this.deselectRow.bind(this);

        // **************************************************
        // Form Functions
        // **************************************************

        this.addPortfolioTableRow = this.addPortfolioTableRow.bind(this);
        this.editPortfolioTableRow = this.editPortfolioTableRow.bind(this);
        this.removePortfolioTableRow = this.removePortfolioTableRow.bind(this);
        this.removeStockRow = this.removeStockRow.bind(this);
        this.keyExists = this.keyExists.bind(this);
        this.savePortfolio = this.savePortfolio.bind(this);

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
        this.data = new HashMap(); //


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

            addStockFormVisible: false,
            editStockFormVisible: false,
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
            maxNumberOfPortfolioTableRows: 0,
            removeStock: false,
            editStock: false
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

        PortfolioCache.setUpdateData(this.updateTableData);
        this.initialisePortfolio();
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
            this.deselectRow();
            this.setState({ stockRecordID: null });
            this.updateTable();
            this.setState({ updatePortfolioTableData: false });
        }
        else if (this.state.editPortfolioTable) {
            this.updateTable();
            this.setState({ editPortfolioTable: false });
        }
        else if (this.state.removeStock) {
            this.setEditFormVisibility(false);
            this.setAddFormVisibility(false);
            this.setState({ closeForm: false });
            this.removePortfolioTableRow();
            this.setState({ removeStock: false });
        }
        else if (this.state.editStock) {
            this.setEditFormVisibility(false);
            this.setAddFormVisibility(false);
            this.setState({ closeForm: false });
            this.removePortfolioTableRow();
            this.setState({ editStock: false });
        }

        if (this.state.validInput) {
            this.setState({ validInput: false });
            this.setState({ queryRes: false });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!nextProps.state.updateCache) {
            console.log('NEXTPROPS ' + nextProps.state.updateCache)
            return false;
        }
        else {
            if (this.state.highlightTableRow !== nextState.highlightTableRow ||
                this.state.editPortfolioTable !== nextState.editPortfolioTable ||
                this.state.removeStock !== nextState.removeStock ||
                this.state.closeForm !== nextState.closeForm ||
                this.state.addPortfolioTableRowBool !== nextProps.addPortfolioTableRowBool ||
                this.state.updatePortfolioTableData !== nextState.updatePortfolioTableData ||
                this.state.validInput || this.state.queryRes ||
                nextState.selectedRecordValue !== this.state.selectedRecordValue) {
                // console.log('NEXT ')

                return true;
            }
        }
        return false;
    }

    // **************************************************
    // Initialise Portfolio
    // **************************************************

    // Initialise alert rows from database
    async initialisePortfolio() {
        // Read notifications from database
        await fetch('getportfolio')
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

    async addFirstRows(response) {
        var t = this.state.portfolioTableStack;
        var portfolioTableStocks = this.state.portfolioTableStocks;
        let target = parseInt(this.state.stockRecordID);

        for (var i = 0; i < response.length; i++) {
            const item = JSON.parse(response[i]);

            const exists = await this.keyExists(null, target);

            if (exists) {
                return;
            }

            portfolioTableStocks.push(PortfolioCache.get(item.Id));
            let pointer = parseInt(portfolioTableStocks.length - 1);


            PortfolioCalc.setDataMap(target, this.state.price, this.state.shares,
                this.state.date);

            console.log('Price ' + PortfolioCalc.getPrice(target))

            t.push(
                <tbody key={pointer}>
                    <tr>
                        <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].StockName.toString()}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].StockCode.toString()}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getPrice(target)}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getShares(target)}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getExpenditure(target)}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getDate(target)}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].PrevOpen.toString()}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].CurrentPrice.toString()}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].Change.toString()}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getNetGain(target)}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getGross(target)}</td>
                    </tr>
                </tbody>
            )

            this.map.set(pointer, target);

        }

        this.setState({ maxNumberOfPortfolioTableRows: this.state.maxNumberOfPortfolioTableRows + 1 });
        this.setState({ portfolioTableStack: t });
        this.setState({ portfolioTableStocks: portfolioTableStocks });
        this.setState({ addPortfolioTableRowBool: true });
    }

    // **************************************************

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
            // console.log("PREFIX")
            window.alert(alertPrefix + alertPostfix);
        }
        else
            // console.log("No errors")

            return validate;
    }

    async savePortfolio(portfolio) {
        await fetch('saveportfolio/'.concat(portfolio))
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


    async editPortfolio(data) {
        await fetch('editportfolio/'.concat(data))
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

    async deletePortfolio(id) {
        await fetch('deleteportfolio/'.concat(id))
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

    /* 
    * Checks if the key was added to the map
    * Iterates through map and determines 
    * if a stock was added to the table
    */
    async keyExists(e, target) {
        //  e.persist();
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
        this.setEditFormVisibility(false);

        const res = this.validateForm();

        if (!res)
            return;

        var t = this.state.portfolioTableStack;
        var portfolioTableStocks = this.state.portfolioTableStocks;


        const target = parseInt(this.state.stockRecordID);

        const exists = await this.keyExists(e, target);
        const maxRows = 45;

        if (exists) {
            return;
        }
        else if (this.state.maxNumberOfAlertTableRows >= maxRows) {
            window.alert('Maximum stocks for portfolio exceeded, limit: 200 ');
            return;
        }

        PortfolioCalc.setDataMap(target, this.state.price, this.state.shares,
            this.state.date);

        // Stocks to be displayed in the Portfolio table
        portfolioTableStocks.push(PortfolioCache.get(target));
        let pointer = parseInt(portfolioTableStocks.length - 1);

        t.push(
            <tbody key={pointer}>
                <tr>
                    <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].StockName.toString()}</td>
                    <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].StockCode.toString()}</td>
                    <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getPrice(target)}</td>
                    <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getShares(target)}</td>
                    <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getExpenditure(target)}</td>
                    <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getDate(target)}</td>
                    <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].PrevOpen.toString()}</td>
                    <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].CurrentPrice.toString()}</td>
                    <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].Change.toString()}</td>
                    <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getNetGain(target)}</td>
                    <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getGross(target)}</td>
                </tr>
            </tbody>
        )
        // Add id with its value to map
        // key: 0..N
        this.map.set(pointer, target);

        // Save to Database
        // Add to database
        const obj =
        {
            StockCode: target,
            Price: this.state.price,
            Shares: this.state.shares,
            Date: this.state.date
        }

        this.savePortfolio(JSON.stringify(obj));
        // Force an update

        this.setState({ maxNumberOfPortfolioTableRows: this.state.maxNumberOfPortfolioTableRows + 1 });
        this.setState({ portfolioTableStack: t });
        this.setState({ portfolioTableStocks: portfolioTableStocks });
        this.setState({ addPortfolioTableRowBool: true });
    }

    // Edit Portfolio
    async editPortfolioTableRow(e) {
        this.setState({ closeForm: false });
        this.setAddFormVisibility(false);
        const res = this.validateForm();

        if (!res)
            return;

        const id = parseInt(this.state.stockRecordID);
        const exists = await this.keyExists(e, id);

        if (exists) {
            return;
        }
        if ((this.state.stockRecordID === null || this.state.stockRecordID === undefined)) {
            window.alert('Please select a stock');
            return;
        }

        var new_stack = [];
        var new_portfolioTableStocks = [];


        PortfolioCalc.setDataMap(id, this.state.price, this.state.shares,
            this.state.date);

        for (let pointer = 0; pointer < this.map.size; pointer++) {
            if (id == pointer) {
                // Update map
                this.map.set(pointer, id);

                new_portfolioTableStocks[pointer] = PortfolioCache.get(id); // New information
                console.log("Update state " + new_portfolioTableStocks[pointer].StockName.toString());

                new_stack[pointer] =
                    <tbody key={pointer}>
                        <tr>
                            <td id={pointer} onClick={this.select.bind(this)}>{new_portfolioTableStocks[pointer].StockName.toString()}</td>
                            <td id={pointer} onClick={this.select.bind(this)}>{new_portfolioTableStocks[pointer].StockCode.toString()}</td>
                            <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getPrice(id)}</td>
                            <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getShares(id)}</td>
                            <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getExpenditure(id)}</td>
                            <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getDate(id)}</td>
                            <td id={pointer} onClick={this.select.bind(this)}>{new_portfolioTableStocks[pointer].PrevOpen.toString()}</td>
                            <td id={pointer} onClick={this.select.bind(this)}>{new_portfolioTableStocks[pointer].CurrentPrice.toString()}</td>
                            <td id={pointer} onClick={this.select.bind(this)}>{new_portfolioTableStocks[pointer].Change.toString()}</td>
                            <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getNetGain(id)}</td>
                            <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getGross(id)}</td>
                        </tr>
                    </tbody>;
            }
            else {
                new_portfolioTableStocks[pointer] = this.state.portfolioTableStocks[pointer];
                new_stack[pointer] = this.state.portfolioTableStack[pointer];
            }
        }

        // Add to database
        const obj =
        {
            StockCode: id,
            Price: PortfolioCalc.getPrice(id),
            Shares: PortfolioCalc.getShares(id),
            Date: PortfolioCalc.getDate(id)
        }

        this.editPortfolio(JSON.stringify(obj));

        this.setState({ portfolioTableStack: new_stack });
        this.setState({ portfolioTableStocks: new_portfolioTableStocks });
        this.setState({ editPortfolioTable: true });
    }

    editStockRow()
    {
        this.setState({ stockRecordID: null });
        this.deselectRow();
    }

    removeStockRow() {
        console.log('REMOVE STOCK CLICKE ' + this.state.maxNumberOfPortfolioTableRows)
        if (this.state.maxNumberOfPortfolioTableRows < 1)
            return;
        var answer = window.confirm("Remove Stock? ");
        if (answer) {
            
            this.setState({ removeStock: true });
        }
    }

    removePortfolioTableRow() {
        let count = 0;
        let start = 0;
        const end = this.state.portfolioTableStack.length - 1;
        const target = parseInt(this.state.stockRecordID);
        let portfolioTableStocks = [];
        let t = [];

        for (count = start; count <= end; count++) {
            if (count === target) {
                this.map.delete(target);
                PortfolioCalc.deleteKeyDataMap(target);
                this.deletePortfolio(target);
            }
            else {
                const id = this.map.get(count);

                // Stocks to be displayed in the Portfolio table
                portfolioTableStocks.push(PortfolioCache.get(id));
                let pointer = parseInt(portfolioTableStocks.length - 1);

                t.push(
                    <tbody key={pointer}>
                        <tr>
                            <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].StockName.toString()}</td>
                            <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].StockCode.toString()}</td>
                            <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getPrice(id)}</td>
                            <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getShares(id)}</td>
                            <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getExpenditure(id)}</td>
                            <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getDate(id)}</td>
                            <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].PrevOpen.toString()}</td>
                            <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].CurrentPrice.toString()}</td>
                            <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].Change.toString()}</td>
                            <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getNetGain(id)}</td>
                            <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getGross(id)}</td>
                        </tr>
                    </tbody>
                )

                this.map.set(pointer, id);

            }
        }

        this.setState({ maxNumberOfPortfolioTableRows: this.state.maxNumberOfPortfolioTableRows - 1 });
        this.setState({ portfolioTableStocks: portfolioTableStocks });
        this.setState({ portfolioTableStack: t });
        this.setState({ updatePortfolioTableData: true });
    }

    deselectRow() {
        let start = 0;
        const end = this.state.portfolioTableStack.length - 1;
        let portfolioTableStocks = this.state.portfolioTableStocks;
        let t = [];
        let style = {};

        for (let pointer = start; pointer <= end; pointer++) {
            const id = this.map.get(pointer);
     
            t.push(
                <tbody key={pointer}>
                    <tr style={style}>
                        <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].StockName.toString()}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].StockCode.toString()}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getPrice(id)}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getShares(id)}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getExpenditure(id)}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getDate(id)}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].PrevOpen.toString()}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].CurrentPrice.toString()}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].Change.toString()}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getNetGain(id)}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getGross(id)}</td>
                    </tr>
                </tbody>
            )
        }

        this.setState({ portfolioTableStack: t });
        this.setState({ updatePortfolioTableData: true });
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
        var id = parseInt(e.target.id);
        this.setState({ stockRecordID: id });
        this.setState({ validInput: true });

        console.log("ID " + id)

        if (this.map.has(this.state.stockRecordID))
            this.setState({ stockFormID: id });

        const stockName = PortfolioCache.get(id).StockName;
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
                let id = parseInt(splitStr[0]);
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

        // Pointer is linked to the stock record id
        for (pointer = start; pointer <= end; pointer++) {
            const target = this.map.get(pointer);
            if (this.state.stockRecordID == pointer) {
                style = { backgroundColor: "rgb(21,100,111)" };
            }
            else
                style = {};

            t.push(
                <tbody key={pointer}>
                    <tr style={style}>
                        <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].StockName.toString()}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].StockCode.toString()}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getPrice(target)}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getShares(target)}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getExpenditure(target)}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getDate(target)}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].PrevOpen.toString()}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].CurrentPrice.toString()}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{portfolioTableStocks[pointer].Change.toString()}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getNetGain(target)}</td>
                        <td id={pointer} onClick={this.select.bind(this)}>{PortfolioCalc.getGross(target)}</td>
                    </tr>
                </tbody>);
        }

        this.setState({ portfolioTableStack: t });
        this.setState({ addPortfolioTableRowBool: true });
    }

    // Update the table
    updateTable() {
        let t = <div>
            <table class="portfolioTable" aria-labelledby="tabelLabel">
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
            portfolioTableStocks.push(PortfolioCache.get(target));

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
        let portfolioTableHeader = <table class="portfolioTableHeader" aria-labelledby="tabelLabel"
            style={{ zIndex: '999' }}>
            <thead>
                <tr>
                    <th>Stock <br /> Name</th>
                    <th>Stock <br /> Code</th>
                    <th>Price</th>
                    <th>Shares</th>
                    <th>Expenditure</th>
                    <th>Date </th>
                    <th>Close <br />(Previous)</th>
                    <th>Current <br /> Price</th>
                    <th>Change</th>
                    <th>Net Gain / Loss <br /> (Est)</th>
                    <th>Gross</th>
                </tr>
            </thead>
        </table>;

        return (
            <div>

                <AddStockForm {...this} />
                <EditStockForm {...this} />

                <div class="portfolio">

                    <div class="addStock" style={{ zIndex: '999' }}>
                        <Button onClick={() => {
                            this.setAddFormVisibility(true)
                            this.setEditFormVisibility(false)
                        }}>Add</Button>
                    </div>

                    <div class="editStock" style={{ zIndex: '999' }}>
                        <Button onClick={() => {
                            this.setEditFormVisibility(true)
                            this.setAddFormVisibility(false)
                        }}>Edit</Button>
                    </div>

                    <div class="removeStock" style={{ zIndex: '999' }}>
                        <Button onClick={() => {
                            this.removeStockRow()
                        }}>Remove</Button>
                    </div>

                    <h2 style={{ position: 'absolute', top: '100px', left: '60px', color: 'wheat' }}>My Portfolio</h2>

                    {/* PORTFOLIO TABLE */}
                    <Box
                        style={{ position: 'absolute', top: '125px', left: '60px' }}
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

