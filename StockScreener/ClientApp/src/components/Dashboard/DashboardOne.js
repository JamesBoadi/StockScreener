import React, { Component, useState, useContext } from 'react';
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

    redirect = (dashboardNum) => {
        switch (dashboardNum) {
            case 1:
                <Redirect to="/dashboardOne" />
                break;
        }
    }

    render() {
        //  FetchData.sendRequest("I have a message", "of glory");
        this.redirect(this.state.redirect);

        return (
            <div>
                <div className="App">
                    <div class="container">

                        <header className="App-header"></header>
                        <StockTable> </StockTable>


                    </div>
                </div>
            </div>
        );
    }



}
