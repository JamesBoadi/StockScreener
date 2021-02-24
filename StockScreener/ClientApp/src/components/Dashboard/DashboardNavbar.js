import React, { Component, useState, useContext } from 'react';
import { Box, Select } from '@chakra-ui/react';

export const DashboardNavbar = props => {

    let selectMarket =
        <select class="selectMarket" name="Select Market">
            <option value="none">Bursa Malaysia</option>
        </select>;

    let alertFrequency =
        <select class="alertFrequency" name="Frequency">
            <option value="none">1 Minute</option>
            <option value="none">5 Minutes</option>
            <option value="none">10 Minutes</option>
            <option value="none">15 Minutes</option>
            <option value="none">30 Minutes</option>
            <option value="none">1 Hour</option>
            <option value="none">3 Hours</option>
        </select>;

    let customAlertFrequency = <input class="customalertFrequency" type="number" id="quantity"
        name="quantity" value="minutes" min="1" max="5" />

    // Return NavBar
    return (
        <div class="DashboardNavbar">
            <Box
                style={{ position: 'absolute', top: '80px', left: '60px', zIndex: -999 }}
                bg='rgb(40,40,40)'
                boxShadow='sm'
                textAlign='center'
                height='13rem'
                width='115rem'
                rounded="lg"
                borderWidth="1px"
            >
                <p id="selectMarket">Select Market</p>
                {selectMarket}

                <p id="alertFrequency">Alert Frequency</p>
                {alertFrequency}




            </Box>
        </div>
    );
};

