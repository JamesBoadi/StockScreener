import React, { Component } from 'react';
import HistoryCache from './Portfolio/js/PortfolioCache';
import PortfolioCache from './Portfolio/js/PortfolioCache';
import * as signalR from '@aspnet/signalr';


export class DataFeed extends Component {
    static hubConnection = new signalR.HubConnectionBuilder()
        .withUrl('https://localhost:44362/stockfeed')
        .configureLogging(signalR.LogLevel.Information)
        .build();
    constructor(props) {
        super(props);

        // this.updateCache = false;
        this.lock = false;
        this.connected = false;
        this.keyCount = 0;
        this.updateStockInfo = false;

        this.state = {
            stockTableTwo: [],
            isStreaming: false,
            lock: false,
            hubConnection: null,
            request_Calls: -1,
            MAX_CALLS: 896,
            called: true,

        };
    }


    componentDidMount() {
        console.log('START THE FEED!')
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
                    resolve(false)
                }
                else if (count >= 3) {
                    clearInterval(this.interval)
                    resolve(true)
                }
                count++;
            }, 8000);
        });
    }

    /**
     * Starts the data feed and subscribes to a method on
     * the server which will retrieve the data. All Caches will
     * be populated through this method, if there is a faliure
     * the caches will be populated with the last successfully
     * fetched data.
     */
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
                    PortfolioCache.set(key, item);
                    HistoryCache.set(key, item);
                    // AlertCache.set(key, item);
                    // NotificationsCache.set(key, item); // Replace with factory, or something
                    if (!this.state.updateCache)
                        this.setState({ updateCache: false});
                    
                    if (count < 897) {
                        count += 1;
                    }
                    else {
                        count = 0;
                        console.log("Ok")
                     //   PortfolioCache.updateDataCallback(); // Updates data in portfolioo
                        
                        this.setState({ updateCache: true });
                        this.connected = true;
                    }
                })
            }) // Bind to constructor
            .catch(err => {
                console.log('Error while establishing hubConnection :( ')
                this.connected = false;
            }); // Redirect to 404 page

        const res = await this.connectionTimeout();
        this.props.getUpdateCache(!res);
        this.setState({ ...this.state, updateCache: !res, lock: res });
    }

    render() {
        return null;
    }
}
