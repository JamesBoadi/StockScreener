import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { render } from 'react-dom';
import { FetchData } from './DashboardOne/FetchData';

// Fetch data for dash board one
export class StockTableTwo extends Component {

    constructor(props) {
        super(props);
        this.selectRow = this.selectRow.bind(this);
        this.createTable = this.createTable.bind(this);
        this.updateTable = this.updateTable.bind(this);
        this.highlightRow = this.highlightRow.bind(this);

        //  this.scrollPosition = this.scrollPosition.bind(this);


        this.state = {
            table: null,
            scrollPosition: 2,
            updateTable: false,
            stack: [], // Render 100 elements per scroll
            cache: [],
            count: 1,
            numberOfClicks: []
        };
    }

    updateTable() {
        var target = new Number(e.target.id);
        var style = {};

        let mod = 0;
        let id;
        let end = (this.props.stockRecord < 797) ?
            this.props.stockRecord + 100 : 897;

        for (id = this.props.stockRecord; id < end; id++) {
            if (id == target) {
                style = { backgroundColor: "rgb(0,11,34)" };

                this.state.stack[id] =
                    <tbody>
                        <tr key={id} style={style}>
                            {/* Replace with map, import array that CONTAINS stock information [[1],[2]].... */}
                            <td id={id} onClick={this.selectRow}>{id + mod}</td>
                            <td id={id} onClick={this.selectRow}>{id + mod}</td>
                            <td id={id} onClick={this.selectRow}>{id + mod}</td>
                            <td id={id} onClick={this.selectRow}>{id + mod}</td>

                            <td id={id} onClick={this.selectRow}>{id + mod}</td>
                            <td id={id} onClick={this.selectRow}>{id + mod}</td>
                            <td id={id} onClick={this.selectRow}>{id + mod}</td>
                            <td id={id} onClick={this.selectRow}>{id + mod}</td>
                        </tr>
                    </tbody>

                break;
            }
        }
    }

    /* Select row from the table
       Triggers re-rendering of table */
       selectRow(e) {
        var target = new Number(e.target.id);
        var style = {};

        let mod = 0;
        let id;
        for (id = 0; id < 50; id++) {
            if (id == target) {
                style = { backgroundColor: "rgb(0,11,34)" };

                this.state.tb2_stack[id] =
                    <tbody>
                        <tr key={id} style={style}>
                            {/* Replace with map, import array that CONTAINS stock information [[1],[2]].... */}
                            <td id={id} onClick={this.selectRow}>{id + mod}</td>
                            <td id={id} onClick={this.selectRow}>{id + mod}</td>
                            <td id={id} onClick={this.selectRow}>{id + mod}</td>
                            <td id={id} onClick={this.selectRow}>{id + mod}</td>

                            <td id={id} onClick={this.selectRow}>{id + mod}</td>
                            <td id={id} onClick={this.selectRow}>{id + mod}</td>
                            <td id={id} onClick={this.selectRow}>{id + mod}</td>
                            <td id={id} onClick={this.selectRow}>{id + mod}</td>
                        </tr>
                    </tbody>
            }
        }
    }


    /*
        shouldComponentUpdate(nextProps, nextState) {
    
            /*if (this.state.count === 1) {
                this.updateTable();
                this.setState({ count: 0 });
                return true;
    
    
            }
            if (this.props.findRecord) {
                this.highlightRow();
                return true;
            }
    
            if (this.state.stack !== nextState.stack) {
                this.updateTable();
                this.setState({ count: 1 });
                return true;
    
    
            }
            return false;
        }*/

    createTable() {
        let id;
        let mod = 0;

        for (id = 0; id < 50; id++) {
            this.props.state.tb2_stack.push(
                <tbody>
                    <tr key={id}     >
                        {/* Replace with map, import array that CONTAINS stock information [[1],[2]].... */}
                        <td id={id} onClick={this.selectRow}>{id + mod}</td>
                        <td id={id} onClick={this.selectRow}>{id + mod}</td>
                        <td id={id} onClick={this.selectRow}>{id + mod}</td>
                        <td id={id} onClick={this.selectRow}>{id + mod}</td>

                        <td id={id} onClick={this.selectRow}>{id + mod}</td>
                        <td id={id} onClick={this.selectRow}>{id + mod}</td>
                        <td id={id} onClick={this.selectRow}>{id + mod}</td>
                        <td id={id} onClick={this.selectRow}>{id + mod}</td>
                    </tr>
                </tbody>
            )
        }

      

    }

    addRow() {
        let id;
        let mod = 0;

        for (id = 0; id < 800; id++) {
            this.state.stack.push(
                <tbody>
                    <tr key={id}>
                        {/* Replace with map, import array that CONTAINS stock information [[1],[2]].... */}
                        <td id={id} onClick={this.selectRow}>{id + mod}</td>
                        <td id={id} onClick={this.selectRow}>{id + mod}</td>
                        <td id={id} onClick={this.selectRow}>{id + mod}</td>
                        <td id={id} onClick={this.selectRow}>{id + mod}</td>

                        <td id={id} onClick={this.selectRow}>{id + mod}</td>
                        <td id={id} onClick={this.selectRow}>{id + mod}</td>
                        <td id={id} onClick={this.selectRow}>{id + mod}</td>
                        <td id={id} onClick={this.selectRow}>{id + mod}</td>
                    </tr>
                </tbody>
            )
        }
    }

    highlightRow() {
        var target = this.props.id;
        var style = {};

        let id;
        let mod = 0;
        for (id = 0; id < 897; id++) {
            if (id == target)
                style = { backgroundColor: "rgb(0,11,34)" };
            else
                style = {}

            this.state.stack[id] =
                <tbody>
                    <tr key={id} style={style}>
                        {/* Replace with map, import array that CONTAINS stock information [[1],[2]].... */}
                        <td id={id} onClick={this.selectRow}>{id + mod}</td>
                        <td id={id} onClick={this.selectRow}>{id + mod}</td>
                        <td id={id} onClick={this.selectRow}>{id + mod}</td>
                        <td id={id} onClick={this.selectRow}>{id + mod}</td>
                        <td id={id} onClick={this.selectRow}>{id + mod}</td>
                        <td id={id} onClick={this.selectRow}>{id + mod}</td>
                        <td id={id} onClick={this.selectRow}>{id + mod}</td>
                        <td id={id} onClick={this.selectRow}>{id + mod}</td>
                    </tr>
                </tbody>;
            break;
        }
    }

    componentDidUpdate() {

       
    }

    componentDidMount() {
        this.createTable()
        this.props.createTable()
    }

    /*   shouldComponentUpdate(nextProps) {
           console.log(nextProps.scrollPosition + " " + this.props.scrollPosition)
           if (nextProps.scrollPosition !== this.props.scrollPosition) {
               return true;
           } else {
               return false;
           }
       }*/

    /* componentDidMount() {
           this.createTable();
       }*/

    render() {
        // Scroll to position of record
        let table = <div>
            <div id="stack-wrapper">
                <div id="stack-scroll">
                    <table class="stockTableTwo" aria-labelledby="tabelLabel">
                        <thead>
                            <tr>
                                <th>1</th>
                                <th>1</th>
                                <th>1</th>
                                <th>1</th>

                                <th>1</th>
                                <th>1</th>
                                <th>1</th>
                                <th>1</th>
                            </tr>
                        </thead>

                        {this.props.state.tb2_stack}

                    </table>
                </div>
            </div>
        </div>;

        return (
            <div>
               
                
                {this.props.state.tb2}
                {}
            </div>
        );
    }
}