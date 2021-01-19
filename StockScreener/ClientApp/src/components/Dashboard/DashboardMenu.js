import React, { Component, useState, useContext } from 'react';
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Router, Route, Switch } from 'react-router';
import './Dashboard.css';

export class DashboardMenu extends Component {
    constructor(props) {
        super(props);
        //   this.redirect = this.redirect.bind(this);
        this.state = {
            redirect: 0
        };
    }

    render() {
        return (
            <div>
                <Button id="dashboardOne" colorScheme="blue" onClick={this.props.redirect}>Button</Button>
                <Button id="dashboardTwo" colorScheme="blue">Button</Button>
                <Button id="dashboardTwelve" colorScheme="blue">Button</Button>
                <Button id="dashboardIdss" colorScheme="blue">Button</Button>
            </div>
        );
    }
}