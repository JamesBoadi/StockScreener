import React, { Component, useState, useContext } from 'react';
import { Box, Button } from '@chakra-ui/react';
import './Dashboard.css';

export const SideBar = props => {
    /*
        const Dashboard = <h4 id="dashboard">{"Dashboard "}{props.Data.dashboardNum}</h4>
        const Index = <h4 id="index">{"KLCI"}{props.Data.indexValue}{'( ' + props.Data.indexPercentage + '%)'}</h4>
        const startScan = <h3 id="startScan">{"Start Scan: "}{props.Data.startScan}</h3>
        const lastScan = <h3 id="lastScan">{"Last Scan "}{props.Data.lastScan}</h3>
        const MSCap = <h3 id="msCap">{"MSCap: "}{props.Data.MSCap}{'( ' + props.Data.MSCapPercentage + '%)'}</h3>
        const Ace = <h3 id="Ace">{"ACE"}{props.Data.ACE}{'( ' + props.Data.ACEpercentage + '%)'}</h3>
    */
    // Return NavBar
    return (
        <div class="side-bar">
            <Box
                style={{ position: 'absolute', top: '0px', left: '0px' }}
                bg='rgb(240,240,240)'
                boxShadow='sm'
                textAlign='center'
                minHeight='1200px'
                height={(props.isStreaming) ? '100%' : 'auto'}
                width='3.35rem'
                rounded="lg"
                borderWidth="1px"
                color='white'>

                {/* <h4>{"D"}{props.Data.dashboardNum}</h4>*/}
            
                <Button id="home_" colorScheme="blue"/>
                <Button id="startScan_" colorScheme="blue"/>
                <Button id="stopScan_" colorScheme="blue"/>
                <Button id="settings_" colorScheme="blue"/>
                <Button id="report_" colorScheme="blue"/>
                <Button id="ndsa_" colorScheme="blue"/>
                <Button id="exit_" colorScheme="blue"/>
             
             { /* <Button id="run" colorScheme="blue" >Button</Button>
                    <Button id="stop" colorScheme="blue" >Button</Button>
             <Button id="dashboardTwo" colorScheme="blue">Button</Button>
                <Button id="dashboardTwelve" colorScheme="blue">Button</Button>
                <Button id="dashboardIdss" colorScheme="blue">Button</Button> */}
            </Box>
        </div>
    );
};

