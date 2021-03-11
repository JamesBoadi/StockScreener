import React from 'react';
import { AlertReducer } from './AlertReducer.js';
import { FetchData } from './FetchData.js';

import PriorityQueue from 'priority-queue-js';

// Replace with Redux
export class StockTableTwoAlert extends React.Component {
    constructor(props) {
        super(props);

        this.eventQueue = this.eventQueue.bind(this);
        this.triggerAnimation = this.triggerAnimation.bind(this);

        // Create priority queue for animations not shown yet
        //............. = new

        this.array = [];

        this.state = {
            animationTime: 5000
        };
    }



    componentDidMount() {
        this.queue = new PriorityQueue({});
        this.eventQueue(this.props.cache, this.props.addToStyleMap);

        /*this.queue.start(function (err) {
            if (err) throw err
            console.log('all done:', this.queue.animation)
        });*/

        this.intervalID = setInterval(() => {
            this.eventQueue(this.props.cache, this.props.addToStyleMap)
        }, 600000);

    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    triggerAnimation(callback) {

        var delay_;
        // seed first call and store interval (to clear later)
        var interval = setInterval(() => {
            // increment, and if we're past array, clear interval
            const item = this.queue.shift();

            if (item === -1) {
                callback(this.props.state.target, "rgb(21,100,111)", 0);
            }
            // console.log('item ' + item + ' i ' + i);
            const array = this.array[item];
            const count = array[0];
            const state = array[1];
            const delay = array[2];

            delay_ = delay;

            //   console.log('count ' +this.array[item]);

            console.log('count ' + count + ' state ' + state);

            callback(count, state, 1700);

            if (this.queue.length === 0)
                clearInterval(interval);
        }, 13000);

        //console.log('good  ' + delay_);
    }



    // Add a timeout between changes
    // Every 60 seconds, 1 Render, Add +5 seconds per transition, etc: 1) rgb(...) 5s 2) rgb (...) 10s

    /** callback: animation time */
    eventQueue(cache, callback) {
        let mod;
  
        if (this.props.state.tb2_scrollPosition === 0)
            mod = 0;
        else
            mod = 15;

        const start = (this.props.state.tb2_scrollPosition * 50) - mod;
        const end = (this.props.state.tb2_scrollPosition * 50) + 50;

        if (this.props.state.isSelected) {
            this.queue.push(-1);
            this.array.push([pointer, state, 0]);
        }

        // Add to array and priority queue;
        let pointer = start;
        while (pointer < end) {
            var currentPrice = parseInt(cache.get(pointer.toString()).ChangeArray[0]);

            var state = AlertReducer(currentPrice);
            if (currentPrice !== 0) {
                //   console.log('vote ' + currentPrice);
                this.queue.push(pointer);
                this.array[pointer] = [pointer, state, 5000];
                // 
            }
            pointer++;
        }

        this.triggerAnimation(callback);
    }

    render() {
        return null;
    }

}