import React from 'react';
import { AlertReducer } from './AlertReducer.js';
import { FetchData } from './FetchData.js';

import * as Queue from 'queue';



// Replace with Redux
export class NotificationsAlert extends React.Component {
    constructor(props) {
        super(props);

        this.eventQueue = this.eventQueue.bind(this);
        this.queue = Queue({ animation: [] });
        this.animationIdQueue = Queue({ id: [] });

        // Create priority queue for animations not shown yet
        //............. = new

        this.state = {
            animationTime: 0
        };
    }

    componentDidMount() {
        this.queue.start(function (err) {
            if (err) throw err
            console.log('all done:', q.results)
        });

        this.intervalID = setInterval(() => {
            this.eventQueue(this.props.cache, this.props.triggerAnimation)
        }, 5000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    /** callback: animation time */
    eventQueue(cache, callback) {
        let count;
        for (count = 0; count < 897; count++) {
            const currentPrice = parseInt(cache.get(count).changeArray[0]);
            const state = AlertReducer(currentPrice);
            this.setState({ animationTime: this.state.animationTime + 5 }, () => {
                // Add a timeout between changes
                // Every 60 seconds, 1 Render, Add +5 seconds per transition, etc: 1) rgb(...) 5s 2) rgb (...) 10s
                this.queue.push(callback(state, this.state.animationTime));
            });
        }
    }

}