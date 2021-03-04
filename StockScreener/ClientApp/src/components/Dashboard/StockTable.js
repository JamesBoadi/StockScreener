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
        /*   this.searchDatabase = this.searchDatabase.bind(this);
           this.selectRecords = this.selectRecords.bind(this);
           this.searchRecords = this.searchRecords.bind(this);
           this.scrollBy = this.scrollBy.bind(this);
           this.scroll_ = this.scroll_.bind(this);
           this.textInput = React.createRef();
           this.loadFromCache = this.loadFromCache.bind(this);
           this.scrollPosition = this.scrollPosition.bind(this);
           this.scrollDown = this.scrollDown.bind(this);
           this.selectRow = this.selectRow.bind(this);
           this.createTable = this.createTable.bind(this);*/

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
            tb2_count: 0,
            tb2_numberOfClicks: []
        };
    }


    render() {
        return (
            <div>
                {/* STOCK DISPLAY */}
                <Box
                    style={{ position: 'absolute', top: '320px', left: '60px' }}
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

                {/*  <StockTableTwo
                                {...this} // Pass all props to child
                                scrollPosition={this.scrollPosition}
                                loadFromCache={this.loadFromCache}
                                findRecord={this.state.validInput}
                                id={this.state.stockRecord}
                  />      */}

            </div>

        )

    }

}
