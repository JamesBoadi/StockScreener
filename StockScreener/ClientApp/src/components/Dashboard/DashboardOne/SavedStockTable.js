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

        this.populateTable = this.populateTable.bind(this);
        this.initialiseTable = this.initialiseTable.bind(this);

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

            // Alert Table States
            alertTableStack: [],
            alertTable: [],
            isScrolled: false,
            scrollUp_: 0,
            scrollDown_: 0,

            populateTable: false,
            target: null


        };
    }

    componentDidMount() {



      //  this.populateTable();

        /* this.createTable()
         this.updateTable()
 
         setInterval(() => {
             window.location.reload();
         }, 20000000);
 
         this.setState({ scroll: this.scrollBy() })*/
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.populateTable) {
            this.newTable();
            this.setState({ start: this.state.tb2_scrollPosition * 50 }, () => {
                this.updateTable(this.state.start);
            });
         
            this.setState({ populateTable: false });
        }

        if (this.props.state.addAlertTableRowBool) {
            //console.log('mounted  ' + this.state.alertTableStack.length);
            this.newTable();
            this.setState({ start: this.state.tb2_scrollPosition * 50 }, () => {
                this.updateTable(this.state.start);
            });

            this.props.setAlertTableRowBool(false);
        }
        if (this.props.state.removeAlertTableRowBool) {
            this.removeRow();
            this.setState({ start: this.state.tb2_scrollPosition * 50 }, () => {
                this.updateTable(this.state.start);
            });
            window.alert('This stock has been removed ');
            this.props.setRemoveAlertTableRowBool(false);
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
        if (this.props.state.addAlertTableRowBool !== nextProps.addAlertTableRowBool) {
            return true;
        } else if (this.props.state.populateTable !== nextState.populateTable) {
            return true;
        }
        return false;
    }

    async populateTable() {
        var t = [];
        await fetch('getallnotifications')
            .then(response => response.json())
            .then(response =>
                this.initialiseTable(response)
            )
            .catch(error => {
                console.log("error " + error) // 404
                return;
                }
            );
    }

    // From database
    initialiseTable(response) {
     /*   var t = [];
        for (var i = 0; i < response.length; i++) {

            const item = JSON.parse(response[i]);
            const pointer = parseInt(item.Id);

            t.push(
                <tbody>
                    <tr key={pointer}>
                        <td id={pointer} onClick={this.props.selectAlertTableRow}>
                            {item.StockCode.toString()}</td>
                        <td id={pointer} onClick={this.props.selectAlertTableRow}>
                            {item.TimeStamp.toString()}</td>
                        <td id={pointer} onClick={this.props.selectAlertTableRow}>
                            {item.CurrentPrice.toString()} </td>
                        <td id={pointer} onClick={this.props.selectAlertTableRow}>
                            {item.ChangeP.toString()}</td>
                        <td id={pointer} onClick={this.props.selectAlertTableRow}>
                            {item.Volume.toString()}</td>
                    </tr>
                </tbody>);
        }

        this.setState({ alertTableStack: t });
        this.setState({ populateTable: true });*/
    }

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

            this.setState({
                start: (this.state.tb2_scrollPosition < 1) ?
                    0 : this.state.tb2_scrollPosition * 50
            });

            this.setState({ isScrolled: true });
            this.setState({ tb2_count: 1 });
            console.log('Scroll Up');
        }
    }

    // Create a new table
    newTable() {
        var t = [];
        let style = {};
        let pointer;
        let start = 0;
        let alertTableStacks = this.state.alertTableStack;
        let end = this.props.state.alertTableStocks.length - 1;

        //console.log('target ' + this.props.state.target + ' length  ' + end);
        // console.log('UPDATE ' );

        for (pointer = start; pointer <= end; pointer++) {
            if (pointer === this.props.state.target) {
                style = { backgroundColor: "rgb(21,100,111)" };
                console.log('Click on this ' + pointer);
            }
            else
                style = {};

                t.push(
                    <tbody>
                        <tr key={pointer} style={style}>
                            <td id={pointer} onClick={this.props.selectAlertTableRow}>
                                {this.props.state.alertTableStocks[pointer].StockCode.toString()}</td>
                            <td id={pointer} onClick={this.props.selectAlertTableRow}>
                                {this.props.state.alertTableStocks[pointer].TimeStamp.toString()}</td>
                            <td id={pointer} onClick={this.props.selectAlertTableRow}>
                                {this.props.state.alertTableStocks[pointer].CurrentPrice.toString()} </td>
                            <td id={pointer} onClick={this.props.selectAlertTableRow}>
                                {this.props.state.alertTableStocks[pointer].ChangeP.toString()}</td>
                            <td id={pointer} onClick={this.props.selectAlertTableRow}>
                                {this.props.state.alertTableStocks[pointer].Volume.toString()}</td>
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
        let end = this.props.state.alertTableStocks.length - 1;

        for (pointer = start; pointer <= end; pointer++) {
            //      console.log('POINTER ' + pointer + ' TARGET ' + this.props.state.target);
            t.push(
                <tbody>
                    <tr key={pointer} style={style}>
                        <td id={pointer} onClick={this.props.selectAlertTableRow}>
                            {this.props.state.alertTableStocks[pointer].StockCode.toString()}</td>
                        <td id={pointer} onClick={this.props.selectAlertTableRow}>
                            {this.props.state.alertTableStocks[pointer].TimeStamp.toString()}</td>
                        <td id={pointer} onClick={this.props.selectAlertTableRow}>
                            {this.props.state.alertTableStocks[pointer].CurrentPrice.toString()} </td>
                        <td id={pointer} onClick={this.props.selectAlertTableRow}>
                            {this.props.state.alertTableStocks[pointer].ChangeP.toString()}</td>
                        <td id={pointer} onClick={this.props.selectAlertTableRow}>
                            {this.props.state.alertTableStocks[pointer].Volume.toString()}</td>
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
                    style={{ position: 'absolute', top: '315px', left: '1070px', zIndex: 888 }}
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