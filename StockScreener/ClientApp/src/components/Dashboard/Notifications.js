import React, { Component, useCallback } from 'react';
import { FetchData } from './FetchData.js';
import { DownOutlined } from '@ant-design/icons';
import {
    Box
} from '@chakra-ui/react';
import { NotificationsContext } from './NotificationsContext';




/**
     * Starts the data feed and subscribes to a method on
     * the server which will retrieve the data. All Caches will
     * be populated through this method, if there is a faliure
     * the caches will be populated with the last successfully
     * fetched data, or EOD data when the session ends.
     */

export class Notifications extends Component {
    constructor(props) {
        super(props);

        this.notifications = this.notifications.bind(this);
        this.addToNotificationsMenu = this.addToNotificationsMenu.bind(this);

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
            notifications_temp: [],
            notifications: [
                /*    { <div style={{
                         position: 'absolute', color: "black", fontSize: '22px',
                         fontWeight: 800, float: 'left'
                     }}>
                         Notifications <br/>
                     </div> */
            ],
            updateNotifications: false,
            notificationsMenuVisible: false,

        };
    }

    componentDidMount() {

    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {

    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.lock !== nextState.lock) {
            return true;
        }
        return false;
    }




    // Add notification to Menu
    addToNotificationsMenu(stock, previousPrice, currentPrice,
        startPrice, targetPrice, state) {
        let notifications = this.state.notifications;

        let alert;
        switch (state) {
            case 3:
                alert = `${stock} has increased to a price of ${currentPrice}
                    from ${previousPrice} to ${startPrice} Bullish signal warning`
                break;
            case 2:
                alert = `${stock} has increased to a price of ${currentPrice}
                    from ${previousPrice} Bullish signal`
                break;
            case 1:
                alert = `${stock} has hit target price of ${targetPrice}
                    from ${previousPrice} to ${currentPrice} Bullish signal`
                break;
            case -1:
                alert = `${stock} has dropped to price of ${currentPrice}
                    from ${previousPrice} Bearish signal`
                break;
            case -2:
                alert = `${stock} has dropped to price of ${currentPrice}
                    from ${startPrice} Bearish signal warning`
                break;
            case -3:
                alert = `${stock} has hit target price of ${targetPrice}
                    from ${previousPrice} Bearish signal`
                break;
        }

        notifications.push(
            <div class="record"
                style={{ position: "relative", color: "grey", top: "10px" }}>
                {alert}
            </div>
        );

        this.setState({ updateNotifications: true });
        this.setState({ notifications_temp: notifications });
    }

    // Call notifications
    notifications(stock, previousPrice, currentPrice, state) {

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
        this.addToNotificationsMenu(stock, previousPrice, currentPrice,
            startPrice, targetPrice, state);
    }


    render() {
        return(
            <div>
             {/*   <NotificationsContext.Consumer>
                    {({ toggleTab, showTab }) => (
                        <div class="notifications">
                            <a
                                style={{
                                    color: 'white',
                                    position: 'absolute', top: '0px', left: '600px',
                                }} onClick={this.enableNotificationsMenu}>
                                Notifications UNITE <DownOutlined />
                            </a>

                            <div >
                                <div class="dropdown-content">
                                    <Box
                                        style={{ position: 'absolute' }}
                                        visibility={(toggleTab) ? 'visible' : 'hidden'}
                                        min-width='16.25rem'
                                        width='16.25rem'
                                        height='17.25rem'
                                        overflowY='auto'
                                        bg='#f9f9f9'
                                        top='35px'
                                        left='60px'
                                        backgroundColor='wheat.511'
                                        zIndex='999'
                                    >
                                        {this.state.notifications}
                                    </Box>
                                </div>
                            </div>
                        </div>
                    )}
                            </NotificationsContext.Consumer>*/}
                <FetchData {...this} updateCache={this.props.updateCache} />
            </div>
        );
    }

}