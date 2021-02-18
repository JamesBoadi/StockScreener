import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { render } from 'react-dom';
import { FetchData } from './DashboardOne/FetchData';
import {
    Box, Button, NumberInput,
    NumberInputField, NumberInputStepper,
    NumberIncrementStepper, NumberDecrementStepper,
    Input, InputGroup, InputRightElement, InputLeftElement,
    Menu, MenuButton, MenuList, MenuItem, MenuItemOption,
    MenuGroup, MenuOptionGroup, MenuIcon, MenuCommand, MenuDivider
} from '@chakra-ui/react';

// Fetch data for dash board one
export class StockTableTwo extends Component {

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
        this.selectRow = this.selectRow.bind(this);
        this.createTable = this.createTable.bind(this);
        this.newTable = this.newTable.bind(this);
        this.returnTable = this.returnTable.bind(this);

        this.getDisplay = this.getDisplay.bind(this);

        let style = { color: "white;" };

        this.state = {
            green: false,
            red: false,
            priceChangeUp: false,
            validInput: false,
            display: [],
            stockRecord: 0,
            scroll: 0,
            query: {},

            tb2: [],
            tb2_temp: [],
            tb2_scrollPosition: 2,
            tb2_updateTable: false,
            tb2_stack: [], // Render 100 elements per scroll
            tb2_cache: [],
            tb2_count: 1,
            tb2_numberOfClicks: []
        };
    }

    componentDidMount() {
        this.createTable()
        this.updateTable()

        setInterval(() => {
            window.location.reload();
        }, 20000000);

        this.setState({ scroll: this.scrollBy() })
    }

    componentDidUpdate() {
        // Update position
        if (this.state.tb2_count === 1) {
            this.updateTable();
            this.setState({ tb2_count: 0 });
        }
        // Scroll to the position in the table
        const scroll = this.scrollBy();
        if (this.state.validInput === true) {
            this.textInput.current.scrollTop = scroll;
            this.setState({ validInput: false })
        }


    }


    /*   this.setState({ tb2_count: 1 });
 
       if (this.state.tb2_count === 1) {
 
           this.newTable()
           this.setState({ tb2_count: 0 });
       }       
   }
 
 */

    // Communicate with c# controller https://stackoverflow.com/questions/46946380/fetch-api-request-timeout
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
        return (units > 450) ? 1 : (units < 4) ? -1 : 0;
    }

    scrollPosition() {
        return (this.state.scroll);
    }

    // Render table while scrolling down
    scrollToPosition() {
        console.log(this.state.scroll)

        if (this.loadFromCache() === 1) {
            this.setState({ tb2_stack: this.state.tb2_cache });

            // Scroll Down
            this.setState({ scrollPosition: this.state.tb2_scrollPosition + 1 })

            this.setState({ tb2_count: 1 });

            console.log('Render 1')
        }
        else if (this.loadFromCache() === -1) {
            this.setState({ tb2_stack: this.state.tb2_cache });

            // Scroll Up
            this.setState({
                tb2_scrollPosition: (this.state.tb2_scrollPosition <= 0) ?
                    0 : this.state.tb2_scrollPosition - 1
            })

            this.setState({ tb2_count: 1 });

            console.log('Render 2')
        }
        else {
            let id;

            let start = this.state.tb2_scrollPosition * 50;
            let end = (this.state.tb2_scrollPosition * 50) + 50;

            this.setState({ tb2_cache: [] }); // Use shallow compare

            for (id = start; id < end; id++) {
                this.state.tb2_cache.push(
                    <tbody>
                        <tr key={id}>
                            <td id={id} onClick={this.selectRow}>{id}</td>
                            <td id={id} onClick={this.selectRow}>{id}</td>
                            <td id={id} onClick={this.selectRow}>{id}</td>
                            <td id={id} onClick={this.selectRow}>{id}</td>

                            <td id={id} onClick={this.selectRow}>{id}</td>
                            <td id={id} onClick={this.selectRow}>{id}</td>
                            <td id={id} onClick={this.selectRow}>{id}</td>
                            <td id={id} onClick={this.selectRow}>{id}</td>
                        </tr>
                    </tbody>);
            }
        }
    }

    /* Select row from the table
       Triggers re-rendering of table */
    selectRow(e) {
        var target = new Number(e.target.id);
        var style = {};

        console.log('target ' + target)
        let mod = 0;
        let id;

        let start = this.state.tb2_scrollPosition * 50;
        let end = (this.state.tb2_scrollPosition * 50) + 50;

        for (id = start; id < end; id++) {
            if (id === target && (target !== null || target !== undefined))
                style = { backgroundColor: "rgb(0,11,34)" };
            else
                style = {};

            this.state.tb2_stack.push(
                <tbody>
                    <tr key={id} style={style}>
                        {/* Replace with map, import array that CONTAINS stock information [[1],[2]].... */}
                        <td id={id} onClick={this.selectRow}>{id + mod}</td>
                        <td id={id} onClick={this.selectRow}>{id + mod}</td>
                        <td id={id} onClick={this.selectRow}>{id + mod}</td>
                        <td id={id} onClick={this.selectRow}>{id + mod}</td>

                        <td id={id} onClick={this.selectRow}>{id + mod}</td>
                        <td id={id} onClick={this.selectRow}>{id + mod}</td>
                        <td id={id} onClick={this.selectRow}>{id + mod}</td>
                        <td id={id} onClick={this.selectRow}>{id + mod}</td>
                    </tr>
                </tbody>)
        }

        //   this.setState({ tb2_stack: this.state.tb2_stack });
        this.setState({ tb2_count: 1 });
    }

    returnTable() {
        let target = <div>
            <div id="stack-wrapper">
                <div id="stack-scroll">
                    <table class="stockTableTwo" aria-labelledby="tabelLabel">
                        <thead>
                            <tr>
                                <th>1</th>
                                <th>1</th>
                                <th>1</th>
                                <th>1</th>

                                <th>1</th>
                                <th>1</th>
                                <th>1</th>
                                <th>1</th>
                            </tr>
                        </thead>

                        {this.state.tb2_stack}

                    </table>
                </div>
            </div>
        </div>;

        this.setState({ tb2: target });
    }

    newTable() {
    }

    updateTable() {
        let t = <div>
            <div id="stack-wrapper">
                <div id="stack-scroll">
                    <table class="stockTableTwo" aria-labelledby="tabelLabel">
                        <thead>
                            <tr>
                                <th>1</th>
                                <th>1</th>
                                <th>1</th>
                                <th>1</th>

                                <th>1</th>
                                <th>1</th>
                                <th>1</th>
                                <th>1</th>
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
        let mod = 0;

        for (id = 0; id < 50; id++) {
            this.state.tb2_stack[[id]] =
                <tbody>
                    <tr key={id}     >
                        {/* Replace with map, import array that CONTAINS stock information [[1],[2]].... */}
                        <td id={id} onClick={this.selectRow}>{id + mod}</td>
                        <td id={id} onClick={this.selectRow}>{id + mod}</td>
                        <td id={id} onClick={this.selectRow}>{id + mod}</td>
                        <td id={id} onClick={this.selectRow}>{id + mod}</td>

                        <td id={id} onClick={this.selectRow}>{id + mod}</td>
                        <td id={id} onClick={this.selectRow}>{id + mod}</td>
                        <td id={id} onClick={this.selectRow}>{id + mod}</td>
                        <td id={id} onClick={this.selectRow}>{id + mod}</td>
                    </tr>
                </tbody>
        }
    }

    render() {
        let stockTableTwoHeader = <table class="stockTableTwoHeader" aria-labelledby="tabelLabel">
            <thead>
                <tr>
                    <th>Stock Name</th>
                    <th>Time</th>
                    <th>Price</th>
                    <th>High</th>
                    <th>Low</th>
                    <th>P / L</th>
                    <th>P / L %</th>
                    <th>Volume</th>
                </tr>
            </thead>
        </table>;

        let table = <div>
            <div id="stack-wrapper">
                <div id="stack-scroll">
                    <table class="stockTableTwo" aria-labelledby="tabelLabel">
                        <thead>
                            <tr>
                                <th>1</th>
                                <th>1</th>
                                <th>1</th>
                                <th>1</th>

                                <th>1</th>
                                <th>1</th>
                                <th>1</th>
                                <th>1</th>
                            </tr>
                        </thead>

                        {this.state.tb2_stack}

                    </table>
                </div>
            </div>
        </div>;


        return (
            <div>

                {/* STOCK TABLE TWO */}
                <Box
                    style={{ position: 'absolute', top: '450px', left: '60px' }}
                    bg='rgb(30,30,30)'
                    boxShadow='sm'
                    textAlign='center'
                    height='45px'
                    width='60rem'
                    rounded="lg"
                    margin='auto'
                    zIndex='999'
                    color='white'>

                    <div class="stockTableTwoMenu">
                        <div class="dropdown">

                            <InputGroup>
                                <Input
                                    style={{
                                        position: 'absolute', top: '0px',
                                        right: '16.5px', height: '29px',
                                        minWidth: '12.25rem'
                                    }}

                                    onInput={this.searchDatabase}
                                    //   display={display}
                                    placeholder="Search "
                                />

                                <InputRightElement children={<img id="searchIcon" />} />
                            </InputGroup>

                            <div class="dropdown-content">
                                <Box
                                    min-width='17.26rem'
                                    width='17.26rem'
                                    height='80px'
                                    overflowY='auto'
                                    bg='#f9f9f9'
                                    top='0px'>

                                    {this.getDisplay()}

                                </Box>
                            </div>
                        </div>
                    </div>

                    {stockTableTwoHeader}


                    <Box
                        style={{
                            position: 'absolute',
                            overflowY: 'auto',
                            top: '45px'
                        }}

                        onScroll={this.scroll_}
                        ref={this.textInput}
                        overflowX='hidden'
                        bg='rgb(30,30,30)'
                        boxShadow='sm'
                        textAlign='center'
                        height='800px'
                        width='62rem'
                        rounded="lg"
                        color='white'
                        zIndex='-999'>

                        {this.state.tb2}

                        {/*this.state.tableContent.map((item) =>  )*/}



                    </Box>
                </Box>
            </div>
        );
    }



}