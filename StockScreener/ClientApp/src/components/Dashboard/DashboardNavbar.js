import React, { Component, useState, useContext } from 'react';
import { Box } from '@chakra-ui/react';
import './Dashboard.css';

export const DashboardNavbar = props => {

    const Dashboard = <h4 id="dashboard">{"Dashboard "}{props.Data.dashboardNum}</h4>
    const Index = <h4 id="index">{"KLCI"}{props.Data.indexValue}{'( ' + props.Data.indexPercentage + '%)'}</h4>
    const startScan = <h3 id="startScan">{"Start Scan "}{props.Data.startScan}</h3>
    const lastScan = <h3 id="lastScan">{"Last Scan "}{props.Data.lastScan}</h3>
    const MSCap = <h3 id="MSCap">{"MSCap"}${props.Data.MSCap}{'( ' + props.Data.MSCapPercentage + '%)'}</h3>
    const Ace = <h3 id="Ace">{"ACE"}${props.Data.ACE}{'( ' + props.Data.ACEpercentage + '%)'} </h3>

    // Return NavBar
    return (
        <div class="DashboardNavbar">
            <Box
                style={{ position: 'absolute', top: '0px' }}
                bg='rgb(130,130,130)'
                boxShadow='sm'
                textAlign='center'
                height='4rem'
                width='100%'
                rounded="lg"
                borderWidth="1px"
                color='white'>

                {Dashboard/*, startScan, lastScan, MSCap, Ace*/}
                {Index}
                {MSCap}
                
                
            </Box>
        </div>
    );
};

