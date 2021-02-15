import React, { Component } from 'react';
import { createTableMultiSort, Column, Table } from 'react-virtualized';
import ReactDOM from 'react-dom';
import { render } from 'react-dom';
import { FetchData } from './DashboardOne/FetchData';

function RenderTable(WrappedComponent, nextState, data) {
// Fetch data for dash board one
return class extends Component {

    constructor(props) {
        super(props);
     
        let style = { color: "white;" }
        this.state = {

             // Subscribe to data feed for each row rendered
            table: [],
            tableTwo: [],
            count: 1,
            numberOfClicks: []
        };
    }



    highlightRow(nextState) {
     /*   var target = this.props.id;
        var style = {};

        let id;
        let mod = 0;
        for (id = 0; id < 897; id++) {
            if (id == target)
                style = { backgroundColor: "rgb(0,11,34)" };
            else
                style = {}

            this.state.table[id] =*/
               return <tbody>
                    <tr key={id} style={style}>
                        {/* Replace with map, import array that CONTAINS stock information [[1],[2]].... */}
                        <td id={id} onClick={this.selectCell}>{id + mod}</td>
                        <td id={id} onClick={this.selectCell}>{id + mod}</td>
                        <td id={id} onClick={this.selectCell}>{id + mod}</td>
                        <td id={id} onClick={this.selectCell}>{id + mod}</td>
                        <td id={id} onClick={this.selectCell}>{id + mod}</td>
                        <td id={id} onClick={this.selectCell}>{id + mod}</td>
                        <td id={id} onClick={this.selectCell}>{id + mod}</td>
                        <td id={id} onClick={this.selectCell}>{id + mod}</td>
                    </tr>
                </tbody>;
   
        
    }

    render() {
        // Scroll to position of record

        let t = <div>
            <div id="table-wrapper">
                <div id="table-scroll">
                    <table class="stockTableTwo" aria-labelledby="tabelLabel">
                        <thead>
                        </thead>

                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>2</td>
                                <td>3</td>
                                <td>4</td>

                                <td>5</td>
                                <td>6</td>
                                <td>7</td>
                                <td>8</td>
                            </tr>
                        </tbody>
                        {this.state.table}
                    </table>
                </div>
            </div>
        </div>;

        return (
            <div>
                {this.addRow()}
                {
                   t
                }
                {this.state.tableTwo}
            </div>
        );
    }

}
}