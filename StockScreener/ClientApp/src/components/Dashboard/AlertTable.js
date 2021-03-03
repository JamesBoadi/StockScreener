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

export class AlertTable extends Component {
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
        this.getDisplay = this.getDisplay.bind(this);
        let style = { color: "white;" };
        this.timeout = null;

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

            isScrolled: false,
            scrollUp_: 0,
            scrollDown_: 0,
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

    componentDidUpdate(snapshot) {
        // Update table
        if (this.state.tb2_count === 1 && snapshot !== null) {

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
        }
    }

    // Prevent unecerssary updates
    getSnapshotBeforeUpdate(prevProps, prevState) {
        if (prevState.tb2_scrollPosition !== this.state.tb2_scrollPosition
            || this.state.isScrolled) {
            this.newTable()
            return (this.state.tb2_scrollPosition !== undefined
                || this.state.tb2_scrollPosition === null)
                ? 100 : this.state.tb2_scrollPosition;
        }
    }

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

            this.setState({ start: (this.state.tb2_scrollPosition < 1) ?
                0 : this.state.tb2_scrollPosition * 50
            });

            this.setState({ isScrolled: true });
            this.setState({ tb2_count: 1 });
            console.log('Scroll Up')
          
        }
    }

    /* Select row from the table
       Triggers re-rendering of table */
    selectRow(e) {
        var target = new Number(e.target.id);
        var style = {};

        console.log('target ' + target)
       
        let id;

        let start = this.state.tb2_scrollPosition * 50;
        let end = (this.state.tb2_scrollPosition * 50) + 50;

        for (id = start; id < end; id++) {
            if (id === target && (target !== null || target !== undefined))
                style = { backgroundColor: "rgb(0,11,34)" };
            else
                style = {};

            // Get values from cache
            let list = this.props.state.cache.get(id.toString());

            this.state.tb2_stack.push(
                <tbody>
                    <tr key={id} style={style}>
                        <td id={id} onClick={this.selectRow}>{list.StockCode.toString()}</td>
                        <td id={id} onClick={this.selectRow}>{list.TimeStamp.toString()}</td>
                        <td id={id} onClick={this.selectRow}>{list.CurrentPrice.toString()} </td>
                        <td id={id} onClick={this.selectRow}>{list.High.toString()}</td>

                        <td id={id} onClick={this.selectRow}>{list.Low.toString()}</td>
                        <td id={id} onClick={this.selectRow}>{list.ProfitLoss.toString()}</td>
                        <td id={id} onClick={this.selectRow}>{list.ProfitLoss_Percentage.toString()}</td>
                        <td id={id} onClick={this.selectRow}>{list.Volume.toString()}</td>
                    </tr>
                </tbody>)
        }

        this.setState({ tb2_stack: this.state.tb2_stack });
        this.setState({ tb2_count: 1 });
    }

    newTable() {
        let id;
        let start = this.state.tb2_scrollPosition * 50;
        let end = (this.state.tb2_scrollPosition * 50) + 50;
        var t = [];

            console.log( start + ' ' + end);

        for (id = start; id < end; id++) {

            // Get values from cache
            let list = this.props.state.cache.get(id.toString());

            t.push(
                <tbody>
                    <tr key={id}>
                        <td id={id} onClick={this.selectRow}>{list.StockCode.toString()}</td>
                        <td id={id} onClick={this.selectRow}>{list.TimeStamp.toString()}</td>
                        <td id={id} onClick={this.selectRow}>{list.CurrentPrice.toString()} </td>
                        <td id={id} onClick={this.selectRow}>{list.High.toString()}</td>

                        <td id={id} onClick={this.selectRow}>{list.Low.toString()}</td>
                        <td id={id} onClick={this.selectRow}>{list.ProfitLoss.toString()}</td>
                        <td id={id} onClick={this.selectRow}>{list.ProfitLoss_Percentage.toString()}</td>
                        <td id={id} onClick={this.selectRow}>{list.Volume.toString()}</td>
                    </tr>
                </tbody>);
        }
        this.setState({ tb2_stack: t });
    }

    updateTable() {
        // Get values from cache
        let list = this.props.state.cache.get(this.state.start.toString());

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
                                <th>{list.ProfitLoss.toString()}</th>
                                <th>{list.ProfitLoss_Percentage.toString()}</th>
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

    createTable() {
        var table = [];
        let id;
        let length =  this.props.state.cachedRows.length;
        
        for (id = 0; id < length; id++) {
            // Get values from cache
            let list = this.props.state.cache.get(id.toString());

            this.state.tb2_stack.push(
                this.props.state.cachedRows[id]
               );
        }
    }

   

    render() {
        let alertTableHeader = <table class="alertTableHeader" aria-labelledby="tabelLabel">
            <thead>
                <tr>
                    <th>Stock <br /> Name</th>
                    <th>Alert <br /> Time</th>
                    <th>Price</th>
                    <th>P / L</th>
                    <th>Volume</th>
                </tr>
            </thead>
        </table>;

        return (
            <div>
                {/* ALERT TABLE */}
                <Box
                    style={{ position: 'absolute', top: '125px', left: '1070px' }}
                    //     bg='rgb(30,30,30)'
                    boxShadow='sm'
                    textAlign='center'
                    height='45px'
                    width='50rem'
                    rounded="lg"
                    margin='auto'
                    color='white'
                    zIndex='999'>

                    <InputGroup>
                        <Input style={{ position: 'absolute', top: '0px', right: '16.5px', height: '29px' }}
                            placeholder="Search " />
                        <InputRightElement children={<img id="searchIcon" />} />
                    </InputGroup>

                    {alertTableHeader}

                    <Box
                        style={{
                            position: 'absolute',
                            overflowY: 'auto',
                            top: '45px'
                        }}

                        overflowX='hidden'
                        //  bg='rgb(30,30,30)'
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