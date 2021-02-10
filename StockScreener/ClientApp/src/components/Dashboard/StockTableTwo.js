
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { render } from 'react-dom';
import { FetchData } from './DashboardOne/FetchData';

// Fetch data for dash board one
export class StockTableTwo extends Component {

    constructor(props) {
        super(props);
        this.selectCell = this.selectCell.bind(this);
        this.addRow = this.addRow.bind(this);
        this.updateTable = this.updateTable.bind(this);
        this.scrollBy = this.scrollBy.bind(this);

        let style = { color: "white;" }
        this.state = {
            table: [],
            tableTwo: [],
            count: 0,
            numberOfClicks: []
        };
    }

    updateTable() {
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

        this.setState({ tableTwo: t });
    }

    componentDidUpdate() {
        if (this.state.count === 1) {
            this.updateTable();
            this.setState({ count: 0 });
        }
    }

    componentDidMount() {
        this.addRow();
        this.updateTable();
    }

    selectCell(e) {
        var table = [];
        var target = new Number(e.target.id);
        var style = {};

        //        this.setState({ numberOfClicks: this.state.numberOfClicks + 1 });

        let id;
        for (id = 0; id < 305; id++) {
            if (id == target)
                style = { backgroundColor: "rgb(0,11,34)" };
            else
                style = {}

            table.push(
                <tbody>
                    <tr key={id} style={style}>
                        {/* Replace with map, import array that CONTAINS stock information [[1],[2]].... */}
                        <td id={id} onClick={this.selectCell}>400</td>
                        <td id={id} onClick={this.selectCell}>4</td>
                        <td id={id} onClick={this.selectCell}>5</td>
                        <td id={id} onClick={this.selectCell}>6</td>
                        <td id={id} onClick={this.selectCell}>4</td>
                        <td id={id} onClick={this.selectCell}>4</td>
                        <td id={id} onClick={this.selectCell}>5</td>
                        <td id={id} onClick={this.selectCell}>6</td>
                    </tr>
                </tbody>
            )
        }

        this.setState({ table: table });
        this.setState({ count: 1 });
    }

    addRow() {
        let id;
        let mod = 0;
        for (id = 0; id < 305; id++) {
            this.state.table.push(
                <tbody>
                    <tr key={id}     >
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
                </tbody>
            )
        }
    }

    scrollBy() {
        const height = 800;
        const scroll = 30;

        let count = 0;
        let heightUnits = (height / scroll);
        let scrollHeight = this.props.id / scroll;
   
        count = scrollHeight * heightUnits; 
        console.log("fight " + this.props.id + " " + count);

        window.scrollBy(0, count);


    }

    render() {
        // Scroll to position of record
      /*  if (this.props.findRecord)
            this.scrollBy()*/

        return (
            <div>
                {this.state.tableTwo}
            </div>
        );
    }
}