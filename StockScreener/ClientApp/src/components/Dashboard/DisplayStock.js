
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
        this.selectAlertTableRow = this.selectAlertTableRow.bind(this);
        this.setIsSelected = this.setIsSelected.bind(this);
        this.removeStock = this.removeStock.bind(this);
        this.idExists = this.idExists.bind(this);
        this.addToHistorical = this.addToHistorical.bind(this);
        this.addToHistoricalTable = this.addToHistoricalTable.bind(this);


        // D1
        this.toggleSettings = this.toggleSettings.bind(this);

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
            clickedAlertTableRowID: null,
            addAlertTableRowBool: false,
            removeAlertTableRowBool: false,

            isSelected: false,


            // D1
            saveSettings: false,
            toggleAlert: false
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
        if (this.props.state.saveSettings) {
          
            console.log('NEW SETTINGS?')
            this.props.toggleSettings(false);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {

        return true;

    }


    toggleSettings(state) {
        this.setState({ saveSettings: state });
    }

    // Reset ID
    resetID() {

    }

    // **************************************************
    // Add to Historical Table
    // **************************************************

    async idExists(target) {
        return new Promise(resolve => {
            if (this.state.clickedAlertTableRowID === null
                || this.state.clickedAlertTableRowID === undefined) {
                resolve(false);
            }
            resolve(true);
        });
    }

    addToHistorical(e) {
        this.addToHistoricalTable();
    }


    // Add to History Table
    async addToHistoricalTable() {
        const res = await this.idExists();
        if (!res) {
            window.alert('Please select a stock from your saved stocks table');
            return;
        }

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


        this.setState({ clickedAlertTableRowID: stockID });
        this.setState({ stockInfoName: info });
        this.setState({ updateStockInfo: true });
    }

    // **************************************************
    // **************************************************
    // Saved Stock Rows
    // **************************************************

    // Select Row Setter
    selectAlertTableRow(e) {
        const alertTableId = parseInt(e.target.id);
        this.setState({ clickedAlertTableRowID: alertTableId });
        this.setState({ isSelected: true });
    }

    setAddAlertTableRowBool(state) {
        this.setState({ addAlertTableRowBool: state });
    }

    removeStock(e) {
        if (this.state.clickedAlertTableRowID === null
            || this.state.clickedAlertTableRowID === undefined) {
            window.alert('Please select a stock from your saved stocks table');
            return;
        }
        var userselection = window.confirm("Are you sure you want to delete this stock ?");
        if (userselection == true) {
            this.setRemoveAlertTableRowBool(true);
        }
    }

    setRemoveAlertTableRowBool(state) {
        this.setState({ removeAlertTableRowBool: state });
    }

    setIsSelected(state) {
        this.setState({ isSelected: state });
    }

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

                    <Button onClick={() => { this.setAddAlertTableRowBool(true) }}
                        style={{ position: 'absolute', bottom: '20px', right: '180px', width: '90px' }}>
                        Add <br />to Table</Button>

                    <Button onClick={this.removeStock}
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