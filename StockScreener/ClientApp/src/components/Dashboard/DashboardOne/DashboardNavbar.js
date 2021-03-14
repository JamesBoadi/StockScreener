import React, { Component } from 'react';
import {
    Box, Button, Select, NumberInput,
    NumberInputField, NumberInputStepper,
    NumberIncrementStepper, NumberDecrementStepper,
} from '@chakra-ui/react';
import { FetchData } from './FetchData.js';
import { render } from 'react-dom';

export class DashboardNavbar extends Component {
    constructor(props) {
        super(props);

        this.array = [];
        this.getStartTime = React.createRef(); // Replace ref with onclick, store and retrieve state
        this.getEndTime = React.createRef();
        this.dateTime = new Date();
        this.alertInterval_ = null;

        this.saveConfiguration = this.saveConfiguration.bind(this);
        this.setAlert = this.setAlert.bind(this);
        this.setAlertTrigger = this.setAlertTrigger.bind(this);
        this.parseTime = this.parseTime.bind(this);

        this.state = {
            animationTime: 5000,
            alertEnabled: false,
            alertInterval: 1000,
            triggerAlert: false,
            startTime: [],
            endTime: []

        };
    }

    // Save all settings
    saveConfiguration() {
        this.setAlertTrigger(this.state.alertEnabled);
    }

    // Checkbox that enables alert
    setAlert(e) {
        this.setState({ alertEnabled: e.target.checked });
    }

    // Determine whether or not an alert should be triggered
    setAlertTrigger(bool) {
        if (bool === false)
            return;

        let alertBool = false;

        let startTime = this.parseTime(this.getStartTime.current.value.toString());
        let endTime = this.parseTime(this.getEndTime.current.value.toString());

        let startTime_hours = startTime[0];
        let startTime_minutes = startTime[1];

        let endTime_hours = endTime[0];
        let endTime_minutes = endTime[1];

        let dateTime_hours = (this.dateTime.getUTCHours() + 8 >= 24) ? Math.abs(24 - (this.dateTime.getUTCHours() + 8))
            : this.dateTime.getUTCHours() + 8;
        let datetime_minutes = this.dateTime.getMinutes();

        // Trigger an alert if it is within time frame
        if (dateTime_hours >= 9 && dateTime_hours <= 5) {
            if (startTime_hours >= dateTime_hours && endTime_hours < dateTime_hours) {
                if (dateTime_hours == 4 && endTime_minutes <= 59) {
                    alertBool = true;
                }
            }
        }

        console.log(alertBool);

        this.setState({ startTime: [startTime_hours, startTime_minutes] })
        this.setState({ endTime: [endTime_hours, endTime_minutes] })
        this.setState({ triggerAlert: alertBool })
    }

    parseTime(str) {
        var hours = str.substring(0, 2);
        var minutes = str.substring(3, 5);

        if (hours.substring(0, 1) === "0")
            hours = parseInt(hours.substring(1, 2));
        else
            hours = parseInt(hours.substring(0, 2));

        if (minutes.substring(0, 1) === "0")
            minutes = parseInt(minutes.substring(1, 2));
        else
            minutes = parseInt(minutes.substring(0, 2));

        return [hours, minutes];
    }

    render() {
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

        let startTime = <input class="startTime" type="time" name="time" ref={this.getStartTime} min="09:00" max="17:00" />;

        let endTime = <input class="endTime" type="time" name="time" ref={this.getEndTime} />;

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
                                <input class="enableAlerts" type="checkbox" onChange={this.setAlert} />
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
                                    onClick={this.saveConfiguration}>Save Configuration</Button>
                            </div>
                        </div>

                        {/*  <Button style={{ position: 'absolute', top: '135px', left: '410px' }}>Save</Button>
                    <Button style={{ position: 'absolute', top: '135px', left: '200px' }}>
                        Change Alert Settings</Button>*/}

                    </div>
                </Box>

                <FetchData {...this} />
            </div>
        );
    }
}


