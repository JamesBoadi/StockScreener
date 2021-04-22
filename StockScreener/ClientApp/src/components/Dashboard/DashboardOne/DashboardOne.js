import React, { Component, useState, useContext } from 'react';
import { Button, ButtonGroup } from "@chakra-ui/react";
import { DashboardNavbar } from './DashboardNavbar';
import TableCache from './js/TableCache.js';

import '../Dashboard.css';

export class DashboardOne extends Component {
    constructor(props) {
        super(props);

      //  this.setLock = this.setLock.bind(this);

        this.state = {
            lock: true,
            initialiseTableTwo: false,
            dashboardTwo: [],
            temp: []
        };
    }

    componentDidMount() {
        const connectionEstablished = localStorage.getItem('_connectionEstablished');
        this.intervalID = setInterval(() => {
            if (connectionEstablished &&  TableCache.getFill()) {
                this.setDashboardTwo();
                this.setState({ lock: false });
                clearInterval(this.intervalID);
            }
        }, 500);
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    setDashboardTwo() {
        var t = [];
        t.push(< DashboardNavbar {...this} style={{ transform: 'translateX(20px)' }} />);
        this.setState({ temp: t });
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if (!this.state.lock) {
            this.setState({ dashboardTwo: this.state.temp });
            this.setState({ lock: true });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.lock !== nextState.lock) {
            return true;
        }
        return false;
    }

    setLock(state) {
        this.setState({ initialiseTableTwo: state });
    }

    render() {
        return (
            <div>
                <header class="App-header">
                    {this.state.dashboardTwo}
                </header>
            </div>
        );
    }



}
