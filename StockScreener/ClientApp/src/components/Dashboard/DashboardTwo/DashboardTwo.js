import React, { Component, useState, useContext } from 'react';
import { DashboardTwoNavbar } from './DashboardTwoNavbar';
import DashboardTwoCache from './js/DashboardTwoCache';
import '../Dashboard.css';

export class DashboardTwo extends Component {
    constructor(props) {
        super(props);

        this.setLock = this.setLock.bind(this);

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
            if (connectionEstablished && DashboardTwoCache.getFill()) {
                this.setDashboardTwo();
                this.setState({ lock: false });

                const sessionEndedCalled = localStorage.getItem('sessionEndedCalled');
                if (sessionEndedCalled === null || sessionEndedCalled === undefined) {
                    localStorage.setItem('sessionEndedCalled', false);
                }

                const sessionEnded = localStorage.getItem('sessionEnded');
                if (sessionEnded && !sessionEndedCalled) {
                    window.alert('Session is currently out of trading hours');
                    localStorage.removeItem('sessionEndedCalled');
                    localStorage.setItem('sessionEndedCalled', true);
                }
                clearInterval(this.intervalID);
            }
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    setDashboardTwo() {
        var t = [];
        t.push(< DashboardTwoNavbar {...this} style={{ transform: 'translateX(20px)' }} />);
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
