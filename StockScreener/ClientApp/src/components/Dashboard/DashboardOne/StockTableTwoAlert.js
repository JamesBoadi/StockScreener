import React from 'react';
import { AlertReducer } from './AlertReducer.js';
import { FetchData } from './FetchData.js';
import PriorityQueue from 'priority-queue-js';

import throttle from 'lodash.throttle';

// Replace with Redux
export class StockTableTwoAlert extends React.Component {
    constructor(props) {
        super(props);

        this.eventQueue = throttle(this.eventQueue, 1000);
        this.triggerAnimation = this.triggerAnimation.bind(this);


        // Create priority queue for animations not shown yet
        //............. = new

        this.array = [];


        this.state = {
            animationTime: 5000
        };
    }


    // 404 if component does not mount
    componentDidMount() {
        this.queue = new PriorityQueue({});
        this.eventQueue(this.props.cache, this.props.addToStyleMap);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        //    if(snapshot !== null || snapshot !== undefined)
        //  {
        if (this.props.state.disableScrolling === false


        ) {//this.props.state.scrollUpdated) {
            //console.log('snapshot ' + snapshot)

            this.eventQueue(this.props.cache, this.props.addToStyleMap);

            this.props.setScrollUpdate(false);
        }
        //}
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        return prevProps.state.tb2_scrollPosition;
    }


    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.state.tb2_scrollPosition !== this.props.state.tb2_scrollPosition) {
            return true;
        }
        return false;
    }

    triggerAnimation(callback) {

        this.interval = setInterval(() => {
            const item = this.queue.shift();

            if (item === -1) {
                callback(this.props.state.target, "rgb(21,100,111)", 0, 1);
            }

            const array = this.array[item];
            const count = array[0];
            const state = array[1];
            const delay = array[2]; 

            callback(count, state, 1700, 0);

            if (this.queue.length === 0) {
                clearInterval(this.interval);
            }

        }, 11000);

        //console.log('good  ' + delay_);
    }

    // Add a timeout between changes
    // Every 60 seconds, 1 Render, Add +5 seconds per transition, etc: 1) rgb(...) 5s 2) rgb (...) 10s
    /** callback: animation time */
    eventQueue(cache, callback) {
        clearInterval(this.interval);
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

        // Add stocks to array and priority queue;
        let pointer = start;
        while (pointer < end) {
            var currentPrice = parseInt(cache.get(pointer.toString()).ChangeArray[0]);

            var state = AlertReducer(currentPrice);
            if (currentPrice !== 0) {
                this.queue.push(pointer);
                this.array[pointer] = [pointer, state, 5000];
            }
            pointer++;
        } console.log('start ' + start + ' end ' + end);

        this.triggerAnimation(callback);
    }

    /*
    Enable/Disable scroll to position
    scrollToAlert()
    {
 
    }*/

    render() {
        return null;
    }

}