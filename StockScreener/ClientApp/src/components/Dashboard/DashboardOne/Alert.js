import React from 'react';
import {AlertReducer} from './AlertReducer.js';
import { FetchData } from './FetchData.js';

import * as Queue from 'queue';
// Replace with Redux
export class Alert extends React.Component {
    constructor(props) {
        super(props);

        this.eventQueue = this.eventQueue.bind(this);
        this.animation = this.animation.bind(this);
        this.queue = Queue({ results: ["a"] });

        this.state = {
            lock: false,
            redirect: 0
        };
    }

    eventQueue(changeArray, callback) {
        const currentPrice = parseInt(changeArray[0]);
        const state = AlertReducer(currentPrice);
        this.queue.push(this.animation);
     
    this.queue.start(function (err) {
        if (err) throw err
        console.log('all done:', q.results)
      })

    }
  
    animation()
    {

        console.log('STATE 2' );
    }

    render() {
        return (
            <div>
                <FetchData {...this} />
            </div>
        );
    }
}