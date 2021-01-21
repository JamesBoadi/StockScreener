import React, { Component, useState, useContext } from 'react';
import { Box } from '@chakra-ui/react';




const StockTable = props => {

    const tableOne = <table class="stockTableOne" aria-labelledby="tabelLabel">
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
        <tbody>
        <tr>
            <td>Berglunds snabbköp</td>
            <td>Christina Berglund</td>
            <td>Sweden</td>
            <td>Christina Berglund</td>
            <td>Sweden</td>
            <td>Sweden</td>
        </tr>
        <tr>
            <td>Berglunds snabbköp</td>
            <td>Christina Berglund</td>
            <td>Sweden</td>
            <td>Christina Berglund</td>
            <td>Sweden</td>
            <td>Sweden</td>
        </tr>
        <tr>
            <td>Berglunds snabbköp</td>
            <td>Christina Berglund</td>
            <td>Sweden</td>
            <td>Christina Berglund</td>
            <td>Sweden</td>
            <td>Sweden</td>
        </tr>
        </tbody>
    </table>;

    const tableTwo = <table class="stockTableTwo" aria-labelledby="tabelLabel">
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
        <tbody>
        <tr>
            <td>Berglunds snabbköp</td>
            <td>Christina Berglund</td>
            <td>Sweden</td>
            <td>Christina Berglund</td>
            <td>Sweden</td>
            <td>Berglunds snabbköp</td>
            <td>Christina Berglund</td>
            <td>Sweden</td>
            <td>Christina Berglund</td>
            <td>Sweden</td>
            <td>Berglunds snabbköp</td>
            <td>Christina Berglund</td>
            <td>Sweden</td>
            <td>Christina Berglund</td>
        </tr>
        </tbody>
    </table>;

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

                        {tableOne}
                    </Box>
                </div>
                <div class="grid-item">

                    <Box
                        style={{ position: 'absolute',  top: '30px', left: '475px' }  /* right: -475px */}
                        bg={(props.isStreaming) ? "rgb(60,60,60)" : "rgb(30,30,30)"}
                        boxShadow='sm'
                        textAlign='center'
                        height='auto'
                        width='25rem'
                        rounded="lg"
                        borderWidth="1px"
                        color='white'>

                        {tableTwo}
                    </Box>
                </div>
            </div>
        </div>
    );
};

export default StockTable;