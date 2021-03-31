import React, { Component } from 'react';
import {
    Box, Button, Select, NumberInput,
    NumberInputField, NumberInputStepper,
    NumberIncrementStepper, NumberDecrementStepper,
} from '@chakra-ui/react';
import { FetchData } from '../../Dashboard/FetchData.js';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import PriceSettings from './js/PriceSettings.js';
import AlertSettings from './js/AlertSettings.js';
import TableCache from './js/TableCache.js';

export class DashboardNavbar extends Component {
    constructor(props) {
        super(props);
        this.array = [];
        this.getStartTime = React.createRef(); // Replace ref with onclick, store and retrieve state
        this.getEndTime = React.createRef();
        this.alertFrequencyRef = React.createRef();
        this.dateTime = new Date();
        this.alertInterval_ = null;
        this.saveConfiguration = this.saveConfiguration.bind(this);
        //this.setGlobalTargetPrice = this.setGlobalTargetPrice.bind(this);
        //this.setStartTargetPrice = this.setStartTargetPrice.bind(this);
        // Global sets local does not set global
        this.setManualAlert = this.setManualAlert.bind(this);
        this.setAutoAlert = this.setAutoAlert.bind(this);
        this.setAlertTrigger = this.setAlertTrigger.bind(this);
        this.parseTime = this.parseTime.bind(this);
        this.notifications = this.notifications.bind(this);
        this.enableNotifications = this.enableNotifications.bind(this);
        this.enableNotificationsMenu = this.enableNotificationsMenu.bind(this);
        this.addToNotificationsMenu = this.addToNotificationsMenu.bind(this);
        this.setGlobalStartPrice = this.setGlobalStartPrice.bind(this);
        this.setGlobalTargetPrice = this.setGlobalTargetPrice.bind(this);
        this.setPriceDetectionEnabled = this.setPriceDetectionEnabled.bind(this);
        this.overrideGlobalPrices = this.overrideGlobalPrices.bind(this);

        this.setHideBearishStocks = this.setHideBearishStocks.bind(this);
        this.setHideBullishStocks = this.setHideBullishStocks.bind(this);
        this.hideBullishStocksConfig = this.hideBullishStocksConfig.bind(this);
        this.hideBearishStocksConfig = this.hideBearishStocksConfig.bind(this);

        this.state = {
            animationTime: 5000,
            alertEnabled: false,
            alertInterval: 1000,
            triggerAlert: false,
            startTime: [],
            endTime: [],
            notifications_temp: [],
            notifications: [
                /*    { <div style={{
                         position: 'absolute', color: "black", fontSize: '22px',
                         fontWeight: 800, float: 'left'
                     }}>
                         Notifications <br/>
                     </div> */
            ],
            updateNotifications: false,
            notificationsMenuVisible: false,

            manualNotifications: false,
            autoNotifications: false,
            enablePriceDetection: false,
            overrideGlobalPrices: false,
            setNotifications: false,
            notificationsEnabled: 0,
            globalStartPrice: 0,
            globalTargetPrice: 0,


            manualAlert: false,
            autoAlert: true,

            manualDisabled: true,
            autoDisabled: false,

            hideBearishStocks: true,
            hideBullishStocks: false,

            hideBearishStocksDisabled: false,
            hideBullishStocksDisabled: true,

        };
    }

    componentDidMount() {
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if (this.state.updateNotifications) {
            this.setState({ notifications: this.state.notifications_temp });
            this.setState({ updateNotifications: false });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.autoDisabled !== this.state.autoDisabled ||
            nextState.manualDisabled !== this.state.manualDisabled ||
            nextState.hideBearishStocks !== this.state.hideBearishStocks ||
            nextState.hideBullishStocks !== this.state.hideBullishStocks ||
            nextState.updateNotifications !== this.state.updateNotifications ||
            nextState.notifications_temp.length !== this.state.notifications_temp.length
            || nextState.notificationsMenuVisible !== this.state.notificationsMenuVisible) {
            return true;
        }
        return false;
    }

    // Enable/Disable Menu of Notifications
    enableNotificationsMenu(e) {
        this.setState({ notificationsMenuVisible: !this.state.notificationsMenuVisible })
    }

