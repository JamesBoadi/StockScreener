import React, { Component, useState, useContext } from 'react';
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

// https://packagecontrol.io/packages/CSS%20Format
const StockTable = props => {
    const [green, setGreen] = useState(false);
    const [red, setRed] = useState(true);
    const [priceChangeUp, setPriceChangeUp] = useState(false);

    const [validInput, setValidInput] = useState(true);
    const [display, setDisplay] = useState({ display: 'block' });

    async function searchDatabase(e) {

        let input = new String(e.target.value);
        console.log(input)

        // Communicate with c# controller
        await fetch('test/'.concat(input))
            .then(response => response.text())
            .then(data =>

                console.log(data)


                


                );

        // console.log("response "+response.message);

        /*   let result = 'null';
           // If the input does not exist
           if (result.equals('null')) {
               setValidInput(false);
               setDisplay({ display: 'none' });
           }
           else {
               setValidInput(true);
               setDisplay({ display: 'block' });
           }*/
    }

    setInterval(() => {
        window.location.reload();
    }, 23000);



    let stockTableOneHeader = <table class="stockTableOneHeader" aria-labelledby="tabelLabel">
        <thead>
            <tr>
                <th>Time</th>
                <th>Stock Name</th>
                <th>Detect Price</th>
                <th>Last Price</th>
                <th>Scalp Status</th>
                <th>Vol Diff (x100)</th>
                <th>Scalp Status</th>
                <th>TP price</th>
                <th>Alert Status</th>
                <th>Catalyst</th>
                <th>Sector</th>
            </tr>
        </thead>
    </table>;

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
                <Box
                    style={{ position: 'absolute', top: '85px', left: '60px' }}
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
                        , visibility: (!red && green && priceChangeUp) ? "visible" : "hidden"
                    }} colorScheme="blue" />

                    <Button id="RedArrow" style={{
                        position: 'absolute', top: '60px', right: '90px',
                        visibility: (red && !green && !priceChangeUp) ? "visible" : "hidden"
                    }} colorScheme="blue" />

                    <Button style={{ position: 'absolute', bottom: '0px', right: '90px' }}>Add to Alerts</Button>
                </Box>

                <Box
                    style={{ position: 'absolute', top: '400px', left: '60px' }}
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

                                    onInput={searchDatabase}
                                    display={display}
                                    placeholder="Search "
                                />

                                <InputRightElement children={<img id="searchIcon" />} />
                            </InputGroup>

                            <div class="dropdown-content">
                                <p style={{ color: 'black' }}>Hello World!</p>
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
                        overflowX='hidden'
                        bg='rgb(30,30,30)'
                        boxShadow='sm'
                        textAlign='center'
                        height='800px'
                        width='62rem'
                        rounded="lg"
                        color='white'
                        zIndex='-999'>

                        <StockTableTwo />
                    </Box>
                </Box>

                <Box
                    style={{ position: 'absolute', top: '85px', left: '1070px' }}
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
};

export default StockTable;