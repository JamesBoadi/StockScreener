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

    return (
        <div>
            <div class="grid-container">
                <div class="grid-item">
                    <Box
                        style={{ position: 'absolute', top: '75px', left: '60px' }}
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
                <div class="grid-item">
                    <Box
                        style={{ position: 'absolute', top: '30px', left: '475px' }  /* right: -475px */}
                        bg={(props.isStreaming) ? "rgb(60,60,60)" : "rgb(30,30,30)"}
                        boxShadow='sm'
                        textAlign='center'
                        height='auto'
                        width='25rem'
                        rounded="lg"
                        borderWidth="1px"
                        color='white'>

                        <StockTableTwo />
                    </Box>
                </div>
            </div>
        </div>
    );
};

export default StockTable;