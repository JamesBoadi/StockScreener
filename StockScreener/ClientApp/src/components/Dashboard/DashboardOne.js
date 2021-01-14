import React, { Component, useState, useContext } from 'react';
import { Components } from './Components';
import { Box } from '@chakra-ui/core';
import './StockScreener.css';
import StockTable from './StockTable';


export class DashboardOne extends Component {
    static displayName = FetchData.name;
    static rowBuffer = [];

    constructor(props) {
        super(props);
        this.cache = new Map();
        this.redirect.bind(this);

        this.state = {
            lock: false,
            redirect: 0
        };
    }

    render() {
        //  FetchData.sendRequest("I have a message", "of glory");
        this.redirect(this.state.redirect);

        return (
            <div>
             <StockTable>   </StockTable>
            </div>
        );
    }



}
