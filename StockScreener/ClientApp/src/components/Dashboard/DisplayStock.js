
import React, { Component, useState, useContext } from 'react';
import { Button, Box, ButtonGroup } from "@chakra-ui/react";
import TableCache from '../Dashboard/DashboardOne/js/TableCache.js';
import { StockTableTwo } from '../Dashboard/DashboardOne/StockTableTwo';
import { SavedStockTable } from '../Dashboard/DashboardOne/SavedStockTable';


export class DisplayStock extends Component {

    constructor(props) {
        super(props);

        this.displayStock = this.displayStock.bind(this);
        this.setAddAlertTableRowBool = this.setAddAlertTableRowBool.bind(this);
        this.setRemoveAlertTableRowBool = this.setRemoveAlertTableRowBool.bind(this);

        this.state = {
            // Display Stock
            stockInfoName: [],
            stockInfoHeader: [],
            stockInfoPrevPrice: [],
            stockInfoCurrPrice: [],
            stockInfoCode: [],
            updateStockInfo: false,
            alertMessagePopUp: "",

            updateNotifications: false,
            notificationsMenuVisible: false,

            addAlertTableRowBool: false,
            removeAlertTableRowBool: false,

        };
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.updateStockInfo) {
            this.setState({ stockInfoHeader: this.state.stockInfoName[0] });
            this.setState({ stockInfoPrevPrice: this.state.stockInfoName[1] });
            this.setState({ stockInfoCurrPrice: this.state.stockInfoName[2] });
            this.setState({ stockInfoCode: this.state.stockInfoName[3] });

            this.setState({ updateStockInfo: false });
        }
    }

    // **************************************************
    // Add to Historical Table
    // **************************************************

    // Add to History Table
    async addToHistorical() {
        const target = parseInt(this.state.clickedAlertTableRowID);
        const json = TableCache.get(target);
        console.log('target ' + target);
        let txt;
        if (isNaN(target) || (target === null || target === undefined)) {
            window.alert("No target is clicked ");
        }
        else {
            var r = window.confirm("Add to Historical Table?");
            if (r == true) {
                txt = "Yes";
            } else {
                txt = "Cancel";
            }

            const jsonString = await this.getJSON(json);

            // if (txt === "Yes") {
            const res = await this.saveHistoricalData(jsonString);
            console.log('Historical data added? ' + res);
            // window.alert(returned message)             window.alert('Maximum stocks for portfolio exceeded, limit: 200 ');
            //}
        }
    }

    async saveHistoricalData(data) {
        await fetch('savehistoricaldata/temp/'.concat(data))
            .then(response => response.status)
            .then(response => {
                if (!response.ok) {
                    // 404 
                    return false;
                }
                else return true;
            })
            .catch(error => {
                console.log("error " + error) // 404
                return false;
            }
            );

        return false;
    }

    async getJSON(json) {
        const today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }

        var _today = yyyy + 'a' + mm + 'a' + dd;

        const obj = { Id: json.Id, Date: _today };
        var jsonString = JSON.stringify(obj);

        return jsonString;
    }

    // **************************************************
    // **************************************************
    // Display Stock
    // **************************************************

    // Triggered when a table row is clicked
    displayStock(stockID) {

        console.log('Clicked ' + stockID)

        var info = [];

        info.push(<h1 style={{ position: 'absolute', textAlign: 'center', left: '270px', color: 'white' }}>
            {TableCache.get(stockID).StockName}</h1>);

        info.push(<h2 style={{ position: 'absolute', textAlign: 'center', top: '75px', left: '270px', color: 'white' }}>
            Previous: {TableCache.getPreviousPrice(stockID)}</h2>);

        info.push(<h2 style={{ position: 'absolute', textAlign: 'center', top: '120px', left: '270px', color: 'white' }}>
            Price: {TableCache.get(stockID).CurrentPrice}</h2>);

        info.push(<h1 style={{ position: 'absolute', textAlign: 'center', left: '0px', color: 'white' }}>
            {TableCache.get(stockID).StockCode}</h1>);


        this.setState({ stockInfoName: info });
        this.setState({ updateStockInfo: true });
    }

    // **************************************************
    // **************************************************
    // Saved Stock Rows
    // **************************************************

    setAddAlertTableRowBool(state) {
        this.setState({ addAlertTableRowBool: state });
    }

    setRemoveAlertTableRowBool(state) {
        this.setState({ removeAlertTableRowBool: state });
    }

    // **************************************************

    render() {
        return (
            <div>
                <Box
                    style={{ position: 'absolute', top: '340px', left: '60px' }}
                    bg='rgb(40,40,40)'
                    boxShadow='sm'
                    height='305px'
                    width='62rem'
                    rounded="lg"
                    margin='auto'
                    zIndex='0'>

                    {this.state.stockInfoCode}
                    {this.state.stockInfoHeader}
                    {this.state.stockInfoPrevPrice}
                    {this.state.stockInfoCurrPrice}

                    <Button onClick={this.addAlertTableRow}
                        style={{ position: 'absolute', bottom: '20px', right: '180px', width: '90px' }}>
                        Add <br />to Table</Button>

                    <Button onClick={this.removeAlertTableRow}
                        style={{ position: 'absolute', bottom: '20px', right: '50px', width: '90px' }}>
                        Remove  <br /> from Table</Button>

                    <Button onClick={this.addToHistorical}
                        style={{ position: 'absolute', bottom: '20px', left: '40px', width: '90px' }}>
                        Add  <br /> to Historical</Button>
                </Box>

                <StockTableTwo {...this} />
                <SavedStockTable {...this} />

            </div>
        );
    }

}