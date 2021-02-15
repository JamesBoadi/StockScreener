import React, { Component } from 'react';
import { createTableMultiSort, Column, Table } from 'react-virtualized';
import ReactDOM from 'react-dom';
import { render } from 'react-dom';
import { FetchData } from './DashboardOne/FetchData';

// Fetch data for dash board one
export class StockTableTwo extends Component {

    constructor(props) {
        super(props);
        this.selectCell = this.selectCell.bind(this);
        this.createTable = this.createTable.bind(this);
        this.updateTable = this.updateTable.bind(this);
        this.highlightRow = this.highlightRow.bind(this);

        this.scrollPosition = this.scrollPosition.bind(this);


        this.state = {
            stack: [], // Render 100 elements per scroll
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

                break;
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

    selectCell(e) {
        var target = new Number(e.target.id);
        var style = {};

        let mod = 0;
        let id;
        for (id = 0; id < 50; id++) {
            if (id == target) {
                style = { backgroundColor: "rgb(0,11,34)" };

                this.state.stack[id] =
                    <tbody>
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
                    </tbody>

                break;
            }
        }

        console.log("All that coffee")
        this.updateTable();
    }

    createTable() {
        let id;
        let mod = 0;

        for (id = 0; id < 50; id++) {
            this.state.stack.push(
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
        //  this.updateTable(); 
    }

    addRow() {
        let id;
        let mod = 0;

        for (id = 0; id < 800; id++) {
            this.state.stack.push(
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
        //  this.updateTable(); 
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
            break;
        }
    }


    /*  shouldComponentUpdate() {
  
          if (this.state.count === 1) {
              this.createTable();
              this.updateTable();
              this.setState({ count: 0 })
              return true;
          }
  
          return false;
  
           {this.createTable()}
                  {this.updateTable()}
      }*/

    /*   componentDidMount() {
           this.createTable();
       }*/


    render() {
        // Scroll to position of record

        let t = <div>
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

                        {this.state.stack}
                    </table>
                </div>
            </div>
        </div>;



        return (
            <div>
                {this.createTable()}
                {
                    t
                }

            </div>
        );
    }
}