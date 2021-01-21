import React, { Component, useState, useContext } from 'react';
import { Box } from '@chakra-ui/react';
import {StockTableOne} from './StockTableOne';
import {StockTableTwo} from './StockTableTwo';

const StockTable = props => {
/*
    // Add the Row
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
    return (
        <div>
            <div class="grid-container">
                <div class="grid-item">
                    <Box
                        style={{ position: 'absolute', top: '30px', left: '30px' }}
                        bg={(props.isStreaming) ? "rgb(60,60,60)" : "rgb(30,30,30)"}
                        boxShadow='sm'
                        textAlign='center'
                        height='auto'
                        width='25rem'
                        rounded="lg"
                        borderWidth="1px"
                        color='white'>

                        <StockTableOne/>
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

                        <StockTableTwo/>
                    </Box>
                </div>
            </div>
        </div>
    );
};

export default StockTable;