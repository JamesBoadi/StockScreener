import React, { Component, useState, useContext } from 'react';
import {
    Box, Button, NumberInput,
    NumberInputField, NumberInputStepper,
    NumberIncrementStepper, NumberDecrementStepper
} from '@chakra-ui/react';
import { StockTableOne } from './StockTableOne';
import { StockTableTwo } from './StockTableTwo';

// https://packagecontrol.io/packages/CSS%20Format
const StockTable = props => {
    const [green, setGreen] = useState(false);
    const [red, setRed] = useState(true);
    const [priceChangeUp, setPriceChangeUp] = useState(false);

    /*  // Add the Row
        addRow = () => {
            tableOne.push(<tbody>
    
                <tr>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                </tr>
            </tbody>)
        }
    // Drop Zone
    
    if(count === 0)
    {
        console.log("Ok sonny");
        setStockTable(table);
        setCount(1);
    }
*/
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


    return (
        <div>
            {/* <Box
                style={{ position: 'absolute', top: '85px', left: '60px' }}
                bg='rgb(40,40,40)'
                boxShadow='sm'
                textAlign='center'
                height='45px'
                width='23rem'
                rounded="lg"
                margin='auto'
                zIndex='500'
                color='white'>
                {stockTableOneHeader}
                <Box
                    style={{
                        position: 'absolute',
                        overflowY: 'auto'
                    }}
                    bg='rgb(30,30,30)'
                    boxShadow='sm'
                    textAlign='center'
                    height='1110px'
                    width='26.3rem'
                    rounded="lg"
                    margin='auto'
                    color='white'
                    zIndex='0'>

                    <StockTableOne />
                </Box>
                </Box> --> */}

            <div id="tableContainer">
                <Box
                    style={{ position: 'absolute', top: '85px', left: '60px' }}
                    bg='rgb(40,40,40)'
                    boxShadow='sm'
                    height='305px'
                    width='62rem'
                    rounded="lg"
                    margin='auto'
                    color='white'
                    zIndex='0'>

                    <h1 style={{ position: 'relative', textAlign: 'center' }}>AAPL (Apple Inc)</h1>
                    <h3 style={{ position: 'relative', textAlign: 'center' }}>Price: 286.7</h3>
                    <h4 style={{ position: 'relative', top: '30px', left: '0px' }}>Sector: Technology</h4>
                    <h4 style={{ position: 'relative', top: '30px', left: '0px' }}>Message: Possible Reversal</h4>

                    {/* Entry: Largest gap in either shorts or calls (Calculate in c#) */}
                    <h4 style={{ position: 'relative', top: '30px', left: '0px' }}>Possible Entry: 230.6
                 
                    </h4>
                    <NumberInput maxW="100px" mr="2rem" defaultValue={15} min={10} max={20}>
                            <NumberInputField  />
                            <NumberInputStepper>
                                <NumberIncrementStepper  bg="black"/>
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    <h4 style={{ position: 'relative', top: '30px', left: '0px' }}>Take Profit: 270.6</h4>

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
                    bg='rgb(90,40,40)'
                    boxShadow='sm'
                    textAlign='center'
                    height='45px'
                    width='60rem'
                    rounded="lg"
                    margin='auto'
                    zIndex='999'
                    color='white'>
                    {stockTableTwoHeader}
                    <Box
                        style={{
                            position: 'absolute',
                            overflowY: 'auto'
                        }}

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
            </div>
        </div>

    );
};

export default StockTable;