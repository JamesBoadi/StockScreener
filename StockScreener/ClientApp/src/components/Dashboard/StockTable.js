import React, { Component, useState, useContext, cloneElement } from 'react';
import {
    Box, Button, NumberInput,
    NumberInputField, NumberInputStepper,
    NumberIncrementStepper, NumberDecrementStepper,
    Input, InputGroup, InputRightElement, InputLeftElement,
    Menu, MenuButton, MenuList, MenuItem, MenuItemOption,
    MenuGroup, MenuOptionGroup, MenuIcon, MenuCommand, MenuDivider
} from '@chakra-ui/react';
import { StockTableOne } from './StockTableOne';
import { StockTableTwo } from './StockTableTwo';
import { AlertTable } from './AlertTable';
import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils';

// https://packagecontrol.io/packages/CSS%20Format
export class StockTable extends Component {

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

        let style = { color: "white;" };

        this.state = {
            green: false,
            red: false,
            priceChangeUp: false,
            validInput: false,
            display: [],
            stockRecord: 0,
            scroll: 0,
            query: {}
        };
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


    shouldComponentUpdate(nextProps) { 
        if (nextProps.value !== this.props.value) { 
          
            return true; 
        
        } else { 
          return false; 
        } 
      } 
  
    // Scroll to the position in the table
    componentDidUpdate() {
        const scroll = this.scrollBy();
        if (this.state.validInput === true) {
            this.textInput.current.scrollTop = scroll;         
            this.setState({ validInput: false })
        }
    }

    componentDidMount() {
        setInterval(() => {
            window.location.reload();
        }, 20000000);

        this.setState({scroll: this.scrollBy()})
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

        console.log(stockRecord);

        let heightUnits = (stockRecord / scroll);

        let count = height * heightUnits;

        return count;
    }

    scroll_()
    {
       // console.log(this.textInput.current.scrollTop);

        this.setState({scroll: this.textInput.current.scrollTop})

        console.log("GD " +  this.state.scroll);
    }

    loadFromCache()
    {   
        let units = (this.state.scroll);
        return (units > 450); 
    }

    scrollPosition()
    {
        return (this.state.scroll);
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
                <div id="tableContainer">
                    {/* STOCK DISPLAY */}
                    <Box
                        style={{ position: 'absolute', top: '130px', left: '60px' }}
                        bg='rgb(40,40,40)'
                        boxShadow='sm'
                        height='305px'
                        width='62rem'
                        rounded="lg"
                        margin='auto'
                        zIndex='0'>

                        <h1 style={{ position: 'relative', textAlign: 'center', color: 'white' }}>AAPL (Apple Inc)</h1>
                        <h3 style={{ position: 'relative', textAlign: 'center', color: 'white' }}>Price: 286.7</h3>
                        <h4 style={{ position: 'relative', top: '30px', left: '0px', color: 'white' }}>Sector: Technology</h4>
                        <h4 style={{ position: 'relative', top: '30px', left: '0px', color: 'white' }}>Message: Possible Reversal</h4>

                        {/* Entry: Largest gap in either shorts or calls (Calculate in c#) */}
                        <h4 style={{ position: 'relative', top: '35px', left: '0px', color: 'white' }}>Possible Entry:
                        </h4>

                        <NumberInput
                            style={{ left: '170px' }}
                            size="md" maxW={70} defaultValue={15} min={10} max={20}>
                            <NumberInputField />
                            <NumberInputStepper >
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>

                        <h4 style={{ position: 'relative', top: '10px', left: '0px', color: 'white' }}>Take Profit: 270.6</h4>

                        <Button id="GreenArrow" style={{
                            position: 'absolute', top: '60px', right: '180px'
                            , visibility: (!this.state.red && this.state.green
                                && this.state.priceChangeUp) ? "visible" : "hidden"
                        }} colorScheme="blue" />

                        <Button id="RedArrow" style={{
                            position: 'absolute', top: '60px', right: '90px',
                            visibility: (this.state.red && !this.state.green
                                && !priceChangeUp) ? "visible" : "hidden"
                        }} colorScheme="blue" />

                        <Button style={{ position: 'absolute', bottom: '0px', right: '90px' }}>Add to Alerts</Button>
                    </Box>

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

                                        {this.state.display}

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

                            <StockTableTwo
                                scrollPosition={this.scrollPosition} 
                                loadFromCache={this.loadFromCache}
                                findRecord={this.state.validInput}
                                id={this.state.stockRecord}
                            />
                        </Box>
                    </Box>

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

                            <AlertTable />
                        </Box>
                    </Box>

                </div>
            </div>
        );

    }

}
