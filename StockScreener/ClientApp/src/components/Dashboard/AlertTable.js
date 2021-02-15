import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { render } from 'react-dom';

// Fetch data for dash board one
export class AlertTable extends Component {
    constructor(props) {
        super(props);
        this.selectCell = this.selectCell.bind(this);
        this.addRow = this.addRow.bind(this);
        this.updateTable = this.updateTable.bind(this);

        let style = { color: "white;" }
        this.state = {
            table: [],
            alertTable: [],
            count: 0,
            numberOfClicks: []
        };
    }

    

    updateTable() {
        let t = <div>
            <div id="table-wrapper">
                <div id="table-scroll">
                    <table class="alertTable" aria-labelledby="tabelLabel">
                        <thead>
                        </thead>
                        <tbody>
                            <tr>
                                <td>4</td>
                                <td>4</td>
                                <td>4</td>
                                <td>1</td>
                                <td>4</td>
                            </tr>
                        </tbody>
                        {this.state.table}
                    </table>
                </div>
            </div>
        </div>;

        this.setState({ alertTable: t });
    }

    componentDidUpdate() {
        if (this.state.count === 1) {
            this.updateTable();
            this.setState({ count: 0 });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.count === 1) {
            this.updateTable();
            this.setState({ count: 0 });
            return true;
        }
        if (this.props.findRecord) {
            this.highlightRow();
            return true;
        }

        return false;
    }

    componentDidMount() {
        this.addRow();
        this.updateTable();
    }

    selectCell(e) {
        var table = [];
        var target = new Number(e.target.id);
        var style = {};
        
        // this.setState({ numberOfClicks: this.state.numberOfClicks + 1 })
        
        let id;
        for (id = 0; id < 30; id++) {
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
                    </tr>
                </tbody>
            )
        }

        this.setState({ table: table });
        this.setState({ count: 1 });
    }

    addRow() {
        let id;
        for (id = 0; id < 305; id++) {
            this.state.table.push(
                <tbody>
                    <tr key={id}     >
                        {/* Replace with map, import array that CONTAINS stock information [[1],[2]].... */}
                        <td id={id} onClick={this.selectCell}>3</td>
                        <td id={id} onClick={this.selectCell}>3</td>
                        <td id={id} onClick={this.selectCell}>3</td>
                        <td id={id} onClick={this.selectCell}>3</td>
                        <td id={id} onClick={this.selectCell}>3</td>
                    </tr>
                </tbody>
            )
        }
    }

    render() {
        return (
            <div>
                {this.state.alertTable}
            </div>
        );
    }

}