    // Add notification to Menu
    addToNotificationsMenu(stock, previousPrice, currentPrice,
        startPrice, targetPrice, state) {
        let notifications = this.state.notifications;

        let alert;
        switch (state) {
            case 3:
                alert = `${stock} has increased to a price of ${currentPrice}
                from ${previousPrice} to ${startPrice} Bullish signal warning`
                break;
            case 2:
                alert = `${stock} has increased to a price of ${currentPrice}
                from ${previousPrice} Bullish signal`
                break;
            case 1:
                alert = `${stock} has hit target price of ${targetPrice}
                from ${previousPrice} to ${currentPrice} Bullish signal`
                break;
            case -1:
                alert = `${stock} has dropped to price of ${currentPrice}
                from ${previousPrice} Bearish signal`
                break;
            case -2:
                alert = `${stock} has dropped to price of ${currentPrice}
                from ${startPrice} Bearish signal warning`
                break;
            case -3:
                alert = `${stock} has hit target price of ${targetPrice}
                from ${previousPrice} Bearish signal`
                break;
        }

        notifications.push(
            <div class="record"
                style={{ position: "relative", color: "grey", top: "10px" }}>
                {alert}
            </div>
        );

        this.setState({ updateNotifications: true });
        this.setState({ notifications_temp: notifications });
    }

    // Call notifications
    notifications(stock, previousPrice, currentPrice, state) {

        let targetPrice;
        let startPrice;

        let globalStartPrice = this.state.globalStartPrice;
        let globalTargetPrice = this.state.globalTargetPrice;

        startPrice = globalStartPrice;
        targetPrice = globalTargetPrice;

        // Override global price individually
     /*   if (localStartPrice !== globalStartPrice)
            startPrice = localStartPrice;
        else
            startPrice = globalStartPrice;

        if (localTargetPrice !== globalTargetPrice)
            targetPrice = localTargetPrice
        else
            targetPrice = globalTargetPrice;*/

        // User specifies a Bearish criteria
        if (startPrice > targetPrice) {
            if (currentPrice > startPrice) {
                state = 3; // Override state
            } else if (currentPrice < targetPrice) {
                state = -3;
            }
        } else if (startPrice < targetPrice) {// User specifies a Bullish criteria
            if (currentPrice < startPrice) {
                state = -2;
            } else if (currentPrice >= targetPrice) {
                state = 1;
            }
        }
        else // If the prices are equal
        {
            if (currentPrice < startPrice) {
                state = -2;
            } else if (currentPrice >= targetPrice) {
                state = 1;
            }
            console.log('Equal ');
        }
        /*   console.log('POINTER ' + stock + ' STATE ' + state + ' current 150 ' + ' startPrice ' + localStartPrice
               + ' targetPrice ' + localTargetPrice);*/

        // Default states: 2, -1
        this.addToNotificationsMenu(stock, previousPrice, currentPrice,
            startPrice, targetPrice, state);
    }




    // Save all settings
    saveConfiguration() {
        AlertSettings.setAlertInterval(this.alertFrequencyRef.current.value);

        //selectedIndex  )
        //this.setAlertTrigger(this.state.alertEnabled);

        if (this.state.setNotifications) {
            this.setState({ notificationsEnabled: 1 })
        }

        // Set Alert Times
        // Detect Change in Alert Settings
        if (AlertSettings.getManual() !== this.state.manualAlert
            || AlertSettings.getAuto() !== this.state.autoAlert) {
            console.log(' CHANGE IN ALERT SETTINGS ');
            AlertSettings.setUpdateAlertSettings(true);
        }

        if (!this.state.autoAlert) {
            console.log('scroll false')
            TableCache.setDisableScroll(false);
        }
        console.log(this.state.manualAlert+' mn '+this.state.autoAlert);
        AlertSettings.setManual(this.state.manualAlert);
        AlertSettings.setAuto(this.state.autoAlert);

        // Override all prices if enabled
        if (this.state.overrideGlobalPrices) {
            PriceSettings.setGlobalStartPrice(this.state.globalStartPrice);
            PriceSettings.setGlobalTargetPrice(this.state.globalTargetPrice);
        }

        // Enable Price Detection
        PriceSettings.setPriceDetectionEnabled(this.state.enablePriceDetection);

        // Set variables for hiding bullish and bearish stocks
        if (this.state.hideBullishStocks && !PriceSettings.getHideBullishStocks()) {
            this.hideBullishStocksConfig();
            PriceSettings.sethideBullishStocks(true);
            AlertSettings.setUpdateAlertSettings(true);
        } else if (!this.state.hideBullishStocks) {
            PriceSettings.sethideBullishStocks(false);
        }
        if (this.state.hideBearishStocks && !PriceSettings.getHideBearishStocks()) {
            this.hideBearishStocksConfig();
            PriceSettings.sethideBearishStocks(true);
            AlertSettings.setUpdateAlertSettings(true);
        } else if (!this.state.hideBearishStocks) {
            PriceSettings.sethideBearishStocks(false);
        }
    }

