import React, { Component, useState, useContext } from 'react';
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Redirect } from "react-router-dom";
import { dashboardOne } from './components/DashboardInterface';
import './StockScreener.css';


export class DashboardInterface extends Component {
    constructor(props) {
        super(props);
        this.cache = new Map();
        this.redirect.bind(this);

        this.state = {
            lock: false,
            redirect: 0
        };
    }

    // Create a utility hook class
    redirect = (dashboardNum) => {
        console.log("ok");
        switch (dashboardNum) {
            case 1:
                <Redirect to='Dashboard/dashboardOne' />
                break;
        }
    }

    render() {
        //  FetchData.sendRequest("I have a message", "of glory");    https://www.pluralsight.com/guides/how-to-set-react-router-default-route-redirect-to-home"
// <Route render={() => (<h1>404 Not Found</h1>)} />

        return (
            <div>
                <Route path="/dashboardOne"component={DashboardInterface} />
                <Route path="/dashboardTwo" component={DashboardInterface} />
                
                <Button id="dashboardOne" colorScheme="blue" onClick={this.redirect(1)}>Button</Button>
                <Button id="dashboardTwo" colorScheme="blue">Button</Button>
                <Button id="dashboardTwelve" colorScheme="blue">Button</Button>
                <Button id="dashboardIdss" colorScheme="blue">Button</Button>
            </div>
        );
    }



}
