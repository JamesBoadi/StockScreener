import React from 'react';

export const StockTableOne = props => {

    let table = [];

    let tableOne = <div id="table-wrapper">
        <div id="table-scroll">
            <table class="stockTableOne" aria-labelledby="tabelLabel">
           
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
                </tr>
                    {table}
                </tbody>
            </table>
        </div>
    </div>;

/**
 

 */




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
                </tr>
            )
        }
    }

    addRow();

    return tableOne;
}