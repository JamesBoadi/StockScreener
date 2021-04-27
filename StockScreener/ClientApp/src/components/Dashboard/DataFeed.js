import React, { Component } from 'react';
import HistoryCache from './Historical/js/HistoryCache';
import PortfolioCache from './Portfolio/js/PortfolioCache';
import PortfolioCalc from './Portfolio/js/PortfolioCalc';
import TableCache from './DashboardOne/js/TableCache.js';
import SavedStockCache from './DashboardOne/js/SavedStockCache.js';
import AlertCache from './DashboardOne/js/AlertCache.js';
import ScannerCache from './Scanner/js/ScannerCache.js';
import DashboardTwoCache from './DashboardTwo/js/DashboardTwoCache.js';
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

    async componentDidMount() {
        // console.log('START THE FEED!')
        localStorage.setItem('_connectionEstablished', false);
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
     * Gets the timezone by identifier as
     * well as the total time elapsed, can 
     * only be called if a user is logged in 
     * and triggers the alert interval, as 
     * long as the settings persist before the 
     * user logs out
     */
    async detectTimeZone() {
        // Fill Cache with EOD data
        await fetch('detectTimeZone')
            .then(response => response.json())
            .then(response => {
                //.set(key, item);
            })
            .catch(error => {
                console.log("error " + error) // 404
                // Last successfully catched data
                return;
            }
            );
    }

    /*End Of Day Data */
    async eodData() {
        // Fill Cache with EOD data
        await fetch('geteod/data')
            .then(response => response.json())
            .then(response => {
                for (var key = 0; key < response.length; key++) {
                    const item = JSON.parse(response[key]);

                    // Scanner
                    ScannerCache.set(key, item);

                    // DashboardTwo 
                    DashboardTwoCache.set(key, item);

                    PortfolioCache.set(key, item);
                   // PortfolioCalc.setGross();
                    HistoryCache.set(key, item);

                    // Dashboard One
                    TableCache.set(key, item);
                    AlertCache.set(key, item);
                    SavedStockCache.set(key, item);
                }
            })
            .catch(error => {
                console.log("error " + error) // 404
                // Last successfully catched data
                return;
            }
            );
    }

    /**
     * Starts the data feed and subscribes to a method on
     * the server which will retrieve the data. All Caches will
     * be populated through this method, if there is a faliure
     * the caches will be populated with the last successfully
     * fetched data, or EOD data when the session ends.
     */
    async startDataFeed() {
        var count = 0;

        // Create a Manager class
        await DataFeed.hubConnection
            .start()
            .then(() => {
                console.log('Successfully connected');
                DataFeed.hubConnection.on('lockStream', (request_Calls, sessionEnded) => {
                    // Add Timeout
                    this.request_Calls = request_Calls;

                    const exists = localStorage.getItem('sessionEnded')
                    if (exists === null || exists === undefined) {
                        localStorage.setItem('sessionEnded', sessionEnded);
                    }
                    else if (exists !== sessionEnded) {
                        localStorage.removeItem('sessionEnded');
                        localStorage.setItem('sessionEnded', sessionEnded)
                    }

                    this.eodData(); // EOD data

                    console.log('session ENDED' + sessionEnded)
                })
                DataFeed.hubConnection.on('requestData', (key, data) => {
                    const item = JSON.parse(data);

                    // Scanner
                    ScannerCache.set(key, item);

                    // DashboardTwo 
                    DashboardTwoCache.set(key, item);

                    PortfolioCache.set(key, item);
                    HistoryCache.set(key, item);

                    // Dashboard One
                    TableCache.set(key, item);
                    AlertCache.set(key, item);
                    SavedStockCache.set(key, item);

                    if (!this.state.updateCache)
                        this.setState({ updateCache: false });

                    if (count < 897) {
                        count += 1;
                    }
                    else {
                        count = 0;
                        console.log("Ok")
                        //   PortfolioCache.updateDataCallback(); // Updates data in portfolioo
                        TableCache.setFill(true);
                        DashboardTwoCache.setFill(true);
                        this.setState({ updateCache: true });
                        this.connected = true;
                    }
                })
            }) // Bind to constructor
            .catch(err => {
                console.log('Error while establishing hubConnection :( ')
                this.eodData();
                this.connected = false;
            }); // Redirect to 404 page

        const res = await this.connectionTimeout();
        this.props.getUpdateCache(!res);
        this.setState({ ...this.state, updateCache: !res, lock: res });
        localStorage.setItem('_connectionEstablished', !res);
    }

    render() {
        return null;
    }
}