    // hideStocksConfig
    hideBullishStocksConfig() {
        // Create a Signal Graph
        this.bullishInterval = setInterval(() => {

            if (!PriceSettings.getHideBullishStocks()) {
                // Disable Price Detection
                TableCache.setDisableScroll(false);
                TableCache.setPriceDetection(false);
                TableCache.setUpdateHideStocks(true);
                clearInterval(this.bullishInterval);
            }
            TableCache.setDisableScroll(true);
            TableCache.hideBullishStocks();

        }, 60000);
    }

    // hideStocksConfig
    hideBearishStocksConfig() {
        // Create a Signal Graph
        this.bearishInterval = setInterval(() => {
            if (!PriceSettings.getHideBearishStocks()) {
                // Disable Price Detection
                TableCache.setDisableScroll(false);
                TableCache.setPriceDetection(false);
                TableCache.setUpdateHideStocks(true);
                clearInterval(this.bearishInterval);
            }
            TableCache.setDisableScroll(true);
            TableCache.hideBearishStocks();

        }, 60000);
    }

    // Set hide Bullish Stocks
    setHideBullishStocks(e) {
        this.setState({ hideBullishStocks: e.target.checked });

        this.setState({ hideBearishStocksDisabled: !this.state.hideBearishStocksDisabled });

    }
    // Set hide Bearish Stocks
    setHideBearishStocks(e) {
        this.setState({ hideBearishStocks: e.target.checked });

        this.setState({ hideBullishStocksDisabled: !this.state.hideBullishStocksDisabled });
    }

    //Set Global Start Price
    setGlobalStartPrice(startPrice) {
        this.setState({ globalStartPrice: startPrice });
    }

    // Set Global Target Price
    setGlobalTargetPrice(targetPrice) {
        this.setState({ globalTargetPrice: targetPrice });
    }

    // Enable Price Detection Bool
    setPriceDetectionEnabled(e) {
        this.setState({ enablePriceDetection: e.target.checked });
    }

    // Override Global Prices Bool
    overrideGlobalPrices(e) {
        this.setState({ overrideGlobalPrices: e.target.checked });
    }

    // Enable Alert Notifications
    enableNotifications(e) {
        if (e.target.checked)
            this.setState({ notificationsEnabled: 1 })
        else
            this.setState({ notificationsEnabled: 0 })

        this.setState({ setNotifications: e.target.checked })
    }

    // Checkbox that enables manual alert
    setManualAlert(e) {
        this.setState({ manualAlert: e.target.checked });

        // Disable auto alert checkbox 
        this.setState({ autoDisabled: !this.state.autoDisabled });
    }

