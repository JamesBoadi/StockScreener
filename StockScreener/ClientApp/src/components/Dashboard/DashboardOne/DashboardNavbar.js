import React, { Component } from 'react';
import {
    Box, Button, Select, NumberInput,
    NumberInputField, NumberInputStepper,
    NumberIncrementStepper, NumberDecrementStepper,
} from '@chakra-ui/react';
import { Menu, Dropdown, TimePicker } from 'antd';

import { StockTableTwo } from './StockTableTwo';
import { SavedStockTable } from './SavedStockTable';
import PriceSettings from './js/PriceSettings.js';
import AlertSettings from './js/AlertSettings.js';
import TableCache from './js/TableCache.js';
import TableSettings from './js/TableSettings.js';
import { AlertContext } from './AlertContext';

import moment from 'moment';

const date = new Date();

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
        this.parseTime = this.parseTime.bind(this);


        this.enableNotifications = this.enableNotifications.bind(this);

        this.setGlobalStartPrice = this.setGlobalStartPrice.bind(this);
        this.setGlobalTargetPrice = this.setGlobalTargetPrice.bind(this);
        this.setPriceDetectionEnabled = this.setPriceDetectionEnabled.bind(this);
        this.overrideGlobalPrices = this.overrideGlobalPrices.bind(this);

        this.setHideBearishStocks = this.setHideBearishStocks.bind(this);
        this.setHideBullishStocks = this.setHideBullishStocks.bind(this);
        this.hideBullishStocksConfig = this.hideBullishStocksConfig.bind(this);
        this.hideBearishStocksConfig = this.hideBearishStocksConfig.bind(this);

        this.toggleSettings = this.toggleSettings.bind(this);
        this.setStartTime = this.setStartTime.bind(this);
        this.setEndTime = this.setEndTime.bind(this);

        // Display Stock
        //............................................................................

        this.displayStock = this.displayStock.bind(this);
        this.setAddAlertTableRowBool = this.setAddAlertTableRowBool.bind(this);
        this.setRemoveAlertTableRowBool = this.setRemoveAlertTableRowBool.bind(this);
        this.selectAlertTableRow = this.selectAlertTableRow.bind(this);
        this.setIsSelected = this.setIsSelected.bind(this);
        this.removeStock = this.removeStock.bind(this);
        this.idExists = this.idExists.bind(this);
        this.addToHistorical = this.addToHistorical.bind(this);
        this.addToHistoricalTable = this.addToHistoricalTable.bind(this);
        this.update = this.update.bind(this);

        // Settings
        //.............................................................................

        this.initialieSettings = this.initialieSettings.bind(this);
        this.getPriceSettings = this.getPriceSettings.bind(this);

        this.state = {
            animationTime: 5000,
            alertEnabled: false,
            alertInterval: 1000,
            triggerAlert: false,

            startTime: "09:00",
            endTime: "16:59",
            startTimeValue: "09:00",

            notifications_temp: [],
            notifications: [
                /*    { <div style={{
                         position: 'absolute', color: "black", fontSize: '22px',
                         fontWeight: 800, float: 'left'
                     }}>
                         Notifications <br/>
                     </div> */
            ],

            manualNotifications: false,
            autoNotifications: false,
            enablePriceDetection: false,
            overrideGlobalPrices: false,
            setNotifications: false,
            notificationsEnabled: 0,
            globalStartPrice: 0,
            globalTargetPrice: 0,
            manualAlert: false,
            autoAlert: false,
            manualDisabled: false,
            autoDisabled: false,



            hideBearishStocks: false,
            hideBullishStocks: false,

            hideBearishStocksDisabled: false,
            hideBullishStocksDisabled: false,

            disableStartTime: false,
            disableEndTime: false,
            disableSetPrice: true,

            state: {},

            startPriceInput: null,
            targetPriceInput: null,

            // Display Stock
            stockInfoName: [],
            stockInfoHeader: [],
            stockInfoPrevPrice: [],
            stockInfoCurrPrice: [],
            stockInfoCode: [],
            updateStockInfo: false,
            alertMessagePopUp: "",

            updateNotifications: false,
            notificationsMenuVisible: false,
            clickedAlertTableRowID: null,
            addAlertTableRowBool: false,
            removeAlertTableRowBool: false,
            isSelected: false,

            // D1
            saveSettings: false,
            toggleAlert: false,
            update: false



        };
    }

    componentDidMount() {

        this.initialieSettings();


    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if (this.state.updateNotifications) {
            this.setState({ notifications: this.state.notifications_temp });
            this.setState({ updateNotifications: false });
        }
        if (this.state.updateStockInfo) {
            this.setState({ stockInfoHeader: this.state.stockInfoName[0] });
            this.setState({ stockInfoPrevPrice: this.state.stockInfoName[1] });
            this.setState({ stockInfoCurrPrice: this.state.stockInfoName[2] });
            this.setState({ stockInfoCode: this.state.stockInfoName[3] });

            this.setState({ updateStockInfo: false });
        }
        if (this.state.update) {

            this.update(false);
        }

    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.saveSettings !== this.state.saveSettings ||
            nextState.startTime !== this.state.startTime ||
            nextState.endTime !== this.state.endTime ||
            nextState.globalTargetPrice !== this.state.globalTargetPrice ||
            nextState.globalStartPrice !== this.state.globalStartPrice ||
            nextState.enablePriceDetection !== this.state.enablePriceDetection ||
            nextState.disableSetPrice !== this.state.disableSetPrice ||
            nextState.autoDisabled !== this.state.autoDisabled ||
            nextState.manualDisabled !== this.state.manualDisabled ||
            nextState.hideBearishStocks !== this.state.hideBearishStocks ||
            nextState.hideBullishStocks !== this.state.hideBullishStocks ||
            nextState.updateNotifications !== this.state.updateNotifications ||
            nextState.notifications_temp.length !== this.state.notifications_temp.length
            || nextState.notificationsMenuVisible !== this.state.notificationsMenuVisible
            || nextState.update !== this.state.update
            || nextState.updateStockInfo !== this.state.updateStockInfo) {
            return true;
        }
        return false;
    }

    // **************************************************
    // Save Settings 
    // **************************************************
    // **************************************************

    update(value) {
        this.setState({ update: value });
    }

    toggleSettings(state) {
        this.setState({ saveSettings: state });
    }



    async saveSettingsToDatabase(alertsettings, pricesettings) {
        await fetch('savesettings/dashboardOne/'.concat(alertsettings) + '/'.concat(pricesettings))
            .then(response => response.json())
            .catch(error => {
                console.log("error " + error) // 404
                return;
            }
            );
    }

    async initialieSettings() {
        await fetch('getpricesettings/dashboardOne/')
            .then(response => response.json())
            .then(response => {
                this.getPriceSettings(response)
            }
            )
            .catch(error => {
                console.log("error 5 " + error) // 404
                return;
            }
            );
    }




    getPriceSettings(response) {
        for (var i = 0; i < response.length; i++) {
            const item = JSON.parse(response[i]);

            if (item.HideBullishStocks === null || item.HideBullishStocks === undefined
                || item.HideBearishStocks === null || item.HideBearishStocks === undefined
                || item.GlobalStartPrice === null || item.GlobalStartPrice === undefined
                || item.GlobalTargetPrice === null || item.GlobalTargetPrice === undefined
                || item.PriceDetectionEnabled === null || item.PriceDetectionEnabled === undefined) {
                return;
            }

            if (item.HideBullishStocks) {
                this.setState({ hideBullishStocks: true });
                this.setState({ hideBearishStocks: false });
                this.setState({ hideBearishStocksDisabled: true });
            }
            else if (item.HideBearishStocks) {
                this.setState({ hideBearishStocks: true });
                this.setState({ hideBullishStocks: false });
                this.setState({ hideBullishStocksDisabled: true });
            }

            PriceSettings.setGlobalStartPrice(item.GlobalStartPrice);
            PriceSettings.setGlobalTargetPrice(item.GlobalTargetPrice);

            this.setState({ globalStartPrice: item.GlobalStartPrice });
            this.setState({ globalTargetPrice: item.GlobalTargetPrice });

            this.initialiseStartPriceInput(item.GlobalStartPrice, !item.PriceDetectionEnabled);
            this.initialiseTargetPriceInput(item.GlobalTargetPrice, !item.PriceDetectionEnabled);
            if (item.PriceDetectionEnabled) {
                this.setState({ enablePriceDetection: true });
                this.setState({ disableSetPrice: false });
            }
            else{
                this.setState({ enablePriceDetection: false });
                this.setState({ disableSetPrice: true });
            }

            // Set variables for hiding bullish and bearish stocks
            if (item.HideBullishStocks) {
                this.hideBullishStocksConfig();
                PriceSettings.sethideBullishStocks(true);
                AlertSettings.setUpdateAlertSettings(true);
            } else {
                PriceSettings.sethideBullishStocks(false);
            }

            if (item.HideBearishStocks) {
                this.hideBearishStocksConfig();
                PriceSettings.sethideBearishStocks(true);
                AlertSettings.setUpdateAlertSettings(true);
            } else {
                PriceSettings.sethideBearishStocks(false);
            }


            AlertSettings.setUpdateAlertSettings(item.PriceDetectionEnabled);

        }

        this.setState({ saveSettings: true });
    }

    initialiseStartPriceInput(value, bool) {
        var t = [];

        t.push(<>
            <p id="priceRange">Price Range</p>
            <div class="startPrice">
                <p id="startPriceLabel">Start Price</p>
                <NumberInput
                    isDisabled={bool}
                    onChange={this.setGlobalStartPrice}
                    style={{ top: '5px' }}
                    size="md" min={0} maxW={70} defaultValue={value} precision={2} step={0.2}>
                    <NumberInputField />
                    <NumberInputStepper >
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </div>
        </>);

        this.setState({ startPriceInput: t })
    }

    initialiseTargetPriceInput(value, bool) {
        var t = [];

        t.push(<>
            <div class="endPrice">
                <p id="endPriceLabel">Target Price</p>
                <NumberInput
                    isDisabled={bool}
                    onChange={this.setGlobalTargetPrice}
                    size="md" min={0} maxW={70} defaultValue={value} precision={2} step={0.2}>
                    <NumberInputField />
                    <NumberInputStepper >
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </div>
        </>);

        this.setState({ targetPriceInput: t })

    }




    getAlertSettings(response) {
        for (var i = 0; i < response.length; i++) {
            const item = JSON.parse(response[i]);

            console.log(' ITEM ' + item.StartTime + ' ' + item.EndTime + ' ' +
                item.Manual + ' ' + item.Auto + ' ' + item.HideBullishStocks
                + ' ' + item.HideBullishStocks + ' ' + item.HideBearishStocks
                + ' ' + item.GlobalStartPrice + ' ' + item.GlobalTargetPrice + ' ' +
                + item.PriceDetectionEnabled);

            if (item.StartTime === null || item.StartTime === undefined
                || item.EndTime === null || item.EndTime === undefined
                || item.AlertInterval === null || item.AlertInterval === undefined
                || item.Auto === null || item.Auto === undefined
                || item.Manual === null || item.Manual === undefined) {
                console.log(' Nullable ');
                return;
            }


            this.setState({ startTime: item.StartTime });
            this.setState({ endTime: item.EndTime });

            AlertSettings.setTime(item.StartTime, item.EndTime);

            AlertSettings.setAlertInterval(item.AlertInterval);
            AlertSettings.setManual(item.Manual);
            AlertSettings.setAuto(item.Auto);


            if (item.Manual) {
                this.setState({ manualAlert: true });
                this.setState({ autoAlert: false });
                this.setState({ disableStartTime: true });
                this.setState({ disableEndTime: true });
                // Disable auto alert checkbox 
                this.setState({ autoDisabled: true });
            }
            else if (item.Auto) {
                this.setState({ autoAlert: true });
                this.setState({ manualAlert: false });
                // Disable auto alert checkbox 
                this.setState({ manualDisabled: true });
            }

            this.setState({ startTime: item.StartTime });
            this.setState({ endTime: item.EndTime });

            AlertSettings.setUpdateAlertSettings(true);
        }
    }

    // ************************************************************

    // Save all settings
    saveConfiguration() {
        // AlertSettings.setAlertInterval(this.alertFrequencyRef.current.value);
        AlertSettings.setTime(this.state.startTime, this.state.endTime);

        // Set Alert Times
        // Detect Change in Alert Settings
        if (AlertSettings.getManual() != this.state.manualAlert
            || AlertSettings.getAuto() != this.state.autoAlert) {
            AlertSettings.setManual(this.state.manualAlert);
            AlertSettings.setAuto(this.state.autoAlert);
            AlertSettings.setUpdateAlertSettings(true);
        }

        if (!this.state.autoAlert) {
            TableCache.setDisableScroll(false);
        }

        // Override all prices if enabled
        if (this.state.overrideGlobalPrices) {
            if (PriceSettings.getStartPrice() !== this.state.globalStartPrice
                || PriceSettings.getTargetPrice() !== this.state.globalTargetPrice) {
                AlertSettings.setUpdateAlertSettings(true);
            }


            PriceSettings.setGlobalStartPrice(this.state.globalStartPrice);
            PriceSettings.setGlobalTargetPrice(this.state.globalTargetPrice);
        }

        // Enable Price Detection
        if (PriceSettings.getPriceDetectionEnabled() !== this.state.enablePriceDetection) {
            AlertSettings.setUpdateAlertSettings(true);
            PriceSettings.setPriceDetectionEnabled(this.state.enablePriceDetection);
        }

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

        if (AlertSettings.getUpdateAlertSettings()) {
            var state = window.confirm("Are you sure you want to apply these changes? \n" +
                "New settings will be applied");
            if (!state) {
                this.setState({ saveSettings: false });
                AlertSettings.setUpdateAlertSettings(false);
                return;
            }

            window.alert("New settings applied");
            // Save to database
            this.setState({ saveSettings: true });
        }

        this.saveSettingsToDatabase(AlertSettings.getAlertSettings(), PriceSettings.getPriceSettings());
    }


    // **************************************************

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

    withinAlertTime() {
        const startTime = this.parseTime(AlertSettings.getStartTime());
        const endTime = this.parseTime(AlertSettings.getEndTime());

        const h = (date.getHours() + 8) >= 24 ? Math.abs(24 - (date.getHours() + 8))
            : date.getHours() + 8;
        const m = date.getMinutes();

        if (h >= 17 && h <= 24 || h >= 0 && h <= 8) {
            return false;
        }

        if (h >= startTime[0] && h <= endTime[0]) {
            if (m >= startTime[0] && m <= endTime[0]) {
                return true;
            }
        }
        return false;
    }

    setStartTime(time, timeString) {
        const _time = this.parseTime(timeString.toString().trim());

        if (_time[0] >= 17 && _time[0] <= 24 || _time[0] >= 0 && _time[0] <= 8) {

            window.alert('Market hours are between 9:00 AM and 17:00 PM');
        }

        this.setState({ startTime: timeString });
    }

    setEndTime(time, timeString) {
        const _time = this.parseTime(timeString.toString().trim());

        if (_time[0] >= 17 && _time[0] <= 24 || _time[0] >= 0 && _time[0] <= 8) {

            window.alert('Market hours are between 9:00 AM and 17:00 PM');
        }

        this.setState({ endTime: timeString });
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

        var t = [];
        var t2 = [];
        t.push(<>
            <p id="priceRange">Price Range</p>
            <div class="startPrice">
                <p id="startPriceLabel">Start Price</p>
                <NumberInput
                    isDisabled={!this.state.disableSetPrice}
                    onChange={this.setGlobalStartPrice}
                    style={{ top: '5px' }}
                    size="md" min={0} maxW={70} defaultValue={this.state.globalStartPrice} precision={2} step={0.2}>
                    <NumberInputField />
                    <NumberInputStepper >
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </div>
        </>);

        t2.push(<>
            <div class="endPrice">
                <p id="endPriceLabel">Target Price</p>
                <NumberInput
                    isDisabled={!this.state.disableSetPrice}
                    onChange={this.setGlobalTargetPrice}
                    size="md" min={0} maxW={70} defaultValue={this.state.globalTargetPrice} precision={2} step={0.2}>
                    <NumberInputField />
                    <NumberInputStepper >
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </div>
        </>);
        this.setState({ startPriceInput: t })
        this.setState({ targetPriceInput: t2 })
        this.setState({ disableSetPrice: !this.state.disableSetPrice });
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

        this.setState({ disableStartTime: e.target.checked });
        this.setState({ disableEndTime: e.target.checked });

        // Disable auto alert checkbox 
        this.setState({ autoDisabled: !this.state.autoDisabled });
    }

    // Checkbox that enables auto alert
    setAutoAlert(e) {
        this.setState({ autoAlert: e.target.checked });

        // Disable auto alert checkbox 
        this.setState({ manualDisabled: !this.state.manualDisabled });
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

        return [parseInt(hours), parseInt(minutes)];
    }

    // **************************************************
    // Add to Historical Table
    // **************************************************

    async idExists(target) {
        return new Promise(resolve => {
            if (this.state.clickedAlertTableRowID === null
                || this.state.clickedAlertTableRowID === undefined) {
                resolve(false);
            }
            resolve(true);
        });
    }

    addToHistorical(e) {
        this.addToHistoricalTable();
    }


    // Add to History Table
    async addToHistoricalTable() {
        const res = await this.idExists();
        if (!res) {
            window.alert('Please select a stock from your saved stocks table');
            return;
        }

        const target = parseInt(this.state.clickedAlertTableRowID);
        const json = TableCache.get(target);
        console.log('target ' + target);
        let txt;
        if (isNaN(target) || (target === null || target === undefined)) {
            window.alert("No target is clicked ");
        }
        else {
            var r = window.confirm("Add to Historical Table?");
            if (r == true) {
                txt = "Yes";
            } else {
                txt = "Cancel";
            }

            const jsonString = await this.getJSON(json);

            // if (txt === "Yes") {
            const res = await this.saveHistoricalData(jsonString);
            console.log('Historical data added? ' + res);
            // window.alert(returned message)             window.alert('Maximum stocks for portfolio exceeded, limit: 200 ');
            //}
        }
    }

    async saveHistoricalData(data) {
        await fetch('savehistoricaldata/temp/'.concat(data))
            .then(response => response.status)
            .then(response => {
                if (!response.ok) {
                    // 404 
                    return false;
                }
                else return true;
            })
            .catch(error => {
                console.log("error " + error) // 404
                return false;
            }
            );

        return false;
    }

    async getJSON(json) {
        const today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }

        var _today = yyyy + 'a' + mm + 'a' + dd;

        const obj = { Id: json.Id, Date: _today };
        var jsonString = JSON.stringify(obj);

        return jsonString;
    }

    // **************************************************
    // **************************************************
    // Display Stock
    // **************************************************

    // Triggered when a table row is clicked
    displayStock(stockID) {

        console.log('Clicked ' + stockID)

        var info = [];

        info.push(<h1 style={{ position: 'absolute', textAlign: 'center', left: '270px', color: 'white' }}>
            {TableCache.get(stockID).StockName}</h1>);

        info.push(<h2 style={{ position: 'absolute', textAlign: 'center', top: '75px', left: '270px', color: 'white' }}>
            Previous: {TableCache.getPreviousPrice(stockID)}</h2>);

        info.push(<h2 style={{ position: 'absolute', textAlign: 'center', top: '120px', left: '270px', color: 'white' }}>
            Price: {TableCache.get(stockID).CurrentPrice}</h2>);

        info.push(<h1 style={{ position: 'absolute', textAlign: 'center', left: '0px', color: 'white' }}>
            {TableCache.get(stockID).StockCode}</h1>);


        this.setState({ clickedAlertTableRowID: stockID });
        this.setState({ stockInfoName: info });

        this.setState({ updateStockInfo: true });
    }

    // **************************************************
    // **************************************************
    // Saved Stock Rows
    // **************************************************

    // Select Row Setter
    selectAlertTableRow(e) {
        const alertTableId = parseInt(e.target.id);
        this.setState({ clickedAlertTableRowID: alertTableId });
        this.setState({ isSelected: true });
        this.update(true);
    }

    setAddAlertTableRowBool(state) {
        this.setState({ addAlertTableRowBool: state });
        if (state === true) {
            this.update(true);
        }
    }

    removeStock(e) {
        if (this.state.clickedAlertTableRowID === null
            || this.state.clickedAlertTableRowID === undefined) {
            window.alert('Please select a stock from your saved stocks table');
            return;
        }
        var userselection = window.confirm("Are you sure you want to delete this stock ?");
        if (userselection == true) {
            this.setRemoveAlertTableRowBool(true);
            this.update(true);
        }
    }

    setRemoveAlertTableRowBool(state) {
        this.setState({ removeAlertTableRowBool: state });
        if (state === true) {
            this.update(true);
        }
    }

    setIsSelected(state) {
        this.setState({ isSelected: state });
        if (state === true) {
            this.update(true);
        }
    }

    render() {
        const selectMarket =
            <select class="selectMarket" name="Select Market" value="Bursa Malaysia">
                <option value="Bursa Malaysia" disabled>Bursa Malaysia</option>
            </select>;

        const alertFrequency =
            <select class="alertFrequency" name="Frequency"
                ref={this.alertFrequencyRef}
                disabled={this.state.disableStartTime}>
                <option value="60000">1 Minute</option>
                <option value="300000">5 Minutes</option>
                <option value="600000">10 Minutes</option>
                <option value="900000">15 Minutes</option>
                <option value="1800000">30 Minutes</option>
                <option value="3600000">1 Hour</option>
                <option value="10800000">3 Hours</option>
            </select>;

        const custom_alertFrequency = <input class="customalertFrequency" type="number" id="quantity"
            name="quantity" min="1" max="240" />

        const format = 'HH:mm';

        const startTime =
            <div class="startTime">
                <TimePicker defaultValue={moment('9:00', format)}
                    disabled={this.state.disableStartTime}
                    format={format}
                    value={moment(this.state.startTime, format)}
                    disabledHours={() => [17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8]}
                    onChange={this.setStartTime} />
            </div>;

        const endTime =
            <div class="endTime">
                <TimePicker defaultValue={moment('16:59', format)}
                    disabled={this.state.disableEndTime}
                    format={format}
                    value={moment(this.state.endTime, format)}
                    disabledHours={() => [17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3, 4, 5, 6, 7, 8]}
                    onChange={this.setEndTime} />
            </div>;

        const state = {
            toggleTab: false,
            showTab: this.showTab
        }

        return (
            <>
                <Box
                    style={{ position: 'absolute', top: '340px', left: '60px' }}
                    bg='rgb(40,40,40)'
                    boxShadow='sm'
                    height='305px'
                    width='62rem'
                    rounded="lg"
                    margin='auto'
                    zIndex='0'>

                    {this.state.stockInfoCode}
                    {this.state.stockInfoHeader}
                    {this.state.stockInfoPrevPrice}
                    {this.state.stockInfoCurrPrice}

                    <Button onClick={() => { this.setAddAlertTableRowBool(true) }}
                        style={{ position: 'absolute', bottom: '20px', right: '180px', width: '90px' }}>
                        Add <br />to Table</Button>

                    <Button onClick={this.removeStock}
                        style={{ position: 'absolute', bottom: '20px', right: '50px', width: '90px' }}>
                        Remove  <br /> from Table</Button>

                    <Button onClick={this.addToHistorical}
                        style={{ position: 'absolute', bottom: '20px', left: '40px', width: '90px' }}>
                        Add  <br /> to Historical</Button>
                </Box>
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

                                {/* <p id="alertFrequency">Alert Frequency</p>
                            {alertFrequency}*/}

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

                                    <label id="profitLoss">Change</label>
                                    <input class="profitLoss" type="checkbox" />

                                    <label id="profitLossPercentage">Change %</label>
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

                                    <label id="alertProfitLoss">Change</label>
                                    <input class="alertProfitLoss" type="checkbox" />

                                    <label id="alertProfitVolume">Volume</label>
                                    <input class="alertProfitVolume" type="checkbox" />
                                </div>
                            </div>

                            <div class="priceDetection">

                                {this.state.startPriceInput}

                                {this.state.targetPriceInput}


                                <label id="enablePriceCheck">Custom Price Detection</label>
                                <input class="enablePriceCheck" type="checkbox" checked={this.state.enablePriceDetection}
                                    onChange={this.setPriceDetectionEnabled} />

                                <label id="overridePrices">Change Prices</label>
                                <input class="overridePrices" type="checkbox"
                                    onChange={this.overrideGlobalPrices} />

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


                                <Button style={{ position: 'absolute', top: '170px', left: '1325px', zIndex: '-999' }}
                                    onClick={this.saveConfiguration}>Save Configuration</Button>

                            </div>

                            {/* 
                        <Button style={{ position: 'absolute', top: '135px', left: '410px' }}>Save</Button>
                    <Button style={{ position: 'absolute', top: '135px', left: '200px' }}>
                        Change Alert Settings</Button>*/}
                        </div>
                    </Box>

                    <StockTableTwo {...this} />
                    <SavedStockTable {...this} />

                </div>
            </>
        );
    }
}


