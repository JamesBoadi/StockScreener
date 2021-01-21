import React from 'react';

export let StockTableTwo = props => {


    // Add the Row
    addRow = () => {

        let i;
        for (i = 0; i < 20; i++) {
            tableOne.push(<tbody>

                <tr>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                </tr>

            </tbody>)
        }
    }

    return (
        <table class="stockTableTwo" aria-labelledby="tabelLabel">
            <thead>
                <tr>
                    <th>Stock Name</th>
                    <th>WL</th>
                    <th>Detect Time</th>
                    <th>Detect Price</th>
                    <th>High Price</th>
                    <th>Last Price</th>
                    <th>Gain</th>
                    <th>Gain %</th>
                    <th>Volume</th>
                    <th>Scalp Status</th>
                    <th>TP price</th>
                    <th>Alert Status</th>
                    <th>Catalyst</th>
                    <th>Sector</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Berglunds snabbköp</td>
                    <td>Christina Berglund</td>
                    <td>Sweden</td>
                    <td>Christina Berglund</td>
                    <td>Sweden</td>
                    <td>Berglunds snabbköp</td>
                    <td>Christina Berglund</td>
                    <td>Sweden</td>
                    <td>Christina Berglund</td>
                    <td>Sweden</td>
                    <td>Berglunds snabbköp</td>
                    <td>Christina Berglund</td>
                    <td>Sweden</td>
                    <td>Christina Berglund</td>
                </tr>
            </tbody>
        </table>);

}