    // Checkbox that enables auto alert
    setAutoAlert(e) {
        this.setState({ autoAlert: e.target.checked });

        // Disable auto alert checkbox 
        this.setState({ manualDisabled: !this.state.manualDisabled });
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

        /*   console.log('start time h ' + startTime_hours + ' start time m ' + startTime_minutes
               + ' end time h  ' + endTime_hours + '  end time m ' + endTime_minutes
               + ' DATETIME    ' + dateTime_hours);*/
        /*

    this.setState({ startTime: [startTime_hours, startTime_minutes] })
    this.setState({ endTime: [endTime_hours, endTime_minutes] })
    this.setState({ triggerAlert: alertBool })*/
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
            <select class="alertFrequency" name="Frequency" ref={this.alertFrequencyRef}>
                <option value="60000">1 Minute</option>
                <option value="300000">5 Minutes</option>
                <option value="600000">10 Minutes</option>
                <option value="900000">15 Minutes</option>
                <option value="1800000">30 Minutes</option>
                <option value="3600000">1 Hour</option>
                <option value="10800000">3 Hours</option>
            </select>;

        let custom_alertFrequency = <input class="customalertFrequency" type="number" id="quantity"
            name="quantity" min="1" max="240" />

        let startTime = <input class="startTime" type="time" name="time" ref={this.getStartTime} min="09:00" max="17:00" />;

        let endTime = <input class="endTime" type="time" name="time" ref={this.getEndTime} />;

        return (
            <div class="DashboardNavbar">
                <Box
                    style={{ position: 'absolute', top: '80px', left: '60px', zIndex: 888 }}
                    bg='rgb(40,40,40)'
                    boxShadow='sm'
                    textAlign='center'
                    height='14.5rem'
                    width='115rem'
                    rounded="lg"
                    borderWidth="1px"
                >
                    <div class="grid-item">
                        <div class="frequencyAdjust">

                            <p id="selectMarket">Select Market</p>
                            {selectMarket}

                            <p id="alertFrequency">Alert Frequency</p>
                            {alertFrequency}
                        </div>
                        {/*  <label id="customalertFrequencyLabel" for="customalertFrequency">Custom Time</label>
                        <input id="customalertFrequency" type="checkbox" />

                        {custom_alertFrequency}
                        <label class="alertFrequencyMinutes">Minutes</label>*/}
                    </div>

                    <div class="grid-item">
                        <div class="alertTime">
                            <p id="alertCriteria">Alert Time</p>
                            <label id="startTime">Start Time</label>
                            {startTime}
                            <label id="endTime">End Time</label>
                            {endTime}

                             <label id="manualAlerts">Manual</label>

                            <input class="manualAlerts" type="checkbox" checked={this.state.manualAlert}
                                disabled={this.state.manualDisabled} onChange={this.setManualAlert} />

                            <label id="autoAlerts">Auto</label>

                            <input class="autoAlerts" type="checkbox" checked={this.state.autoAlert}
                                disabled={this.state.autoDisabled} onChange={this.setAutoAlert} /> {/* {...(this.state.manualAlert == 1) ? disabled : ""} */}

                            {/* 
                              <label id="manualAlertsNotifications">Notifications</label>
                            <input class="manualAlertsNotifications" type="checkbox" />
                            <label id="autoAlertsNotifications">Auto <br/> Notifications</label>
                                <input class="autoAlertsNotifications" type="checkbox" onChange={this.setManualAlert} />
                                  <label id="enableNotifications">Manual</label>
                                <input class="enableNotifications" type="checkbox" onChange={this.setManualAlert} />

                                <label id="enableNotifications">Auto</label>
                                <input class="enableNotifications" type="checkbox" onChange={this.setManualAlert} /> */}
                        </div>

                        <div class="tableSettings" >
                            <div class="vl"></div>
                            <div class="v2"></div>
                            <p id="table_">Columns Filter</p>

                            <div class="disableColumns" >

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


                        <div class="priceDetection">
                            <p id="priceRange">Price Range</p>
                            <div class="startPrice">
                                <p id="startPriceLabel">Start Price</p>
                                <NumberInput
                                    onChange={this.setGlobalStartPrice}
                                    style={{ top: '5px' }}
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
                                    onChange={this.setGlobalTargetPrice}
                                    size="md" min={0} maxW={70} defaultValue={1} precision={2} step={0.2}>
                                    <NumberInputField />
                                    <NumberInputStepper >
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </div>

                            <label id="enablePriceCheck">Custom Price Detection</label>
                            <input class="enablePriceCheck" type="checkbox" onChange={this.setPriceDetectionEnabled} />

                            <label id="overridePrices">Override Custom Prices</label>
                            <input class="overridePrices" type="checkbox" onChange={this.overrideGlobalPrices} />

                            <label id="hideBullishStocks">Hide Bullish Stocks</label>
                            <input class="hideBullishStocks" type="checkbox"
                                checked={this.state.hideBullishStocks}
                                disabled={this.state.hideBullishStocksDisabled}
                                onChange={this.setHideBullishStocks} />
                            {/*  />*/}

                            <label id="hideBearishStocks">Hide Bearish Stocks</label>
                            <input class="hideBearishStocks" type="checkbox"
                                checked={this.state.hideBearishStocks}
                                disabled={this.state.hideBearishStocksDisabled}
                                onChange={this.setHideBearishStocks} />
                            {/*  />*/}

                            <a
                                style={{
                                    color: 'white',
                                    position: 'absolute', top: '-68px', left: '1130px',
                                }} onClick={this.enableNotificationsMenu}>
                                Notifications <DownOutlined />
                            </a>

                            <div class="dropdown-content">
                                <Box
                                    style={{ position: 'absolute' }}
                                    visibility={(this.state.notificationsMenuVisible) ? 'visible' : 'hidden'}
                                    min-width='16.25rem'
                                    width='16.25rem'
                                    height='17.25rem'
                                    overflowY='auto'
                                    bg='#f9f9f9'
                                    top='-35px'
                                    left='1130px'
                                    backgroundColor='wheat.511'
                                    zIndex='999'
                                >
                                    {this.state.notifications}
                                </Box>
                            </div>

                            <Button style={{ position: 'absolute', top: '170px', left: '1325px', zIndex: '-999' }}
                                onClick={this.saveConfiguration}>Save Configuration</Button>

                        </div>

                        {/* 
                        <Button style={{ position: 'absolute', top: '135px', left: '410px' }}>Save</Button>
                    <Button style={{ position: 'absolute', top: '135px', left: '200px' }}>
                        Change Alert Settings</Button>*/}
                    </div>
                </Box>

                <FetchData {...this} />
            </div>
        );
    }
}


