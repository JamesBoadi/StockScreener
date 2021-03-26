import React from 'react';
import { AlertReducer } from './js/AlertReducer.js';
import { FetchData } from './FetchData.js';
import PriorityQueue from 'priority-q';
import throttle from 'lodash.throttle';
import * as cache from 'cache-base';
import AlertCache from './js/AlertCache.js';
import PriceSettings from './js/PriceSettings.js';

// Replace with Redux
export class StockTableTwoAlert extends React.Component {
    constructor(props) {
        super(props);

        this.manualAlert = throttle(this.manualAlert, 1000);
        this.triggerAnimation = this.triggerAnimation.bind(this);
        this.addToQueue = this.addToQueue.bind(this);
        this.shift = this.shift.bind(this);

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
            animationsCache: new cache()
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
    componentDidMount() {
        this.test = setInterval(() => {
            if (this.props.state.enableAlerts) {

                this.setState({ cache: AlertCache.cache() });

                let mod;

                if (this.props.state.tb2_scrollPosition === 0)
                    mod = 0;
                else
                    mod = 15;

                const start = (this.props.state.tb2_scrollPosition * 50) - mod;
                const end = (this.props.state.tb2_scrollPosition * 50) + 50;

                this.start = start;
                this.end = end;
                let pointer = start;

                while (pointer < end) {
                    var currentPrice_state = parseInt(AlertCache.get(pointer).ChangeArray[0]);
                    var state = AlertReducer(currentPrice_state);

                    if (currentPrice_state !== 0) {
                        this.queue.push(pointer);
                        // Update existing element
                        this.array[pointer] = [pointer, state, 5000];
                    }
                    pointer++;
                }

                this.manualAlert(this.props.addToStyleMap);

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
                        }, 60000); // No interval on manual mode
                    }

                    if (this.state.queueCount >= this.props.state.maximumAlertNotifications) {
                        clearInterval(this.interval)
                    }

                }, 8000);//this.props.state.alertInterval); 

                clearInterval(this.test);
            }
        }, 6000);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {




        if (this.props.state.disableScrolling === false) {
            this.priority_queue.clear()
            clearInterval(this.animationTime);
            this.manualAlert(this.props.addToStyleMap);
            this.props.setScrollUpdate(false);
        }

        /*  if (this.props.state.disableScrolling === false) {
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

    getSnapshotBeforeUpdate(prevProps, prevState) {
        return (prevProps.state.tb2_scrollPosition);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.state.tb2_scrollPosition !== this.props.state.tb2_scrollPosition) {
            return true;
        }
        return false;
    }

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
    /** order = 1 (push to the end) order = 0 (push to the front) */
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
                  }*/
            //}
        }
        else {
            console.log('nope ' + ' start ' + startIndex + ' end ' + endIndex + ' end ' + this.queue.length)

        }

    }

    triggerAnimation(callback, array) {
        let pointer = -1;
        //    console.log(array)
        this.animationTime = setInterval(() => {
            if (this.priority_queue.length === 0) {
                clearInterval(this.animationTime);
                // this.setState({ update_priorityQueue: true });
            }

            let index = parseInt(this.priority_queue.dequeue())

            for (const [key, value] of array.entries()) {

                if (index == parseInt(value)) {
                    const item = array[index];
                    const count = item[0];
                    const state = item[1];
                    const delay = item[2];

                    callback(count, state, delay, 0);

                    break;
                }
            }
        }, 6000);
    }

    // Trigger alert manually by scroll
    manualAlert(callback) {
        let mod;
        let endMod = 50;
        if (this.props.state.tb2_scrollPosition === 0) {
            mod = 0;
        }
        else if (this.props.state.tb2_scrollPosition === 17) {
            endMod = 47;
            mod = 0;
        }
        else {
            mod = 15;
        }

        const start = parseInt((this.props.state.tb2_scrollPosition * 50) - mod);
        const end = (this.props.state.tb2_scrollPosition * 50) + endMod;

        this.start = start;
        this.end = end;

        // Add stocks to array and priority priority_queue;
        let pointer = start;
        while (pointer < end) {
            const cache = AlertCache.get(pointer);
            const inRange = (cache.CurrentPrice >= PriceSettings.getStartPrice() &&
                cache.CurrentPrice <= PriceSettings.getTargetPrice());
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
                }
            } else {
                if (currentPrice_state !== 0) {
                    // Prevent adding an element twice
                    if (this.priority_queue.includes(pointer) == false)
                        this.priority_queue.enqueue(pointer);

                    // Update existing element
                    this.array[pointer] = [pointer, state, 1600];
                }
            }

            pointer++;
        }

        if (this.priority_queue.length !== 0)
            this.triggerAnimation(callback, this.array);
    }

    /*
    Create function for scrolling directly to alert
    scrollToAlert()
    {
    }*/

    render() {
        return null;
    }

}