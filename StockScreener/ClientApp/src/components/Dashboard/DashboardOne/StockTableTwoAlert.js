import React from 'react';
import { AlertReducer } from './js/AlertReducer.js';
import PriorityQueue from 'priority-q';
import throttle from 'lodash.throttle';
import * as cache from 'cache-base';
import AlertCache from './js/AlertCache.js';
import TableCache from './js/TableCache.js';
import AlertSettings from './js/AlertSettings.js';
import PriceSettings from './js/PriceSettings.js';
import TableSettings from './js/TableSettings.js';
import SavedStockCache from './js/SavedStockCache.js';

import {
    Box, Button
} from '@chakra-ui/react';

const date = new Date();

// Replace with Redux
export class StockTableTwoAlert extends React.Component {
    constructor(props) {
        super(props);
        this.manualAlert = throttle(this.manualAlert, 1000);
        this.autoAlert = throttle(this.autoAlert, 1000);
        this.triggerAnimation = this.triggerAnimation.bind(this);
        this.randomizeStack = this.randomizeStack.bind(this);

        // Notifications
        this.enableNotificationsMenu = this.enableNotificationsMenu.bind(this);
        this.initialiseNotifications = this.initialiseNotifications.bind(this);
        this.addToNotificationsMenu = this.addToNotificationsMenu.bind(this);
        this.saveNotifications = this.saveNotifications.bind(this);
        this.notifications = this.notifications.bind(this);
        this.addFirstNotifications = this.addFirstNotifications.bind(this);
        this._addToNotificationsMenu = this._addToNotificationsMenu.bind(this);

        // Create priority priority_queue for animations not shown yet
        //............. = new
        this.array = [];
        this.stack = [];
        this.priority_queue = new PriorityQueue();
        this.queue = [];
        this.queue_Length = 0;
        this.queue_End = 0;
        this.start = 0;
        this.end = 0;
        this.updateCache = false;

        this.state = {
            animationTime: 5000,
            queueCount: 0,
            update_priorityQueue: false,
            triggerAnimation: false,
            start: 0,
            end: 0,
            cache: null,
            continueAnimation: true,
            disableAnimation: false,
            animationsCache: new cache(),
            isUpdating: false,

            // Notifications
            notifications_temp: [],
            notifications: [
                /*    { <div style={{
                         position: 'absolute', color: "black", fontSize: '22px',
                         fontWeight: 800, float: 'left'
                     }}>
                         Notifications <br/>
                     </div> */
            ],
        };
    }


