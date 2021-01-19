import React, { Component, useState, useContext } from 'react';
import { Button, ButtonGroup } from "@chakra-ui/react";
import { FetchData } from './FetchData.js';
import './Dashboard/Dashboard.css';

export class DashboardOne extends Component {

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
        return (
            <div>

                <header className="App-header">
                    <FetchData />
                </header>

            </div>
        );
    }



}
