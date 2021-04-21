import React, { Component, useState, useContext } from 'react';
import { Button, ButtonGroup } from "@chakra-ui/react";
import { DashboardNavbar } from './DashboardNavbar';

import '../Dashboard.css';

export class DashboardOne extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div>
                <header class="App-header">
                    <DashboardNavbar updateCache={this.props.state.updateCache} style={{ transform: 'translateX(20px)' }} />
                    
                
                </header>
            </div>
        );
    }



}