    // 404 if component does not mount
    async componentDidMount() {
        this.initialiseNotifications();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.disableAnimation) {
            // Within alert time()
            if (AlertSettings.getManual()) {
                if (this.animationTime !== undefined || this.animationTime !== null) {
                    clearInterval(this.animationTime);
                    this.priority_queue.clear();
                    this.stack = [];
                }
                if (this.autoInterval !== undefined || this.autoInterval !== null) {
                    clearTimeout(this.autoInterval);
                    this.priority_queue.clear();
                    this.stack = [];
                }
                if (this.manualInterval !== undefined || this.manualInterval !== null) {
                    clearTimeout(this.manualInterval);
                    this.priority_queue.clear();
                    this.stack = [];
                }
                TableCache.setDisableScroll(false);
                console.log('Restart manual')
                this.manualAlert(this.props.addToStyleMap);
            } else if (AlertSettings.getAuto()) {
                if (this.animationTime !== undefined || this.animationTime !== null) {
                    clearInterval(this.animationTime);
                    this.priority_queue.clear();
                    this.stack = [];
                }
                if (this.autoInterval !== undefined || this.autoInterval !== null) {
                    clearTimeout(this.autoInterval);
                    this.priority_queue.clear();
                    this.stack = [];
                }
                if (this.manualInterval !== undefined || this.manualInterval !== null) {
                    clearTimeout(this.manualInterval);
                    this.priority_queue.clear();
                    this.stack = [];
                }
                console.log('Restart auto')
                this.autoAlert(this.props.addToStyleMap);
            }

            this.setState({ continueAnimation: true });
            this.setState({ disableAnimation: false });
        }
        if (this.props.state.toggleAlert) {
            // If there are aniimations in progress
            if (this.state.isUpdating) {
                this.props.toggleAlert(false);
                AlertSettings.setUpdateAlertSettings(false);
                return;
            }/*else if (!this.withinAlertTime()) {
                window.alert('Time is outside of alert hours' );

                if (this.animationTime !== undefined || this.animationTime !== null) {
                    clearInterval(this.animationTime);
                    this.priority_queue.clear();
                } if (this.autoInterval !== undefined || this.autoInterval !== null) {
                    clearTimeout(this.autoInterval);
                    this.priority_queue.clear();
                }
                if (this.manualInterval !== undefined || this.manualInterval !== null) {
                    clearTimeout(this.manualInterval);
                    this.priority_queue.clear();
                }

                this.props.toggleAlert(false);
                AlertSettings.setUpdateAlertSettings(false);
                return;
            }*/

            let changeSettings = true;
            if (AlertSettings.triggerSettings() == 1 && !AlertSettings.getUpdateAlertSettings())
                changeSettings = false;
            else if (AlertSettings.triggerSettings() == 0)
                changeSettings = true;

            if (AlertSettings.triggerSettings() == 0)
                AlertSettings.setTriggerSettings(1);

            console.log('change settings ' + changeSettings);

            if (changeSettings) {
                // Clear all Alerts
                if (!AlertSettings.getManual() && !AlertSettings.getAuto()) {
                    this.priority_queue.clear()
                    if (this.animationTime !== undefined || this.animationTime !== null) {
                        clearInterval(this.animationTime);
                        this.priority_queue.clear();
                        this.stack = [];
                    } if (this.autoInterval !== undefined || this.autoInterval !== null) {
                        clearTimeout(this.autoInterval);
                        this.priority_queue.clear();
                        this.stack = [];
                    }
                    if (this.manualInterval !== undefined || this.manualInterval !== null) {
                        clearTimeout(this.manualInterval);
                        this.priority_queue.clear();
                        this.stack = [];
                    }
                } else {
                    // Trigger manual Alert
                    if (AlertSettings.getManual()) {
                        if (this.animationTime !== undefined || this.animationTime !== null) {
                            clearInterval(this.animationTime);
                            this.priority_queue.clear();
                            this.stack = [];
                        }
                        if (this.autoInterval !== undefined || this.autoInterval !== null) {
                            clearTimeout(this.autoInterval);
                            this.priority_queue.clear();
                            this.stack = [];
                        }
                        if (this.manualInterval !== undefined || this.manualInterval !== null) {
                            clearTimeout(this.manualInterval);
                            this.priority_queue.clear();
                            this.stack = [];
                        }
                        TableCache.setDisableScroll(false);
                        console.log('Called! Manual Alert! 2')
                        this.manualAlert(this.props.addToStyleMap);
                    } // Trigger Auto Alert
                    else if (AlertSettings.getAuto()) {
                        if (this.animationTime !== undefined || this.animationTime !== null) {
                            clearInterval(this.animationTime);
                            this.priority_queue.clear();
                            this.stack = [];
                        }
                        if (this.autoInterval !== undefined || this.autoInterval !== null) {
                            clearTimeout(this.autoInterval);
                            this.priority_queue.clear();
                            this.stack = [];
                        }
                        if (this.manualInterval !== undefined || this.manualInterval !== null) {
                            clearTimeout(this.manualInterval);
                            this.priority_queue.clear();
                            this.stack = [];
                        }
                        console.log('Called! Auto Alert! 2')
                        this.autoAlert(this.props.addToStyleMap);
                    }
                }
            }
            this.setState({ disableAnimation: false });
            this.props.toggleAlert(false);
            AlertSettings.setUpdateAlertSettings(false);
        }
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        return (prevProps.state.tb2_scrollPosition);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (
            nextProps.state.toggleAlert !== this.props.state.toggleAlert
            || nextState.notificationsMenuVisible !== this.state.notificationsMenuVisible
            || nextState.updateNotifications !== this.state.updateNotifications
            || nextState.continueAnimation !== this.state.continueAnimation
            || nextState.disableAnimation !== this.state.disableAnimation

        ) {
            return true;
        }
        return false;
    }

    // Calculate times
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

    // Parse Time
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


    // Save alert rows into database
    async saveAlerts(alert) {
        await fetch('savealerts/dashboardOne/'.concat(alert))
            .then(response => response.status)
            .then(response => {
                if (!response) {

                }
            }
            )
            .catch(error => {
                console.log("error " + error) // 404
                return;
            }
            );
    }

    // Get last alert indexes (use elsewhere)
    async initialiseAlerts() {
        await fetch('getalerts/dashboardOne')
            .then(response => response.json())
            .then(response => {
                this.addFirstRows(response)
            }
            )
            .catch(error => {
                console.log("error " + error) // 404
                return;
            }
            );
    }

    addFirstRows(response) {
        if (response.length === 0 || response === null || response === undefined) {
            // Restart Animation
            console.log('Is empty ');
            //  this.setState({ disableAnimation: true });
            return;
        }

        this.setState({ isUpdating: true });

        for (var i = 0; i < response.length; i++) {
            const item = JSON.parse(response[i]);
            this.priority_queue.enqueue(item.Id);
            this.array[i] = item.Index;
        }

        const stack = this.randomizeStack(response.length);
        this.triggerAnimation(this.props.addToStyleMap, this.array, stack);
    }

    /*
    // Trigger alert automatically
    initialAlert(callback) {
        // FETCH SAVE TO DATABASE
        this.setState({ continueAnimation: true });
        TableCache.setDisableScroll(true);
        this.autoInterval = setInterval(() => {
            // If the animation is safe to continue
            if (this.state.continueAnimation) {
                console.log('Call Animation ');

                // Add stocks to array and priority priority_queue;
                let index = 0;
                let length = 0;
                while (index < 897) {
                    const cache = AlertCache.get(index);
                    let inRange = 0;

                    // Bearish
                    if (PriceSettings.getStartPrice() > PriceSettings.getTargetPrice())
                        inRange = (cache.CurrentPrice <= PriceSettings.getStartPrice() &&
                            cache.CurrentPrice >= PriceSettings.getTargetPrice());
                    else // Bullish
                    {
                        inRange = (cache.CurrentPrice >= PriceSettings.getStartPrice() &&
                            cache.CurrentPrice <= PriceSettings.getTargetPrice());
                    }

                    const priceDetectionEnabled = PriceSettings.getPriceDetectionEnabled();
                    const currentPrice_state = parseInt(cache.ChangeArray[0]);
                    const state = AlertReducer(currentPrice_state);

                    if (priceDetectionEnabled) {
                        //console.log('STATE 2' + state + '  ' + currentPrice_state);
                        if (inRange) {
                            if (currentPrice_state !== 0) {
                                // Prevent adding an element twice
                                if (this.priority_queue.includes(index) == false) {
                                    this.priority_queue.enqueue(index);
                                    length++;
                                }

                                // Update existing element
                                this.array[index] = [index, state, 1600];
                                this.array[index] = [index, state, 1600];
                                const obj = { Id: index, Attribute: this.array[index] };
                                this.saveAlerts(JSON.stringify(obj)); // Save alerts to database                                
                            }
                        }
                    } else {
                        if (currentPrice_state !== 0) {
                            // Prevent adding an element twice
                            if (this.priority_queue.includes(index) == false) {
                                this.priority_queue.enqueue(index);
                                length++;
                            }

                            // Update existing element
                            this.array[index] = [index, state, 1600];
                            const obj = { Id: index, Attribute: this.array[index] };
                            this.saveAlerts(JSON.stringify(obj));
                        }
                    }
                    index++;
                }

                const stack = this.randomizeStack(length);
                if (stack.length === 0) {
                    // Restart Animation
                    this.setState({ disableAnimation: true });
                    return;
                }

                this.triggerAnimation(callback, this.array, stack);
                this.setState({ continueAnimation: false });
            }

        }, AlertSettings.getAlertInterval());
    }*/

    // Save alert rows into database
    async deleteAlerts(id) {
        // Read notifications from database
        await fetch('deletealerts/dashboardOne/'.concat(id))
            .then(response => response.json())
            .then(response => {
            }
                //   this.addFirstRows(response)
            )
            .catch(error => {
                console.log("error " + error) // 404
                return;
            }
            );
    }

    triggerAnimation(callback, array, stack) {


        this.animationTime = setInterval(() => {
            if (stack.length === 0) {
                //   console.log('Continue animation ');
                this.setState({ isUpdating: false });
                this.setState({ continueAnimation: false });
                this.setState({ disableAnimation: true });
                clearInterval(this.animationTime);
            }

            let index = stack.pop();

            for (const [key, value] of array.entries()) {
                if (index == parseInt(value)) {
                    // TableCache.setDisableScroll(true);
                    const item = array[index];
                    const count = parseInt(item[0]);
                    const state = item[1];
                    const delay = item[2];

                    console.log(' index ' + index);

                    this._addToNotificationsMenu(index); // Sync to notifications
                    callback(count, state, delay, 0);
                    this.deleteAlerts(JSON.stringify(index));
                    this.setState({ updateNotifications: false });
                    break;
                }
            }
        }, 7200);
    }

    // Trigger alert automatically
    autoAlert(callback) {
        // FETCH SAVE TO DATABASE
        this.setState({ continueAnimation: true });
        TableCache.setDisableScroll(true);
        this.autoInterval = setTimeout(() => {
            // If the animation is safe to continue
            if (this.state.continueAnimation) {
                console.log('Call Animation ');

                // Add stocks to array and priority priority_queue;
                let index = 0;
                let length = 0;
                while (index < 897) {
                    const cache = AlertCache.get(index);
                    let inRange = 0;

                    // Bearish
                    if (PriceSettings.getStartPrice() > PriceSettings.getTargetPrice())
                        inRange = (cache.CurrentPrice <= PriceSettings.getStartPrice() &&
                            cache.CurrentPrice >= PriceSettings.getTargetPrice());
                    else // Bullish
                    {
                        inRange = (cache.CurrentPrice >= PriceSettings.getStartPrice() &&
                            cache.CurrentPrice <= PriceSettings.getTargetPrice());
                    }

                    const priceDetectionEnabled = PriceSettings.getPriceDetectionEnabled();
                    const currentPrice_state = parseInt(cache.ChangeArray[0]);
                    const state = AlertReducer(currentPrice_state);

                    if (priceDetectionEnabled) {
                        //console.log('STATE 2' + state + '  ' + currentPrice_state);
                        if (inRange) {
                            if (currentPrice_state !== 0) {
                                // Prevent adding an element twice
                                if (this.priority_queue.includes(index) == false) {
                                    this.priority_queue.enqueue(index);
                                    this.saveAlerts(JSON.stringify({ Id: index, State: currentPrice_state }));
                                    length++;
                                }

                                // Update existing element
                                this.array[index] = [index, state, 1600]
                            }
                        }
                    } else {
                        if (currentPrice_state !== 0) {
                            // Prevent adding an element twice
                            if (this.priority_queue.includes(index) == false) {
                                this.priority_queue.enqueue(index);
                                this.saveAlerts(JSON.stringify({ Id: index, State: currentPrice_state }));
                                length++;
                            }

                            // Update existing element
                            this.array[index] = [index, state, 1600];
                        }
                    }
                    index++;
                }

                const stack = this.randomizeStack(length);
                if (stack.length === 0) {
                    // Restart Animation
                    this.setState({ disableAnimation: true });
                    return;
                }

                this.triggerAnimation(callback, this.array, stack);
                this.setState({ continueAnimation: false });
            }

        }, 10000);// AlertSettings.getAlertInterval()
    }

    // Trigger alert manually
    manualAlert(callback) {
        TableCache.setDisableScroll(false);
        this.setState({ continueAnimation: true })
        this.manualInterval = setTimeout(() => {
            if (this.state.continueAnimation) {
                console.log('NEXT ');

                // Add stocks to array and priority priority_queue;
                let index = 0;
                let length = 0;
                while (index < 897) {
                    const cache = AlertCache.get(index);

                    let inRange = 0;

                    // Bearish
                    if (PriceSettings.getStartPrice() > PriceSettings.getTargetPrice())
                        inRange = (cache.CurrentPrice <= PriceSettings.getStartPrice() &&
                            cache.CurrentPrice >= PriceSettings.getTargetPrice());
                    else // Bullish
                    {
                        inRange = (cache.CurrentPrice >= PriceSettings.getStartPrice() &&
                            cache.CurrentPrice <= PriceSettings.getTargetPrice());
                    }

                    const priceDetectionEnabled = PriceSettings.getPriceDetectionEnabled();
                    const currentPrice_state = parseInt(cache.ChangeArray[0]);
                    const state = AlertReducer(currentPrice_state);

                    if (priceDetectionEnabled) {
                        //console.log('STATE 2' + state + '  ' + currentPrice_state);
                        if (inRange) {
                            if (currentPrice_state !== 0) {
                                // Prevent adding an element twice
                                if (this.priority_queue.includes(index) == false) {
                                    this.priority_queue.enqueue(index);
                                    this.saveAlerts(JSON.stringify({ Id: index, State: currentPrice_state }));
                                    length++;
                                }

                                // Update existing element
                                this.array[index] = [index, state, 1600];
                            }
                        }
                    } else {
                        if (currentPrice_state !== 0) {
                            // Prevent adding an element twice
                            if (this.priority_queue.includes(index) == false) {
                                this.priority_queue.enqueue(index);
                                this.saveAlerts(JSON.stringify({ Id: index, State: currentPrice_state }));
                                length++;
                            }

                            // Update existing element
                            this.array[index] = [index, state, 1600]
                        }
                    }
                    index++;
                }

                const stack = this.randomizeStack(length);
                if (stack.length === 0) {
                    // Restart Animation
                    this.setState({ disableAnimation: true });
                    return;
                }

                this.triggerAnimation(callback, this.array, stack);
                this.setState({ continueAnimation: false })
            }

        }, 10000);// AlertSettings.getAlertInterval()
    }

    randomizeStack(length) {
        let stack = [];
        while (stack.length < length) {
            const index = parseInt(this.priority_queue.dequeue())
            stack.push(index);
        }

        let counter = length;
        while (0 !== counter) {
            let randId = Math.floor(Math.random() * length);
            // Swap it with the current element.
            let tmp = stack[counter];
            stack[counter] = stack[randId];
            stack[randId] = tmp;

            counter--;
        }

        return stack;
    }

    // **************************************************
    // Initialise Notifications
    // **************************************************

    // Initialise alert rows from database
    async initialiseNotifications() {
        // Read notifications from database
        await fetch('getallnotifications')
            .then(response => response.json())
            .then(response =>
                this.addFirstNotifications(response)
            )
            .catch(error => {
                console.log("error " + error) // 404
                return;
            }
            );
    }

    addFirstNotifications(response) {
        if (response === null || response === undefined) {
            console.log('OG ');
            return;
        }   

        var notifications = [];
        for (var i = 0; i < response.length; i++) {
            const item = JSON.parse(response[i]);

            console.log('item ' + item.Alert + '  ' + item.TimeStamp);

            notifications.push(
                <div class="record"
                    style={{
                        position: "relative", color: "black", top: "10px",
                        fontFamily: 'Times New Roman', letterSpacing: '1.5px'
                    }}>
                    {item.Alert}
                    <br />
                    {item.TimeStamp}
                </div>
            );
        }

        this.setState({ notifications_temp: notifications });
        this.setState({ updateNotifications: true });
    }

    // **************************************************

    // **************************************************
    // Save Notifications
    // **************************************************

    async saveNotifications(notifications) {
        await fetch('savenotifications/'.concat(notifications))
            .then(response => response.status)
            .catch(error => {
                console.log("error " + error) // 404
                return false;
            }
            );

        return false;
    }

    // Add Notifications to notifications menu
    async _addToNotificationsMenu(index) {
        const stock = TableCache.get(index).StockCode;
        const currentPrice_state = parseInt(TableCache.get(index).ChangeArray[0]);
        const currentPrice = parseInt(TableCache.get(index).CurrentPrice);
        const previousPrice = parseInt(TableCache.getPreviousPrice(index));

        let obj = this.notifications(index, stock, previousPrice, currentPrice, currentPrice_state);

        //if (!(obj === null || obj === undefined))
        this.saveNotifications(JSON.stringify(obj));
    }

    // **********************************************************

    // Enable/Disable Menu of Notifications
    enableNotificationsMenu(e) {
        this.setState({ notificationsMenuVisible: !this.state.notificationsMenuVisible })
    }

    // Initialise Notifications
    initialiseNotifications(alert, time) {
        let notifications = this.state.notifications;

        notifications.push(
            <div class="record"
                style={{
                    position: "relative", color: "black", top: "10px",
                    fontFamily: 'Times New Roman', letterSpacing: '1.5px'
                }}>
                {alert}
                <br />
                {time}
            </div>
        );

        this.setState({ notifications_temp: notifications });
        this.setState({ updateNotifications: true });
    }

    // Add notification to Menu
    addToNotificationsMenu(id, stock, previousPrice, currentPrice,
        startPrice, targetPrice, state) {
        let notifications = this.state.notifications;

        let alert;
        switch (state) {
            case 3:
                alert = `${stock} has increased to a price of ${currentPrice}
                prev: ${previousPrice} start price: ${startPrice}  Bullish signal warning`
                break;
            case 2:
                alert = `${stock} has increased to a price of ${currentPrice}
                prev: ${previousPrice} Bullish signal`
                break;
            case 1:
                alert = `${stock} has hit target price of ${targetPrice}
                prev: ${previousPrice} current: ${currentPrice} Bullish signal`
                break;
            case -1:
                alert = `${stock} has dropped to price of ${currentPrice}
                prev: ${previousPrice} Bearish signal`
                break;
            case -2:
                alert = `${stock} has dropped to price of ${currentPrice}
                start price: ${startPrice} Bearish signal warning`
                break;
            case -3:
                alert = `${stock} has hit target price of ${targetPrice}
                prev: ${previousPrice} Bearish signal`
                break;
        }
        const date = new Date();
        const h = (date.getHours() + 7) >= 24 ? Math.abs(24 - (date.getHours() + 7))
            : date.getHours() + 7;
        let m = date.getMinutes().toPrecision(2);

        if (m < 10) {
            m = date.getMinutes();
        }
        const time = 'Alert Time: ' + h.toString() + ':' + m;

        notifications.push(
            <div class="record"
                style={{
                    position: "relative", color: "black", top: "10px",
                    fontFamily: 'Times New Roman', letterSpacing: '1.5px'
                }}>
                {alert}
                <br />
                {time}
            </div>
        );
        let obj;
        if (!(alert === null || alert === undefined)) {
            obj =
            {
                Id: parseInt(id),
                Alert: alert.toString(),
                TimeStamp: time
            }
        }


        this.setState({ notifications_temp: notifications });
        this.setState({ updateNotifications: true });

        return obj;
    }

    // Call notifications
    notifications(id, stock, previousPrice, currentPrice, state) {
        let targetPrice;
        let startPrice;

        let globalStartPrice = PriceSettings.getStartPrice();
        let globalTargetPrice = PriceSettings.getTargetPrice();

        startPrice = globalStartPrice;
        targetPrice = globalTargetPrice;

        // User specifies a Bearish criteria
        if (startPrice > targetPrice) {
            if (currentPrice > startPrice) {

                state = 3; // Override state
            } else if (currentPrice < targetPrice) {
                state = -3;
            }

            // User specifies a Bullish criteria
        } else if (startPrice < targetPrice) {

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
        }

        // Default states: 2, -1
        const obj = this.addToNotificationsMenu(id, stock, previousPrice, currentPrice,
            startPrice, targetPrice, state);

        return obj;
    }

    render() {
        return (
            <>
                <Button
                    class="toggleNotifications"
                    onClick={this.enableNotificationsMenu}>
                    Notifications
                </Button>

                <div class="dropdown-content">
                    <Box
                        style={{ position: 'absolute' }}
                        visibility={(this.state.notificationsMenuVisible) ? 'visible' : 'hidden'}
                        min-width='19.25rem'
                        width='22.25rem'
                        height='40.25rem'
                        overflowY='auto'
                        bg='rgb(230,230,230)'
                        top='52px'
                        left='1115px'
                        backgroundColor='wheat.800'
                        zIndex='999'
                    >
                        {this.state.notifications}
                    </Box>
                </div>
            </>
        );
    }


    /*
        if (window.performance) {
            console.info("window.performance work's fine on this browser");
          }
            if (performance.navigation.type == 1) {
              console.info( "This page is reloaded" );
            } else {
              console.info( "This page is not reloaded");
            } */
    /* 
          /*  this.startAnimation = setInterval(() => {
            if (this.props.state.enableAlerts) {
                // Trigger manual Alert
                if (AlertSettings.getManual()) {
                    console.log('Called! Manual Alert! ')
                    TableCache.setDisableScroll(false);
                    this.manualAlert(this.props.addToStyleMap);
                } // Trigger auto Alert
                else if (AlertSettings.getAuto()) {
                    console.log('Called! Auto Alert! ')
                    this.autoAlert(this.props.addToStyleMap);
                }
                clearInterval(this.startAnimation); // Start the Animation and clear the interval
            }
        }, 6000);*/
    /*
    this.interval = setInterval(() => {
        if (this.state.update_priorityQueue) {
            this.manualAlert(this.props.addToStyleMap);
            this.setState({ queueCount: this.state.queueCount + 1 })
            this.setState({ update_priorityQueue: false })
        }
        else {
            // Retry
            this.retry = setInterval(() => {
                if (this.state.update_priorityQueue) {
                    this.manualAlert(this.props.addToStyleMap);
                    this.setState({ queueCount: this.state.queueCount + 1 })
                    this.setState({ update_priorityQueue: false })
                    clearInterval(this.retry)
                }
            }, 60000); // No interval on manual mode (Default is 1 Minute)
        }

        if (this.state.queueCount >= this.props.state.maximumAlertNotifications) {
            clearInterval(this.interval)
        }

    }, 8000);//this.props.state.alertInterval); // Animation Alert Interval
 
addToQueue(node) {
this.queue_Length += 1;
this.queue.push(node);
}
 
removeFromQueue(node) {
var newQueue = [];
if (this.queue_Length > 1) {
  this.queue_Length -= 1;
  let contains;
  let index = -1;
 
  for (let index = 0; index < this.queue.length; index++) {
      contains = (this.queue[index] === node);
 
      if (contains)
          continue;
      // Add to queue
      newQueue[++index] = this.queue[index];
  }
  this.queue = newQueue;
}
else {
  if (this.queue.length === 0)
      return;
 
  this.queue_Length -= 1;
  if (this.queue[0] === node) {
      this.queue = [];
  }
}
}
 
 
 
// Take a slice of the queue and reorder it
/** order = 1 (push to the end) order = 0 (push to the front) 
shift(startIndex, endIndex, order) {
var newQueue = [];
var stack = [];
 
let index = -1;
let stackPointer = -1;
if (startIndex >= 0 && endIndex <= this.queue.length &&
  startIndex < endIndex) {
  for (let index = 0; index < this.queue.length; index++) {
      if (index >= startIndex && index <= endIndex) {
          stack[++stackPointer] = this.queue[index];
      }
      else {
          newQueue[++index] = this.queue[index];
      }
  }
  console.log('old queue ' + newQueue + ' \n new queue \n ' + stack)
  this.queue = [];
  /*  // push to the front
    if (order == 1) {
        for (let index = 0; index < newQueue.length; index++) {
            this.queue.push(newQueue[index]);
        }
        for (let index = 0; index < stack.length; index++) {
            this.queue.push(stack[index]);
        }
 
    } else { // push to the end end
        for (let index = 0; index < stack.length; index++) {
            this.queue.push(stack[index]);
        }
        for (let index = 0; index < newQueue.length; index++) {
            this.queue.push(newQueue[index]);
        }
  //}
}
else {
  console.log('nope ' + ' start ' + startIndex + ' end ' + endIndex + ' end ' + this.queue.length)
 
}
 
}
 
 
 
 
 
if (this.props.state.disableScrolling === false) {
    this.manualAlert(this.props.cache, this.props.addToStyleMap);
 
    let start = this.state.start;
    let end = this.state.end;
 
    this.temp_queue = new PriorityQueue();
    let stack = [];
 
    // Scroll Up: < 0
    if (this.props.state.tb2_scrollPosition - snapshot < 0) {
        // Retrieve stocks from end of priority_queue
        this.temp_queue = this.priority_queue.slice(this.start, this.end);
 
        if (this.temp_queue.length === 0) {
            console.log('DAWG its empty')
        }// return;                 
        for (const [key, value] of this.temp_queue.entries()) {
            this.addToQueue(value);
        }
 
        // Remove largest items and push back
        //  this.shift(this.start, this.end, 1);
 
        console.log('up temp queue ' + this.temp_queue + '\n queue \n' + this.queue)
    }
    else { // Scroll Down: > 0
        this.temp_queue = this.priority_queue.slice(this.start, this.end);
        let index = this.temp_queue.length;
        if (this.temp_queue.length === 0) {
            console.log('DAWG its empty')
        }// return;        
 
        if (this.temp_queue.length === 0) {
            console.log('DAWG its empty')
        }
 
        for (const [key, value] of this.temp_queue.entries()) {
            this.addToQueue(value);
        }
 
        // Remove smallest 50 items and push to the end
        //  this.shift(this.start, this.end, 1);
 
        //  this.shift(this.end - (this.end - this.start), this.end, 0);
        console.log('down temp queue ' + this.temp_queue + '\n queue \n' + this.queue)
    }
 
    this.props.setScrollUpdate(false);*/
    //}
}