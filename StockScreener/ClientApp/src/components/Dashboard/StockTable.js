import React, { Component, useState, useContext } from 'react';
import { Box } from '@chakra-ui/react';
import { StockTableOne } from './StockTableOne';
import { StockTableTwo } from './StockTableTwo';

// https://packagecontrol.io/packages/CSS%20Format
const StockTable = props => {

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
        }*/
    // Drop Zone

    let stockTableOneHeader = <table class="stockTableOneHeader" aria-labelledby="tabelLabel">
        <thead>
            <tr>
                <th>Time</th>
                <th>Stock Name</th>
                <th>Detect Price</th>
                <th>Last Price</th>
                <th>Scalp Status</th>
                <th>Vol Diff (x100)</th>
            </tr>
        </thead>
    </table>;

    let stockTableTwoHeader = <table class="stockTableOneHeader" aria-labelledby="tabelLabel">
        <thead>
            <tr>
                <th>Stock Name</th>
                <th>WL</th>
                <th>Detect Time</th>
                <th>Detect Price</th>
                <th>High Price</th>
                <th>Last Price</th>
                <th>Gain</th>
                <th>Gain %</th>
                <th>Volume</th>
                <th>Scalp Status</th>
                <th>TP price</th>
                <th>Alert Status</th>
                <th>Catalyst</th>
                <th>Sector</th>
            </tr>
        </thead>
    </table>;

    return (
        <div>
            <div class="grid-container">
                <div class="grid-item">
                    <Box
                        style={{ position: 'absolute', top: '85px', left: '60px' }}
                        bg='rgb(40,40,40)'
                        boxShadow='sm'
                        textAlign='center'
                        height='45px'
                        width='25rem'
                        rounded="lg"
                        margin='auto'
                        zIndex='-999'
                        color='white'>

                        {stockTableOneHeader}

                        <Box
                            style={{
                                position: 'relative',
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
                            zIndex='-999'>

                            <StockTableOne />
                        </Box>
                    </Box>
                </div>

                {/*  style={{ position: 'absolute', top: '30px', left: '475px' }  /* right: -475px */}
                <div class="grid-item">

                    <Box
                        style={{ position: 'absolute', top: '30px', left: '475px' }}
                        bg='rgb(40,40,40)'
                        boxShadow='sm'
                        textAlign='center'
                        height='45px'
                        width='25rem'
                        rounded="lg"
                        margin='auto'
                        zIndex='-999'
                        color='white'>

                        {stockTableTwoHeader}

                        <Box
                            style={{
                                position: 'relative',
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
                            zIndex='-999'>

                            <StockTableTwo />
                        </Box>
                    </Box>
                </div>



            </div>
        </div>
    );
};

export default StockTable;