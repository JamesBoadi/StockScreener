import React, { Component, useRef, useState, useContext } from 'react';
import {
    Box, Button, Select, NumberInput,
    NumberInputField, NumberInputStepper,
    NumberIncrementStepper, NumberDecrementStepper,
} from '@chakra-ui/react';

export const DashboardNavbar = props => {

    const [alertEnabled, setalertEnabled] = useState(true);
    const [alertInterval, setAlertInterval] = useState(6000);
    const [intervalSet, isIntervalSet] = useState(false);
    const getStartTime = useRef(null); // Replace ref with onclick, store and retrieve state
    const getEndTime = useRef(null);
    const dateTime = new Date(); //new DateTime();
    const alertInterval_ = null;

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

    let startTime = <input class="startTime" type="time" name="time" ref={getStartTime} min="09:00" max="17:00" />;

    let endTime = <input class="endTime" type="time" name="time" ref={getEndTime} />;

    function saveConfiguration() {
        triggerAlert(alertEnabled);
    }

    function setAlert(e) {
        setalertEnabled(e.target.checked);
    }

    function triggerAlert(bool) {
        if (bool === false) {
            clearInterval(interval);
            debugger;
        }

        let startTime = parseTime(getStartTime.current.value.toString());
        let endTime = parseTime(getEndTime.current.value.toString());

        let startTime_hours = startTime[0];
        let startTime_minutes = startTime[1];

        let endTime_hours = endTime[0];
        let endTime_minutes = endTime[1];

        let dateTime_hours = dateTime.getUTCHours() + 8;
        let datetime_minutes = dateTime.getMinutes();

        if (intervalSet === false) {
            if (dateTime_hours > startTime_hours && dateTime_hours < endTime_hours) {
                // Trigger an alert set according to interval
                alertInterval = setInterval(() => {

                    intervalSet = true;
                }, alertInterval);
            }
            else if (dateTime_hours === startTime_hours || dateTime_hours === endTime_hours) {
                if (datetime_minutes > startTime_minutes
                    && datetime_minutes < endTime_minutes) {
                    
                        alertInterval = setInterval(() => {

                            intervalSet = true;
                    }, alertInterval);
                }
            }
        }
    }

    function parseTime(str) {
        var hours = str.substring(0, 2);
        var minutes = str.substring(3, 5);

        // var datetime_hours = dateTime.substring(0,2);
        //var datetime_minutes = dateTime.substring(3, 5);

        if (hours.substring(0, 1).Equals("0"))
            hours = parseInt(str.substring(1, 2));
        else
            hours = parseInt(str.substring(0, 2));

        if (minutes.substring(0, 1).Equals("0"))
            minutes = parseInt(str.substring(1, 2));
        else
            minutes = parseInt(str.substring(0, 2));

        return [hours, minutes];

        /* if(dateTime_hours.substring(0,1).Equals("0"))
             datetime_hours = parseInt(datetime_hours.substring(1,2));
         else
             datetime_hours = parseInt(datetime_hours.substring(0,2));
 
         if(datetime_minutes.substring(0,1).Equals("0"))
             datetime_minutes = parseInt(datetime_minutes.substring(1,2));
         else
             datetime_minutes = parseInt(datetime_minutes.substring(0,2));
 
         if(hours > dateTime_hours &&  )
         {
 
         }*/

    }



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

                <div class="grid-container">
                    <div class="grid-item">

                        <p id="selectMarket">Select Market</p>
                        {selectMarket}

                        <p id="alertFrequency">Alert Frequency</p>
                        {alertFrequency}

                        <label id="customalertFrequencyLabel" for="customalertFrequency">Custom Time</label>
                        <input id="customalertFrequency" type="checkbox" />

                        {custom_alertFrequency}
                        <label class="alertFrequencyMinutes">Minutes</label>
                    </div>

                    <div class="grid-item">
                        <div class="alertTime">
                            <p id="alertCriteria">Alert Time</p>
                            <label id="startTime">Start Time</label>
                            {startTime}
                            <label id="endTime">End Time</label>
                            {endTime}
                            <label id="enableAlerts">Enable Alerts</label>
                            <input class="enableAlerts" type="checkbox" onChange={setAlert} />
                        </div>
                    </div>

                    <div class="grid-item">
                        <div class="tableSettings">
                            <div class="vl"></div>
                            <div class="v2"></div>
                            <p id="table_">Columns Filter</p>

                            <div id="disableColumns" >

                                {/* <p id="hideName"
                            style={{ position: 'absolute', top: '10px', left: '575px' }}>Disable Columns </p>*/}

                                <label id="stockName" >Stock <br /> Name</label>
                                <input class="stockName" type="checkbox" />

                                <label id="time">Time</label>
                                <input class="time" type="checkbox" />

                                <label id="price">Price</label>
                                <input class="price" type="checkbox" />

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


                            <div class="disableAlertColumns">
                                <label id="alertStockName" >Stock <br /> Name</label>
                                <input class="alertStockName" type="checkbox" />

                                <label id="alertStockTime">Alert <br /> Time</label>
                                <input class="alertStockTime" type="checkbox" />

                                <label id="alertPrice">Price</label>
                                <input class="alertPrice" type="checkbox" />

                                <label id="alertProfitLoss">P / L %</label>
                                <input class="alertProfitLoss" type="checkbox" />

                                <label id="alertProfitVolume">Volume</label>
                                <input class="alertProfitVolume" type="checkbox" />
                            </div>
                        </div>
                    </div>

                    <div class="grid-item">

                        <p id="stockFilter">Stock Filter</p>
                        <p id="priceRange">Price Range</p>

                        <div class="stockFilter">
                            <div class="startPrice">
                                <p id="startPriceLabel">Start Price</p>
                                <NumberInput
                                    size="md" min={0} maxW={70} defaultValue={1} precision={2} step={0.2}>
                                    <NumberInputField />
                                    <NumberInputStepper >
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </div>

                            <div class="endPrice">
                                <p id="endPriceLabel">Target Price</p>
                                <NumberInput
                                    size="md" min={0} maxW={70} defaultValue={1} precision={2} step={0.2}>
                                    <NumberInputField />
                                    <NumberInputStepper >
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </div>

                            <label id="enablePriceCheck">Enable Price Detection</label>
                            <input class="enablePriceCheck" type="checkbox" />

                            <Button style={{ position: 'absolute', top: '155px', left: '1330px' }}
                                onClick={saveConfiguration}>Save Configuration</Button>
                        </div>
                    </div>

                    {/*  <Button style={{ position: 'absolute', top: '135px', left: '410px' }}>Save</Button>
                    <Button style={{ position: 'absolute', top: '135px', left: '200px' }}>
                        Change Alert Settings</Button>*/}

                </div>
            </Box>
        </div>
    );
};

