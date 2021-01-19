import React, { Component, useState, useContext } from 'react';
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Redirect } from "react-router-dom";
import { DashboardOne } from './Dashboard/DashboardOne';
import { DashboardMenu } from './Dashboard/DashboardMenu';
import { Router, Route, Switch } from 'react-router';
import './StockScreener.css';
import App from '../App';

export class DashboardInterface extends Component {
    constructor(props) {
        super(props);
        this.cache = new Map();
        this.redirect = this.redirect.bind(this);

        this.state = {
            lock: false,
            redirect: 0
        };
    }

    redirect = (num) => {
        console.log(num + " " + "aaak");
        this.setState({ redirect: num })
    }


    /* https://www.pluralsight.com/guides/how-to-set-react-router-default-route-redirect-to-home
<Route render={() => (<h1>404 Not Found</h1>)} /> Important if there is a timeout or error
    */
    render() {
        let redirect;

        // switch
        if (this.state.redirect == 1)
            redirect = <Redirect to='/DashboardOne' />;

        return (
            <div class="App">
                <div class="App-header">
                <DashboardMenu redirect={() => this.redirect(1)} />

                {redirect}
                </div>
            </div>
        );
    }



}
