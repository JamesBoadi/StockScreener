import React, { Component, useState, useContext } from 'react';
import { Stack, HStack, Checkbox, CheckboxGroup } from "@chakra-ui/react";
//import { FetchData } from './DashboardOne/FetchData.js';

export class DashboardSettings extends Component {

    constructor(props) {
        super(props);
        this.cache = new Map();
        //   this.redirect.bind(this);

        this.state = {
            lock: false,
            redirect: 0
        };
    }

    render() {
        let hideColumns =
            <div class="containerDiv">

                <div class="rowDivHeader">
                    <div class="cellDivHeader">Column</div>
                    <div class="cellDivHeader">Hide Column</div>
                </div>

                <div class="rowDiv">
                    <div class="cellDiv">Stock Name</div>
                    <div class="cellDiv">
                        <input type="checkbox" />
                    </div>
                </div>
                <div class="rowDiv">
                    <div class="cellDiv">WL</div>
                    <div class="cellDiv">
                        <input type="checkbox" />
                    </div>
                </div>
                <div class="rowDiv">
                    <div class="cellDiv">Detect Time</div>
                    <div class="cellDiv">
                        <input type="checkbox" />
                    </div>
                </div>
                <div class="rowDiv">
                    <div class="cellDiv">Detect Price</div>
                    <div class="cellDiv">
                        <input type="checkbox" />
                    </div>
                </div>
                <div class="rowDiv">
                    <div class="cellDiv">High Price</div>
                    <div class="cellDiv">
                        <input type="checkbox" />
                    </div>
                </div>
                <div class="rowDiv">
                    <div class="cellDiv">Last Price</div>
                    <div class="cellDiv">
                        <input type="checkbox" />
                    </div>
                </div>
                <div class="rowDiv">
                    <div class="cellDiv">Gain</div>
                    <div class="cellDiv">
                        <input type="checkbox" />
                    </div>
                </div>
                <div class="rowDiv">
                    <div class="cellDiv">Gain %</div>
                    <div class="cellDiv">
                        <input type="checkbox" />
                    </div>
                </div>
                <div class="rowDiv">
                    <div class="cellDiv">Scalp Status</div>
                    <div class="cellDiv">
                        <input type="checkbox" />
                    </div>
                </div>
                <div class="rowDiv">
                    <div class="cellDiv">TP price</div>
                    <div class="cellDiv">
                        <input type="checkbox" />
                    </div>
                </div>
                <div class="rowDiv">
                    <div class="cellDiv">Alert Status</div>
                    <div class="cellDiv">
                        <input type="checkbox" />
                    </div>
                </div>
                <div class="rowDiv">
                    <div class="cellDiv">Catalyst</div>
                    <div class="cellDiv">
                        <input type="checkbox" />
                    </div>
                </div>
                <div class="rowDiv">
                    <div class="cellDiv">Sector</div>
                    <div class="cellDiv">
                        <input type="checkbox" />
                    </div>
                </div>
            </div>;






        /*        <div id="table-wrapper">
        
                    <div id="table-scroll">
                        <table class="stockTableOne" aria-labelledby="tabelLabel">
        
                            <thead>
                                <th>Column</th>
                                <th>Hide column</th>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Stock Name</td>
                                    <td>WL</td>
                                    <td>Detect Time</td>
                                    <td>Detect Price</td>
                                    <td>High Price</td>
                                    <td>Last Price</td>
                                    <td>Gain</td>
                                    <td>Gain %</td>
                                    <td>Volume</td>
                                    <td>Scalp Status</td>
                                    <td>TP price</td>
                                    <td>Alert Status</td>
                                    <td>Catalyst</td>
                                    <td>Sector</td>
                                </tr>
                                <tr>
                                    <td>Stock Name</td>
                                    <td>WL</td>
                                    <td>Detect Time</td>
                                    <td>Detect Price</td>
                                    <td>High Price</td>
                                    <td>Last Price</td>
                                    <td>Gain</td>
                                    <td>Gain %</td>
                                    <td>Volume</td>
                                    <td>Scalp Status</td>
                                    <td>TP price</td>
                                    <td>Alert Status</td>
                                    <td>Catalyst</td>
                                    <td>Sector</td>
                                </tr>
        
                            </tbody>
                        </table>
                    </div>
                </div>;
                    <input type="checkbox">Bullish</input>
                    <input type="checkbox">Highl Bullish</input>

                    
                    <label class="container">Highly Bullish
                        <input type="checkbox" />
                       
                    </label>
                */

        return (
            <div>

                <div class="checkBoxContainer">

                    <label class="containerOne">Bullish
                    <input type="checkbox" />
                    </label>

                    <label class="containerTwo">Highly Bullish
                    <input type="checkbox" />
                    </label>

                    <label class="containerTwo">Reversal Signal
                    <input type="checkbox" />
                    </label>

                    <label class="containerTwo">High Momentum Stocks
                    <input type="checkbox" />
                    </label>

                    <label class="containerTwo">Show My Stocks
                    <input type="checkbox" />
                    </label>

                </div>

                {hideColumns}

            </div>
        );
    }












}
