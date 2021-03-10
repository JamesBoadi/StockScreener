import React, { Component, PureComponent } from 'react';
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

import { AlertTable } from './AlertTable';
import * as cache from 'cache-base';


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
        this.scrollToPosition = this.scrollToPosition.bind(this);

        this.freezeScrollPosition = this.freezeScrollPosition.bind(this);

        this.triggerAnimation = this.triggerAnimation.bind(this);

        this.selectRow = this.selectRow.bind(this);
        this.createTable = this.createTable.bind(this);
        this.newTable = this.newTable.bind(this);
        this.getDisplay = this.getDisplay.bind(this);
        this.getUnits = this.getUnits.bind(this);
        let style = { color: "white;" };
        this.timeout = null;
        this.cache = null;

        this.initialiseSearch = false;


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

            isSelected: false,

            lock: false,
            target: 0,

            // Rows to add from stock table to alert table
            cachedRows: []
        };
    }

    componentDidMount() {
        this.createTable()
        this.updateTable(15)
        // this.setState({ scroll: (this.textInput.current.scrollTop) ?? 1 })

        // Update Table 
        this.intervalID_ = setInterval(() => {
            // Force an update
         /*   const scroll = this.scrollBy();
            this.setState({
                tb2_scrollPosition: (this.state.tb2_scrollPosition <= 15) ? this.getUnits(scroll) : 15
            }, () => {
                this.newTable()
                this.setState({ start: this.state.tb2_scrollPosition * 50 })
                this.updateTable(this.state.start)
                this.forceUpdate()
            });

            if (this.state.start === 0)
                this.textInput.current.scrollTop = 10;
            else
                this.textInput.current.scrollTop = 25;
            //  this.setState({ isUpdating: true });*/


            const scroll = this.scrollBy();
            this.setState({
                tb2_scrollPosition: (this.state.tb2_scrollPosition <= 15) ? this.getUnits(scroll) : 15
            }, () => {
                this.triggerAnimation("rgba(17, 189, 80, 0.897)")
                this.setState({ start: this.state.tb2_scrollPosition * 50 })
                this.updateTable(this.state.start)
                this.forceUpdate()
            });
            
        }, 5000);

        setInterval(() => {
            window.location.reload();
        }, 20000000);

        this.setState({ scroll: this.scrollBy() })
    }

    componentWillUnmount() {
        // Clear the interval right before component unmount
        clearInterval(this.intervalID_);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const scroll = this.scrollBy();

        /*     if (this.initialiseSearch) {
                 this.setState({ validInput: true });
                 this.forceUpdate();
     
                 var id = new Number(1);
                 this.setState({ stockRecord: id });
     
                 this.setState({
                     tb2_scrollPosition: (this.state.tb2_scrollPosition <= 15) ? this.getUnits(scroll) : 15
                 }, () => {
                     this.newTable()
                     this.setState({ start: this.state.tb2_scrollPosition * 50 })
                     this.updateTable(this.state.start)
                 });
     
                 this.initialiseSearch = false;
             }*/
        // Update table
        if (this.state.isSelected) {
            this.newTable()
            this.setState({ start: this.state.tb2_scrollPosition * 50 }, () => {
                this.updateTable(this.state.start)
                this.forceUpdate()
            });

            this.setState({ isSelected: false });
        }
        else if (prevState.tb2_count === 1) {
            this.newTable()
            this.setState({ start: this.state.tb2_scrollPosition * 50 }, () => {
                this.updateTable(this.state.start)
            });

            if (this.state.start === 0)
                this.textInput.current.scrollTop = 10;
            else
                this.textInput.current.scrollTop = 25;

            // console.log('T is updated');
            this.setState({ tb2_count: 0 })

        } else if (this.state.validInput) {

            this.setState({
                tb2_scrollPosition: (this.state.tb2_scrollPosition <= 15) ? this.getUnits(scroll) : 15
            }, () => {
                this.newTable()
                this.setState({ start: this.state.tb2_scrollPosition * 50 })
                this.updateTable(this.state.start)
            });

            if (this.state.start === 0)
                this.textInput.current.scrollTop = 10;
            else
                this.textInput.current.scrollTop = 25;

            //  console.log('2 + start ' + this.state.start + 'scrollPosition ' + this.state.tb2_scrollPosition)

            this.setState({ validInput: false });
            this.setState({ queryRes: false });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.validInput || this.state.queryRes
            || this.state.isUpdating === false || 
            this.state.isSelected !== nextState.isSelected
            //  nextState.validInput || nextState.queryRes
        )
            return true;
        return false;
    }

    /*
    getSnapshotBeforeUpdate(prevProps, prevState) {
            if (prevState.tb2_scrollPosition !== this.state.tb2_scrollPosition
                && this.state.isScrolled) {
                    setTimeout(() => {
                this.newTable()
                this.updateTable()
                return (this.state.tb2_scrollPosition !== undefined
                    || this.state.tb2_scrollPosition === null)
                    ? 100 : this.state.tb2_scrollPosition;  }, 800);
            }
    } */

    // Communicate with c# controller https://stackoverflow.com/questions/46946380/fetch-api-request-timeout
    async searchDatabase(e) {
        // e.preventDefault();
        let input = new String(e.target.value);

        if (input.length < 1) {
            this.setState({ queryRes: false }),
                this.setState({ display: "No Stocks Found" });
        }
        // Buggy, fix nulls
        if (!(!input || /^\s*$/.test(input))) {
            await fetch('test/'.concat(input))
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

    // select record from dropdown list
    selectRecords(e) {
        this.setState({ validInput: true });
        this.forceUpdate();

        var id = new Number(e.target.id);
        this.setState({ stockRecord: id });

        const scroll = this.scrollBy();
        this.setState({
            tb2_scrollPosition: (this.state.tb2_scrollPosition <= 15) ? this.getUnits(scroll) : 15
        }, () => {
            this.newTable()
            this.setState({ start: this.state.tb2_scrollPosition * 50 })
            this.updateTable(this.state.start)

        });

    }

    getUnits(scroll) {
        let units = parseFloat((((scroll / 800) / 2) % 1).toFixed(2));
        let integer = Math.trunc(((scroll / 800) / 2));

        //     units = (integer - 1 <= 0.5) ? 0 : integer;
        // Get Integer part
        if (units < 0.4)
            units = integer;
        else if (units > 0.4 && units < 0.7)
            units = integer + 0.5;
        else
            units = integer + 1;

        return units;
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

    // Units to scroll by to find record in search stocks
    scrollBy() {
        const height = 790;
        const scroll = 33;

        const stockRecord = this.state.stockRecord;
        let heightUnits = (stockRecord / scroll);
        let count = height * heightUnits;

        return count;
    }

    async freezeScrollPosition(e) {
        this.setState({ scroll: this.textInput.current.scrollTop })
        const result = await this.scroll_(e);
        if (result == "resolved") {

            clearInterval(this.intervalID);
        }
        
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
                tb2_scrollPosition: (this.state.tb2_scrollPosition <= 15) ?
                    this.state.tb2_scrollPosition + 0.5 : 15
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
        var target = new Number(e.target.id);
        this.setState({ target: target });
        //  console.log('target ' + target)
        let mod = 0;
        let id;

        if (this.state.tb2_scrollPosition === 0)
            mod = 0;
        else
            mod = 15;

        let start = (this.state.tb2_scrollPosition * 50) - mod;
        let end = (this.state.tb2_scrollPosition * 50) + 50;

        for (id = start; id < end; id++) {
            // Get values from cache this.state.tb2_stack
            let list = this.props.cache.get(id.toString());

            if (id == target) {

                array.push(
                    <tbody key={id} >
                        <tr style={{ color: "green", backgroundColor: "rgb(21,100,111)" }}>
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

            else {
                array.push(
                    <tbody key={id}>
                        <tr >
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
        }

        this.setState({ tb2_stack: array });
        this.setState({ isSelected: true });
        
        // Send Information to Display Stock
        this.props.selectStockTableRow(e);
    }

    newTable() {
        let id;
        let mod = 0;

        if (this.state.tb2_scrollPosition === 0)
            mod = 0;
        else
            mod = 15;

        let start = (this.state.tb2_scrollPosition * 50) - mod;
        let end = (this.state.tb2_scrollPosition * 50) + 50;
        var array = [];
        let style = {};

        // Use shallow compare
        for (id = start; id < end; id++) {
            if (id == this.state.target){
                style = { color: "green", backgroundColor: "rgb(21,100,111)" };
            }
            else
                style = {};
               
            // Get values from cache
            let list = this.props.cache.get(id.toString());
            //  console.log( 'WORK WORK ' + id);

            array.push(
                <tbody key={id} style={style}>
                    <tr >
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

        this.setState({ tb2_stack: array });
    }

    updateTable(start) {
        let mod = 0;

        if (this.state.tb2_scrollPosition === 0)
            mod = 0;
        else
            mod = 15;

        start = (start <= 15 || (start === undefined || start === null)) ? 0 : start - mod;

        //   console.log(start + ' start')

        // Get values from cache
        let list = this.props.cache.get(start.toString());

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

    triggerAnimation(color) {
        let id;
        let mod = 0;

        if (this.state.tb2_scrollPosition === 0)
            mod = 0;
        else
            mod = 15;

        let start = (this.state.tb2_scrollPosition * 50) - mod;
        let end = (this.state.tb2_scrollPosition * 50) + 50;
        var array = [];
        let style = {};

        // Use shallow compare  
        for (id = start; id < end; id++) {
            if (id == this.state.target){
                style = {  transition: "background-color 4000ms linear", backgroundColor: color };
            }
            else
                style = {};
               
            // Get values from cache
            let list = this.props.cache.get(id.toString());
            //  console.log( 'WORK WORK ' + id);

            array.push(
                <tbody key={id} style={style}>
                    <tr >
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

        this.setState({ tb2_stack: array });
    }

    createTable() {
        var table = [];
        let id;

        for (id = 0; id < 50; id++) {

            // Get values from cache
            let list = this.props.cache.get(id.toString());


            this.state.tb2_stack.push(
                <tbody key={id}>
                    <tr>
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

        return (
            <div>

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