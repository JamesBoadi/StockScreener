import React, { Component, useState, useContext } from 'react';
import { Box } from '@chakra-ui/react';


const DashboardNavbar = props => {
    
    const Dashboard = <h3 id="dashboard">${"Dashboard "}${props.dashboardNum}</h3>
    const Index = <h3 id="index">${"KLCI"}${props.indexValue}${'( ' + props.indexPercentage + '%)'}</h3>
    
    const startScan = <h3 id="startScan">${"Start Scan "}${props.startScan}</h3>
    const lastScan = <h3 id="lastScan">${"Last Scan "}${props.lastScan}</h3>
    const MSCap = <h3 id="MSCap">${"MSCap"}${props.MSCap}${'( ' + props.MSCapPercentage + '%)'}</h3>
    const Ace = <h3 id="Ace">${"ACE"}${props.ACE}${'( ' + props.ACEpercentage + '%)'} </h3>





    // Return NavBar
    return (
        <div class="DashboardNavbar">
            <Box
                style={{ position: 'absolute', left: '30px' }}
                bg={(props.isStreaming) ? "rgb(60,60,60)" : "rgb(30,30,30)"}
                boxShadow='sm'
                textAlign='center'
                height='auto'
                width='25rem'
                rounded="lg"
                borderWidth="1px"
                color='white'>
                
                {Dashboard, Index, startScan, lastScan, MSCap, Ace}
            </Box>

        </div>
    );
};

export default DashboardNavbar;