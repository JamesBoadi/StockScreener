import React, { Component, useState, useContext } from 'react';
import { Components } from './Components';
import { Button, ButtonGroup } from "@chakra-ui/react";
import { OrderForm, CardContext } from './OrderForm';
import { Redirect } from "react-router-dom";
import './StockScreener.css';

export class DashboardInterface extends Component {
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

    // Create a utility hook class
    redirect = (dashboardNum) => {
        switch (dashboardNum) {
            case 1:
                <Redirect to="/dashboardOne"/>
                break;
        }
    }

    render() {
        //  FetchData.sendRequest("I have a message", "of glory");
        this.redirect(this.state.redirect);

        return (
            <div>
                <Button id="dashboardOne" colorScheme="blue" onClick={this.redirect(1)}>Button</Button>
                <Button id="dashboardTwo" colorScheme="blue">Button</Button>
                <Button id="dashboardTwelve" colorScheme="blue">Button</Button>
                <Button id="dashboardIdss" colorScheme="blue">Button</Button>
            </div>
        );
    }



}
