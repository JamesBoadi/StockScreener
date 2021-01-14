import React, { Component, useState, useContext } from 'react';
import { Components } from './Components';
import MousePosition from './MousePosition';
import { Box } from '@chakra-ui/core';
import { OrderForm, CardContext } from './OrderForm';
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
        </div>
    );
};

export default StockTable;