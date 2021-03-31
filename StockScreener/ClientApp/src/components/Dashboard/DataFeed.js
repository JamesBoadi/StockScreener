import React, { Component } from 'react';

import DashboardTwoTableCache from '../Dashboard/DashboardTwo/js/DashboardTwoTableCache';
import * as signalR from '@aspnet/signalr';


export class DataFeed extends Component {

    static hubConnection = new signalR.HubConnectionBuilder()
        .withUrl('https://localhost:44362/stockfeed')
        .configureLogging(signalR.LogLevel.Information)
        .build();

    state = {
        stockTableTwo: [],
        isStreaming: false,
        lock: true,
        hubConnection: null,
        request_Calls: -1,
        MAX_CALLS: 896,
        called: true,
        updateCache: false,
    };

    componentDidMount() {
        this.startDataFeed();
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
      
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.lock !== nextState.lock) {
            return true;
        }
        return false;
    }

    async connectionTimeout() {
        var count = 0;

        return new Promise(resolve => {
            this.interval = setInterval(() => {
                // Number of retries allowed: 3
                if (this.connected == true) {
                    clearInterval(this.interval)
                    resolve(true)
                }
                else if (count >= 3) {
                    clearInterval(this.interval)
                    resolve(false)
                }
                count++;
            }, 8000);
        });
    }

    async startDataFeed() {
        var count = 0;

        await DataFeed.hubConnection
            .start()
            .then(() => {
                console.log('Successfully connected');
                DataFeed.hubConnection.on('lockStream', function (request_Calls) {
                    // Add Timeout
                    this.request_Calls = request_Calls;
                })
                DataFeed.hubConnection.on('requestData', (key, data) => {
                    let item = JSON.parse(data);
                    DashboardTwoTableCache.set(key, item);
                   // AlertCache.set(key, item);
                   // NotificationsCache.set(key, item);

                    if (count < 897) {
                        count += 1;
                    }
                    else {
                        count = 0;
                        console.log("Ok")
                        this.connected = true;
                    }
                })
            }) // Bind to constructor
            .catch(err => {
                console.log('Error while establishing hubConnection :( ')
                this.connected = false;
            }); // Redirect to 404 page

        const res = await this.connectionTimeout();
        this.setState({ ...this.state, updateCache: res, lock: res });
    }




    render() {
        return null;
    }
}
