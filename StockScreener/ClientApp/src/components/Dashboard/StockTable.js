import React, { Component, useState, useContext } from 'react';
import { Box } from '@chakra-ui/core';
import './StockScreener.css';


const StockTable = props => {
    const [zone, setZoneColor] = useState('blue');
    const [event, setEv] = useState({ el: null, left: null, top: null });

    const table = <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
            <tr>
                <th>Open</th>
                <th>Name</th>
                <th>Change</th>
                <th>ChangePercentage</th>
                <th>Volume</th>
            </tr>
        </thead>
    </table>;

    // Drop Zone
    return (
        <div>
            <Box
                bg="rgb(60,60,60)"
                style={{ position: "absolute", top: 0 }}
                boxShadow='sm'
                textAlign='center'
                height='20rem'
                width='52rem'
                rounded="lg"
                borderWidth="1px"
                color='white'>
                <h3>Active Orders</h3>
                {table}
            </Box>
        </div>
    );
};

export default StockTable;