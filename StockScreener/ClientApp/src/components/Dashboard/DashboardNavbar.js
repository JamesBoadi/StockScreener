import React, { Component, useState, useContext } from 'react';
import { Box, Button, Select } from '@chakra-ui/react';

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

    let custom_alertFrequency = <input class="customalertFrequency" type="number" id="quantity"
        name="quantity" min="1" max="240" />

    let startTime = <input class="startTime" type="time" name="time" />;

    let endTime = <input class="endTime" type="time" name="time" />;




    // Return NavBar
    // Make a grid
    return (
        <div class="DashboardNavbar">
            <Box
                style={{ position: 'absolute', top: '80px', left: '60px', zIndex: -999 }}
                bg='rgb(40,40,40)'
                boxShadow='sm'
                textAlign='center'
                height='14rem'
                width='115rem'
                rounded="lg"
                borderWidth="1px"
            >

                <p id="selectMarket">Select Market</p>
                {selectMarket}

                <p id="alertFrequency">Alert Frequency</p>
                {alertFrequency}

                <label id="customalertFrequencyLabel" for="customalertFrequency">Custom Time</label>
                <input id="customalertFrequency" type="checkbox" />

                {custom_alertFrequency}
                <label class="alertFrequencyMinutes">Minutes</label>

                <div id="alertTime">
                    <p id="alertCriteria">Alert Criteria</p>
                    <label id="startTime">Start Time</label>
                    {startTime}
                    <label id="endTime">End Time</label>
                    {endTime}
                    <Button style={{ position: 'absolute', top: '135px', left: '410px' }}>Save</Button>
                </div>

                <Button style={{ position: 'absolute', top: '160px', left: '300px' }}>
                    Change Alert Settings</Button>


                <div id="tableSettings">
                    <div class="vl"></div>
                    <div class="v2"></div>
                    <p id="table_">Table Settings</p>

                    <div id="disableColumns" >
                        <p id="hideName"
                            style={{ position: 'absolute', top: '10px', left: '575px' }}>Disable </p>

                        <label id="stockName" >Stock <br /> Name</label>
                        <input class="stockName" type="checkbox" />

                        <label id="time">Time</label>
                        <input class="time" type="checkbox" />

                        <label id="hidePrice">Hide  <br />  Price</label>
                        <input class="hidePrice" type="checkbox" />

                        <label id="high">High</label>
                        <input class="high" type="checkbox" />

                        <label id="low">Low</label>
                        <input class="low" type="checkbox" />

                        <label id="profitLoss">P / L</label>
                        <input class="profitLoss" type="checkbox" />

                        <label id="profitLossPercentage">P / L %</label>
                        <input class="profitLossPercentage" type="checkbox" />

                        <label id="volume">Volume</label>
                        <input class="volume" type="checkbox" />
                    </div>
                </div>

            </Box>
        </div>
    );
};

