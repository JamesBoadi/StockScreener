import React, { Component, useState, useContext } from 'react';
import { Button, ButtonGroup } from "@chakra-ui/react";
import '../Dashboard.css';
import { DashboardNavbar } from './DashboardNavbar';

export class DashboardOne extends Component {

    constructor(props) {
        super(props);
        this.cache = new Map();
        // this.redirect = this.redirect.bind(this);

        this.state = {
            lock: false,
            redirect: 0
        };
    }

    /* redirect = (num) => {
         switch (num) {
             case 6:
                 <Redirect to="/dashboardSettings" />
                 break;
         }
     }*/

    render() {
        //  FetchData.sendRequest("I have a message", "of glory");
        return (
            <div>

                <header class="App-header">
                    <DashboardNavbar />
                </header>

            </div>
        );
    }



}
