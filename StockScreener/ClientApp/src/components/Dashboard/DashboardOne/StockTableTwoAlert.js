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

        // Notifications
        this.enableNotificationsMenu = this.enableNotificationsMenu.bind(this);
        this.initialiseNotifications = this.initialiseNotifications.bind(this);
        this.addToNotificationsMenu = this.addToNotificationsMenu.bind(this);
        
        this.notifications = this.notifications.bind(this);

        // Create priority priority_queue for animations not shown yet
        //............. = new
        this.array = [];
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
            animationsCache: new cache(),
            isUpdating: false
        };
    }


    // 404 if component does not mount
    async componentDidMount() {

        if (this.withinAlertTime()) {
            this.initialiseAlerts();
        }

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        /*   if (this.props.state.disableScrolling === false
               && AlertSettings.getManual()) {
               this.priority_queue.clear()
               clearInterval(this.animationTime);
               this.manualAlert(this.props.addToStyleMap);
               this.props.setScrollUpdate(false);
           }*/
        if (TableSettings.getSettings()) {
            console.log('NEW SETTINGS?')
            if (this.state.isUpdating) { // If there are aniimations in progress
                this.props.toggleAlert(false);
                AlertSettings.setUpdateAlertSettings(false);
                return;
            }

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
                    if (this.animationTime !== undefined) {
                        clearInterval(this.animationTime);
                    } if (this.autoInterval !== undefined) {
                        clearInterval(this.autoInterval);
                    }
                    if (this.manualInterval !== undefined) {
                        clearInterval(this.autoInterval);
                    }
                } else {
                    // Proceed with alerts
                  //  if (this.withinAlertTime()) {
                        // Trigger manual Alert
                        if (AlertSettings.getManual()) {
                            if (this.animationTime !== undefined) {
                                clearInterval(this.animationTime);
                            }
                            if (this.autoInterval !== undefined) {
                                clearInterval(this.autoInterval);
                            }
                            if (this.manualInterval !== undefined) {
                                clearInterval(this.autoInterval);
                            }
                            TableCache.setDisableScroll(false);
                            console.log('Called! Manual Alert! 2')
                            this.manualAlert(this.props.addToStyleMap);
                        } // Trigger Auto Alert
                        else if (AlertSettings.getAuto()) {
                            if (this.animationTime !== undefined) {
                                clearInterval(this.animationTime);
                            } if (this.autoInterval !== undefined) {
                                clearInterval(this.autoInterval);
                            }
                            if (this.manualInterval !== undefined) {
                                clearInterval(this.autoInterval);
                            }
                            console.log('Called! Auto Alert! 2')
                            this.autoAlert(this.props.addToStyleMap);
                        }
                    //}
                }
            }

            TableSettings.setSettings(false);
            AlertSettings.setUpdateAlertSettings(false);
        }
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        return (prevProps.state.tb2_scrollPosition);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.state.tb2_scrollPosition !== this.props.state.tb2_scrollPosition
            || nextProps.state.toggleAlert !== this.props.state.toggleAlert
            ||  nextState.notificationsMenuVisible !== this.state.notificationsMenuVisible
            || nextState.updateNotifications !== this.state.updateNotifications
            
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


    // Initialise alert rows from database
    async initialiseAlerts() {
        // Read notifications from database
        await fetch('getdashboardonealerts/')
            .then(response => response.json())
            .then(response => {
                this.addFirstRows(response)
            }
                //   
            )
            .catch(error => {
                console.log("error " + error) // 404
                return;
            }
            );
    }

    addFirstRows(response) {
        if (response.length === 0)
            return;

        this.setState({ isUpdating: true });

        for (var i = 0; i < response.length; i++) {
            const item = JSON.parse(response[i]);
            this.priority_queue.enqueue(item.Id);
            this.array[i] = item.Attribute;
        }

        this.triggerAnimation(this.props.addToStyleMap, this.array);
    }

    // Save alert rows into database
    async saveAlerts(alert) {
        // Read notifications from database
        await fetch('savedashboardonealerts/'.concat(alert))
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

    // Save alert rows into database
    async deleteAlerts(id) {
        // Read notifications from database
        await fetch('deletedashboardonealerts/'.concat(id))
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

    triggerAnimation(callback, array) {
        this.animationTime = setInterval(() => {
            if (this.priority_queue.length === 0) {
                console.log('Continue animation ');
                this.setState({ isUpdating: false });
                clearInterval(this.animationTime);
                this.setState({ continueAnimation: true }) // this.setState({ update_priorityQueue: true });
            }
            let index = parseInt(this.priority_queue.dequeue()) // Change Order Of Priority queue to change order of array

            for (const [key, value] of array.entries()) {

                if (index == parseInt(value)) {
                    const item = array[index];
                    const count = item[0];
                    const state = item[1];
                    const delay = item[2];

                    this._addToNotificationsMenu(count); // Sync to notifications
                    callback(count, state, delay, 0);
                    this.deleteAlerts(index);
                    break;
                }
            }
        }, 7200);
    }

    // Trigger alert automatically
    autoAlert(callback) {
        // FETCH SAVE TO DATABASE
        let prevArray = [] // FFetch
        TableCache.setDisableScroll(true);
        this.setState({ continueAnimation: true });
        this.autoInterval = setInterval(() => {
            if (this.state.continueAnimation) {
                console.log('Call Animation ');

                // Add stocks to array and priority priority_queue;
                let pointer = 0;
                while (pointer < 897) {
                    const cache = AlertCache.get(pointer);
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
                            // Prevent adding an element twice
                            if (this.priority_queue.includes(pointer) == false)
                                this.priority_queue.enqueue(pointer);

                            //this.priority_queue
                            // Update existing element
                            this.array[pointer] = [pointer, state, 1600];
                            this.array[pointer] = [pointer, state, 1600];
                            const obj = { Id: pointer, Attribute: this.array[pointer] };
                            this.saveAlerts(JSON.stringify(obj)); //

                        }
                    } else {
                        if (currentPrice_state !== 0) {
                            // Prevent adding an element twice
                            if (this.priority_queue.includes(pointer) == false)
                                this.priority_queue.enqueue(pointer);

                            // Update existing element
                            this.array[pointer] = [pointer, state, 1600];
                            const obj = { Id: pointer, Attribute: this.array[pointer] };
                            this.saveAlerts(JSON.stringify(obj));
                        }
                    }
                    pointer++;
                }

                if (this.priority_queue.length !== 0)
                    this.triggerAnimation(callback, this.array);

                this.setState({ continueAnimation: false })
            }

        }, AlertSettings.getAlertInterval());
    }

    // Trigger alert manually
    manualAlert(callback) {
        TableCache.setDisableScroll(false);
        this.setState({ continueAnimation: true });
        this.manualInterval = setInterval(() => {
            if (this.state.continueAnimation) {
                console.log('NEXT ');

                // Add stocks to array and priority priority_queue;
                let pointer = 0;
                while (pointer < 897) {
                    const cache = AlertCache.get(pointer);

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
                            // Prevent adding an element twice
                            if (this.priority_queue.includes(pointer) == false)
                                this.priority_queue.enqueue(pointer);

                            // Update existing element
                            this.array[pointer] = [pointer, state, 1600];
                            this.array[pointer] = [pointer, state, 1600];
                            const obj = { Id: pointer, Attribute: this.array[pointer] };
                            this.saveAlerts(JSON.stringify(obj));

                        }
                    } else {
                        if (currentPrice_state !== 0) {
                            // Prevent adding an element twice
                            if (this.priority_queue.includes(pointer) == false)
                                this.priority_queue.enqueue(pointer);

                            // Update existing element
                            this.array[pointer] = [pointer, state, 1600];
                            this.array[pointer] = [pointer, state, 1600];
                            const obj = { Id: pointer, Attribute: this.array[pointer] };
                            this.saveAlerts(JSON.stringify(obj));

                        }
                    }
                    pointer++;
                }

                if (this.priority_queue.length !== 0)
                    this.triggerAnimation(callback, this.array);

                this.setState({ continueAnimation: false })
            }

        }, AlertSettings.getAlertInterval());
    }

    // **************************************************
    // Save Notifications
    // **************************************************

    async saveNotifications(notifications) {
        await fetch('savenotifications/{query?}'.concat(notifications))
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

    // Add Notifications to notifications menu
    async _addToNotificationsMenu(pointer) {
        const defaultInterval = 60000;
        const clickedAlertTableRowID = this.state.clickedAlertTableRowID

     //   let pointer = 0;//this.state.start;
        const end = 897;//this.state.end;

        // Add the database (last known pointer)
        //this.notificationsDelayInterval = setInterval(() => {
            // const stock = this.stockDashBoardMap.get(pointer).StockCode;
            // const localStartPrice = this.stockDashBoardMap.get(pointer).LocalStartPrice;
            // const localTargetPrice = this.stockDashBoardMap.get(pointer).LocalTargetPrice;
            const stock = TableCache.get(pointer).StockCode;
            const currentPrice_state = parseInt(TableCache.get(pointer).ChangeArray[0]);

            if (currentPrice_state === 0) {
                pointer++;
            }

            const currentPrice = parseInt(TableCache.get(pointer).CurrentPrice);
            const previousPrice = parseInt(TableCache.getPreviousPrice(pointer));

            let obj = this.notifications(pointer, stock, previousPrice, currentPrice, currentPrice_state);
            this.saveNotifications(JSON.stringify(obj)); // Save to database
/*
            if (pointer++ >= end) {
                pointer = 0; // Add the database (last known pointer)
            }
        }, 7000);*/
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
                from ${previousPrice} to ${startPrice} \n Bullish signal warning`
                break;
            case 2:
                alert = `${stock} has increased to a price of ${currentPrice}
                from ${previousPrice} \n Bullish signal`
                break;
            case 1:
                alert = `${stock} has hit target price of ${targetPrice}
                from ${previousPrice} to ${currentPrice} \n Bullish signal`
                break;
            case -1:
                alert = `${stock} has dropped to price of ${currentPrice}
                from ${previousPrice} \n Bearish signal`
                break;
            case -2:
                alert = `${stock} has dropped to price of ${currentPrice}
                from ${startPrice} \n Bearish signal warning`
                break;
            case -3:
                alert = `${stock} has hit target price of ${targetPrice}
                from ${previousPrice} \n Bearish signal`
                break;
        }
        const date=  new Date();
        const h = (date.getHours() + 8) >= 24 ? Math.abs(24 - (date.getHours() + 8))
            : date.getHours() + 8;
        const m = date.getMinutes().toPrecision(2);
        const time = 'Alert Time: ' + h + ' : ' + m;

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

        const obj =
        {
            Id: id,
            Alert: alert,
            Time: time
        }

        this.setState({ notifications_temp: notifications });
        this.setState({ updateNotifications: true });

        return obj;
    }

    // Call notifications
    notifications(id, stock, previousPrice, currentPrice, state) {
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

        }
        /*   console.log('POINTER ' + stock + ' STATE ' + state + ' current 150 ' + ' startPrice ' + localStartPrice
               + ' targetPrice ' + localTargetPrice);*/

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
  let pointer = -1;
 
  for (let index = 0; index < this.queue.length; index++) {
      contains = (this.queue[index] === node);
 
      if (contains)
          continue;
      // Add to queue
      newQueue[++pointer] = this.queue[index];
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
 
let pointer = -1;
let stackPointer = -1;
if (startIndex >= 0 && endIndex <= this.queue.length &&
  startIndex < endIndex) {
  for (let index = 0; index < this.queue.length; index++) {
      if (index >= startIndex && index <= endIndex) {
          stack[++stackPointer] = this.queue[index];
      }
      else {
          newQueue[++pointer] = this.queue[index];
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
        let pointer = this.temp_queue.length;
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