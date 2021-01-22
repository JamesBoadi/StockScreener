import React from 'react';
import { render } from 'react-dom';

export let StockTableTwo = props => {
    
    let table = [];

    
    // Add the Row
    function addRow() {
        let i;
        for (i = 0; i < 305; i++) {
            table.push(
                <tr>
                <td>1</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
            </tr>
            )
        }
    }

    addRow();

    let tableTwo = <div id="table-wrapper">
        <div id="table-scroll">
            <table class="stockTableTwo" aria-labelledby="tabelLabel">

                <thead>

                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                    </tr>
                    {table}
                </tbody>
            </table>
        </div>
    </div>;

    return tableTwo;
}