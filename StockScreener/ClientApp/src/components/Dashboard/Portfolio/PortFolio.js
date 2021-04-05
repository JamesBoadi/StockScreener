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

import { Search } from './Search';
import PortfolioCache from './js/PortfolioCache';
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
        this.removeRow = this.removeRow.bind(this);
        this.setSelectedRecord = this.setSelectedRecord.bind(this);


        // Add, remove Table Rows


        this.addPortfolioTableRow = this.addPortfolioTableRow.bind(this);
        this.removePortfolioTableRow = this.removePortfolioTableRow.bind(this);
        this.selectPortfolioTableRow = this.selectPortfolioTableRow.bind(this);
        this.keyExists = this.keyExists.bind(this);

        // **************************************************
        // Form Functions
        // **************************************************

        this.setShares = this.setShares.bind(this);
        this.setPrice = this.setPrice.bind(this);
        this.setClearRecord = this.setClearRecord.bind(this);
        this.validateForm = this.validateForm.bind(this);

        // **************************************************
        // Static Variables
        // **************************************************

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
            portfolioTable: [],

            isScrolled: false,
            scrollUp_: 0,
            scrollDown_: 0,
            componentSize: 'default',

            // Form
            formIsVisible: true,
            selectedRecordValue: "",
            clearRecord: false,
            shares: 0,
            price: 0,

            target: 0,
            portfolioTableRowBool: true,

            // **************************************************
            // Portfolio Table Variables
            // **************************************************

            addPortfolioTableRowBool: false,
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

        this.interval = setInterval(() => {
            if (this.props.state.updateCache) {
                clearInterval(this.interval);
            }
        }, 1000);


        /* this.createTable()
         this.updateTable()
 
         setInterval(() => {
             window.location.reload();
         }, 20000000);
 
         this.setState({ scroll: this.scrollBy() })*/
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.addPortfolioTableRowBool) {
            this.newTable();
            this.setState({ start: this.state.tb2_scrollPosition * 50 }, () => {
                this.updateTable(this.state.start);
            });

            this.setState({ addPortfolioTableRowBool: false });
        }
        /* if (this.state.removeAlertTableRowBool) {
             this.removeRow();
             this.setState({ start: this.state.tb2_scrollPosition * 50 }, () => {
                 this.updateTable(this.state.start);
             });
             this.props.setRemoveAlertTableRowBool(false);
         }*/

        if (this.state.validInput) {
            this.setState({ validInput: false });
            this.setState({ queryRes: false });
        }

        // Update table
        /*  if (this.state.tb2_count === 1 && snapshot !== null) {
  
              this.updateTable()
              
              if(this.state.start === 0)
                  this.textInput.current.scrollTop = 15;
              else
                  this.textInput.current.scrollTop = 100;
  
              this.setState({ isScrolled: false });
              this.setState({ tb2_count: 0 });
              console.log('T is updated');
          }
  
          // Scroll to the position in the table
          const scroll = this.scrollBy();
  
          if (this.state.validInput === true) {
              this.textInput.current.scrollTop = scroll;
              this.setState({ validInput: false })
          }*/
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!nextProps.state.updateCache) {
            return false;
        }
        else if (this.state.addPortfolioTableRowBool !== nextProps.addPortfolioTableRowBool) {
            return true;
        }
        else if (this.state.validInput || this.state.queryRes
            || nextState.selectedRecordValue !== this.state.selectedRecordValue) {
            // console.log('NEXT ')

            return true;
        }
        return false;
    }

    // Triggered and highlighted when a row is clicked
    selectPortfolioTableRow(e) {
        const portfolioTableId = parseInt(e.target.id);
        console.log('PORTFOLIO ID ' + portfolioTableId);
        this.setState({ target: portfolioTableId });
        this.setState({ portfolioTableRowBool: true });
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


    // Checks if the key was added to the map
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

    // Add a Row to Portfolio table
    async addPortfolioTableRow(e) {
        const res = this.validateForm();

        if (!res)
            return;

        var t = this.state.portfolioTableStack;
        var portfolioTableStocks = this.state.portfolioTableStocks;
        let target = parseInt(this.state.stockRecord);

        const exists = await this.keyExists(e, target);
        const maxRows = 45;

        if (exists || this.state.maxNumberOfAlertTableRows >= maxRows)
            return;

        console.log('target ' + target)

        // Stocks to be displayed in the Portfolio table
        portfolioTableStocks.push(PortfolioCache.get(target))
        let pointer = portfolioTableStocks.length - 1;

        t.push(
            <tbody>
                <tr key={pointer}>
                    <td id={pointer} onClick={this.selectPortfolioTableRow}>{portfolioTableStocks[pointer].StockName.toString()}</td>
                    <td id={pointer} onClick={this.selectPortfolioTableRow}>{portfolioTableStocks[pointer].StockCode.toString()}</td>
                    <td id={pointer} onClick={this.selectPortfolioTableRow}>{this.state.shares} </td>
                    <td id={pointer} onClick={this.selectPortfolioTableRow}>{this.state.date}</td>
                    <td id={pointer} onClick={this.selectPortfolioTableRow}>{this.state.price}</td>
                </tr>
            </tbody>
        )
        // Add id with its value to map
        // key: 0..N value: alertTable
        this.map.set(pointer, target);
        // Save to Database

        console.log('NEXT')

        // Force an update
        this.setState({ maxNumberOfPortfolioRows: this.state.maxNumberOfPortfolioTableRows + 1 });
        this.setState({ portfolioTableStack: t });
        this.setState({ portfolioTableStocks: portfolioTableStocks });
        this.setState({ addPortfolioTableRowBool: true });
    }


    // Are you sure you want to remove this stock?
    removePortfolioTableRow() {
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

    setShares(value) {
        this.setState({ shares: value });
    }

    setPrice(value) {
        this.setState({ price: value });
    }

    setClearRecord(bool) {
        this.setState({ selectedRecordValue: "" });
        this.setState({ clearRecord: bool });
    }


    // select record from dropdown list
    selectRecords(e) {
        var id = new Number(e.target.id);
        this.setState({ stockRecord: id });
        this.setState({ validInput: true });

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
                let id = new Number(splitStr[0]);
                let value = splitStr[1];

                string.push(
                    <div
                        id={id}
                        class="record"
                        style={{ color: 'wheat', cursor: 'pointer' }}
                        onClick={this.selectRecords}>
                        {value}
                        <br />
                    </div>
                );
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

        const stockRecord = this.state.stockRecord;
        let heightUnits = (stockRecord / scroll);
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

        // console.log('UPDATE ' );

        for (pointer = start; pointer <= end; pointer++) {
            if (pointer === this.props.state.target)
                style = { backgroundColor: "rgb(21,100,111)" };
            else
                style = {};

            t.push(
                <tbody>
                    <tr key={pointer} style={style}>
                        <td id={pointer} onClick={this.props.selectAlertTableRow}>
                            {this.state.portfolioTableStocks[pointer].StockCode.toString()}</td>
                        <td id={pointer} onClick={this.props.selectAlertTableRow}>
                            {this.state.portfolioTableStocks[pointer].TimeStamp.toString()}</td>
                        <td id={pointer} onClick={this.props.selectAlertTableRow}>
                            {this.state.portfolioTableStocks[pointer].CurrentPrice.toString()} </td>
                        <td id={pointer} onClick={this.props.selectAlertTableRow}>
                            {this.state.portfolioTableStocks[pointer].ChangeP.toString()}</td>
                        <td id={pointer} onClick={this.props.selectAlertTableRow}>
                            {this.state.portfolioTableStocks[pointer].Volume.toString()}</td>
                    </tr>
                </tbody>);
        }

        this.setState({ portfolioTableStack: t });
    }

    // Remove row from table
    removeRow() {
        let t = [];
        let style = {};

        let pointer = 0;
        let start = 0;
        let end = this.state.portfolioTableStocks.length - 1;

        for (pointer = start; pointer <= end; pointer++) {
            //      console.log('POINTER ' + pointer + ' TARGET ' + this.props.state.target);
            t.push(
                <tbody>
                    <tr key={pointer} style={style}>
                        <td id={pointer} onClick={this.props.selectAlertTableRow}>
                            {this.state.portfolioTableStocks[pointer].StockCode.toString()}</td>
                        <td id={pointer} onClick={this.props.selectAlertTableRow}>
                            {this.state.portfolioTableStocks[pointer].TimeStamp.toString()}</td>
                        <td id={pointer} onClick={this.props.selectAlertTableRow}>
                            {this.state.portfolioTableStocks[pointer].CurrentPrice.toString()} </td>
                        <td id={pointer} onClick={this.props.selectAlertTableRow}>
                            {this.state.portfolioTableStocks[pointer].ChangeP.toString()}</td>
                        <td id={pointer} onClick={this.props.selectAlertTableRow}>
                            {this.state.portfolioTableStocks[pointer].Volume.toString()}</td>
                    </tr>
                </tbody>);
        }

        this.setState({ portfolioTableStack: t });
    }

    // Update the table
    updateTable() {
        // Get values from cache
        const pointer = 0;
        let id = 0;

        let t = <div>
            <div id="stack-wrapper">
                <div id="stack-scroll">
                    <table class="portfolioTable" aria-labelledby="tabelLabel">
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

                        {this.state.portfolioTableStack}

                    </table>
                </div>
            </div>
        </div>;
        // console.log('UPDATE ');
        this.setState({ portfolioTable: t });
    }

    // **************************************************

    render() {
        let portfolioTableHeader = <table class="portfolioTableHeader" aria-labelledby="tabelLabel">
            <thead>
                <tr>
                    <th>Stock <br /> Name</th>
                    <th>Stock <br /> Code</th>
                    <th>Date </th>
                    <th>Shares</th>
                    <th>Price</th>
                </tr>
            </thead>
        </table>;

        return (
            <div>
                <div class="dropdown-content" style={{
                    position: 'absolute'
                    , top: '315px', left: '700px', zIndex: '999'
                }}>
                    <Box
                        min-width='12.25rem'
                        width='20rem'
                        height='22rem'
                        overflowY='auto'
                        bg='#f9f9f9'
                        top='0px'
                        justifyContent='center'
                        visibility={this.state.formIsVisible}

                        backgroundColor='whiteAlpha.508'
                    >
                        <h4 style={{ position: 'absolute', color: 'black', float: 'left' }}>Add Stock </h4>
                        <Form
                            style={{ transform: "translate(10px, 60px)" }}
                            labelCol={{
                                span: 4,
                            }}
                            wrapperCol={{
                                span: 14,
                            }}
                            layout="horizontal"
                            initialValues={{
                                size: this.state.componentSize,
                            }}

                            onValuesChange={this.onFormLayoutChange}
                            size={this.state.componentSize}
                        >
                            <Form.Item label="Select"> {/* Search Content */}
                                <Search {...this} />
                            </Form.Item>
                            <Form.Item label="Date">
                                <DatePicker />
                            </Form.Item>
                            <Form.Item label="Shares">
                                <InputNumber
                                    min={0}
                                    defaultValue={0}
                                    onChange={this.setShares} />
                            </Form.Item>
                            <Form.Item label="Price">
                                <InputNumber
                                    min={0}
                                    step={0.25}
                                    defaultValue={0}
                                    onChange={this.setPrice} />
                            </Form.Item>

                            <Button style={{
                                position: 'absolute', bottom: '4px', right: '20px',
                                zIndex: '999'
                            }}
                                onClick={this.addPortfolioTableRow}
                            >Add Stock</Button>
                        </Form>
                    </Box>
                </div>

                {/* PORTFOLIO TABLE */}
                <Box
                    style={{ position: 'absolute', top: '315px', left: '100px' }}
                    //     bg='rgb(30,30,30)'
                    boxShadow='sm'
                    textAlign='center'
                    height='45px'
                    width='50rem'
                    rounded="lg"
                    margin='auto'
                    color='white'
                    zIndex='-999'>

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
                        width='52rem'
                        rounded="lg"
                        margin='auto'
                        color='white'
                        zIndex='-999'>

                        {this.state.portfolioTable}

                    </Box>
                </Box>


            </div>
        );
    }

}

