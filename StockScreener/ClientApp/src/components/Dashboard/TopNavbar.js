import React, { Component, useState, useContext } from 'react';
import { Box, Select } from '@chakra-ui/react';
import './Dashboard.css';

export const TopNavbar = props => {
    /*           
                {Index}
                {MSCap}
                {Ace} */
    const Screener = <h4 id="stockScreener">StockScreener</h4>
    const Dashboard = <h4 id="dashboard">{"Dashboard: "}{props.Data[0].dashboardNum}</h4>
    const Index = <h4 id="index">{"KLCI: "}{props.Data[0].indexValue}{' ( ' + props.Data[0].indexPercentage + ' )'}</h4>

    //const startScan = <h3 id="startScan">{"Start Scan: "}{props.Data[0].startScan}</h3>
    //const lastScan = <h3 id="lastScan">{"Last Scan: "}{props.Data[0].lastScan}</h3>
    const MSCap = <h3 id="msCap">{"MSCap: "}{props.Data[0].msCap}{' ( ' + props.Data[0].msCapPercentage + ' )'}</h3>
    const Ace = <h3 id="Ace">{"ACE: "}{props.Data[0].ACE}{' ( ' + props.Data[0].ACEpercentage + ' )'}</h3>

    let selectDashboard =
    <select class="selectDashboard" name="Select Dashboard">
        <option value="none">Dashboard 1</option>
        <option value="none">Dashboard 2</option>
        <option value="none">Dashboard 3</option>
        <option value="none">Intra-Day Trading</option>        
    </select>;

    // Return NavBar
    return (
        <div >
            <Box
                style={{ position: 'absolute', top: '0px', left: '60px', zIndex: -999 }}
                bg='rgb(40,40,40)'
                boxShadow='sm'
                textAlign='center'
                height='4rem'
                width='115rem'
                rounded="lg"
                borderWidth="1px"
                color='white'>

                <p id="selectDashboard">Switch Dashboard </p>
                {selectDashboard}

                

            </Box>
        </div>
    );
};

