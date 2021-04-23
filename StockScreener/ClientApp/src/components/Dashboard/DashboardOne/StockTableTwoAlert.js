import React from 'react';
import { AlertReducer } from './js/AlertReducer.js';
import PriorityQueue from 'priority-q';
import throttle from 'lodash.throttle';
import * as cache from 'cache-base';
import AlertCache from './js/AlertCache.js';
import TableCache from './js/TableCache.js';
import AlertSettings from './js/AlertSettings.js';
import PriceSettings from './js/PriceSettings.js';
import SavedStockCache from './js/SavedStockCache.js';

// Replace with Redux
export class StockTableTwoAlert extends React.Component {
    constructor(props) {
        super(props);
        this.manualAlert = throttle(this.manualAlert, 1000);
        this.autoAlert = throttle(this.autoAlert, 1000);
        this.triggerAnimation = this.triggerAnimation.bind(this);

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

    /*
        if (window.performance) {
            console.info("window.performance work's fine on this browser");
          }
            if (performance.navigation.type == 1) {
              console.info( "This page is reloaded" );
            } else {
              console.info( "This page is not reloaded");
            } */

    // 404 if component does not mount
    async componentDidMount() {
        this.initialiseAlerts();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        /*   if (this.props.state.disableScrolling === false
               && AlertSettings.getManual()) {
               this.priority_queue.clear()
               clearInterval(this.animationTime);
               this.manualAlert(this.props.addToStyleMap);
               this.props.setScrollUpdate(false);
           }*/
        if (this.props.state.toggleAlert) {
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
                }
                // Trigger manual Alert
                else if (AlertSettings.getManual()) {
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
            }

            this.props.toggleAlert(false);
            AlertSettings.setUpdateAlertSettings(false);
        }
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        return (prevProps.state.tb2_scrollPosition);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.state.tb2_scrollPosition !== this.props.state.tb2_scrollPosition
            || nextProps.state.toggleAlert !== this.props.state.toggleAlert) {
            return true;
        }
        return false;
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
                    if (PriceSettings.startPrice() > PriceSettings.getTargetPrice())
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
                    if (PriceSettings.startPrice() > PriceSettings.getTargetPrice())
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


    render() {
        return null;
    }


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