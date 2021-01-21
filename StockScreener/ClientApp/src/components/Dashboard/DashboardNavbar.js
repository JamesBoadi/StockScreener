import React, { Component, useState, useContext } from 'react';
import { Box } from '@chakra-ui/react';
import './Dashboard.css';

export const DashboardNavbar = props => {

    const Dashboard = <h4 id="dashboard">{"Dashboard: "}{props.Data[0].dashboardNum}</h4>
    const Index = <h4 id="index">{"KLCI: "}{props.Data[0].indexValue}{' ( ' + props.Data[0].indexPercentage + ' )'}</h4>
    const startScan = <h3 id="startScan">{"Start Scan: "}{props.Data[0].startScan}</h3>
    const lastScan = <h3 id="lastScan">{"Last Scan: "}{props.Data[0].lastScan}</h3>
    const MSCap = <h3 id="msCap">{"MSCap: "}{props.Data[0].msCap}{' ( ' + props.Data[0].msCapPercentage + ' )'}</h3>
    const Ace = <h3 id="Ace">{"ACE: "}{props.Data[0].ACE}{' ( ' + props.Data[0].ACEpercentage + ' )'}</h3>

    // Return NavBar
    return (
        <div class="DashboardNavbar">
            <Box
                style={{ position: 'absolute', top: '0px',  zIndex: -1 }}
                bg='rgb(40,40,40)'
                boxShadow='sm'
                textAlign='center'
                height='5rem'
                width='93rem'
                rounded="lg"
                borderWidth="1px"
                color='white'>
                
                {Dashboard}
                {Index}
                {MSCap}
                {startScan}
                {lastScan}
                {Ace}
            </Box>
        </div>
    );
};

