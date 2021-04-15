import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { render } from 'react-dom';
import {
    Box, NumberInput,
    NumberInputField, NumberInputStepper,
    NumberIncrementStepper, NumberDecrementStepper,
    InputGroup, InputRightElement, InputLeftElement,
    Menu, MenuButton, MenuList, MenuItem, MenuItemOption,
    MenuGroup, MenuOptionGroup, MenuIcon, MenuCommand, MenuDivider
} from '@chakra-ui/react';
import 'antd/dist/antd.css';
import HistoryCache from './js/HistoryCache';
import HistoryCalc from './js/HistoryCalc';
import PortfolioCalc from './js/HistoryCalc';
import { HistoricalTable } from './HistoricalTable';
import * as HashMap from 'hashmap';
import * as cache from 'cache-base';

/**
* Filter Table that adds a stock to the table. 
* Includes live information for that stock and also
* includes live alerts and mathematical calculations
*/
export class FilterTable extends Component {
    static signalMessage = "";
    static signal = 0;
    static firstMACD = 0;
    static secondMACD = 0;
    static upperBand = 0;
    static middleBand = 0;
    static lowerBand = 0;
    static SMA = 0;
    static RSI = 0;
    static Volume = 0;

    constructor(props) {
        super(props);
        
        // **************************************************
        // Static Variables
        // **************************************************

        let style = { color: "white;" };
        this.timeout = null;
        this.map = new HashMap();
        this.data = new HashMap();

        // **************************************************
        // History Calc Table
        // **************************************************

        this.HistoryCalcMap = new HashMap();
        this.HistoryCalcBool = [];


        // Settings
        this.applyChanges = this.applyChanges.bind(this);
        this.setPerformanceStocksSettings = this.setPerformanceStocksSettings.bind(this);
        this.setMacdStocksSettings = this.setMacdStocksSettings.bind(this);
        this.setBollingerBandSettings = this.setBollingerBandSettings.bind(this);
        this.updateHistoryCalc = this.updateHistoryCalc.bind(this);

        // Update Hash Map
        this.initialiseHashMap = this.initialiseHashMap.bind(this);
        this.updateDataHashMap = this.updateDataHashMap.bind(this);
        this.updateSettingsHashMap = this.updateSettingsHashMap.bind(this);

        // Update Table
        this.updateFilterTable = this.updateFilterTable.bind(this);
        this.addToFilterTable = this.addToFilterTable.bind(this);
        this.setUpdateFilterTable = this.setUpdateFilterTable.bind(this);
        this.setMaxNumberOfPortfolioRows = this.setMaxNumberOfPortfolioRows.bind(this);

        this.filterCache = new cache(); // Set in database
        this.idHashMap = new HashMap();
        this.settings = new HashMap();
        this.called = false;

        // **************************************************

        this.state = {

            // **************************************************
            // History calc states
            // **************************************************
            // Check Box
            performanceStocksSettings: [],
            macdStocksSettings: [],
            bollingerBandSettings: [],
            updateHistoryCalc: false,

            filterTableStack: [],
            filterTable: [],


            // **************************************************

            green: false,
            red: false,
            priceChangeUp: false,
            validInput: false,
            display: [],
            stockRecordID: 0,
            scroll: 0,
            query: {},
            start: 0,

            tb2: [],
            tb2_temp: [],
            tb2_scrollPosition: 0,
            tb2_updateTable: false,
            tb2_stack: [], // Render 100 elements per scroll
            tb2_cache: [],
            tb2_count: 0,
            tb2_numberOfClicks: [],

            // Alert Table States
            alertTableStack: [],
            portfolioTable: [],

            isScrolled: false,
            scrollUp_: 0,
            scrollDown_: 0,
            componentSize: 'default',

            // **************************************************
            // Form
            // **************************************************

            addStockFormVisible: "visible",
            editStockFormVisible: "hidden",
            closeForm: true,
            stockFormID: null,
            selectedRecordValue: "",
            clearRecord: false,
            date: "",
            shares: 0,
            price: 0,
            target: 0,
            portfolioTableRowBool: true,

            // **************************************************
            // Portfolio Table Variables
            // **************************************************

            highlightTableRow: false,
            addToHistoricalTableBool: false,
            updatePortfolioTableData: false,
            editPortfolioTable: false,
            removePortfolioTableRowBool: false,
            portfolioTableStocks: [],
            portfolioTableStack: [],
            clickedPortfolioTableRowID: 0,
            maxNumberOfPortfolioTableRows: 0,
            maxNumberOfPortfolioRows: 0,

            updateFilterTable: false,

            called: false
        };
    }

    onFormLayoutChange = ({ size }) => {
        this.setState({ componentSize: size })
    };

    componentDidMount() {
        this.interval = setInterval(() => {
            if (this.props.state.updateCache) {
                this.setState({ called: true })
                clearInterval(this.interval);
            }
        }, 1000);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (this.state.updateFilterTable) {
            this.addToFilterTable();
            this.updateFilterTable();
            console.log('update dawg ' + this.state.updateFilterTable)
            this.setState({ updateFilterTable: false });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!nextProps.state.updateCache) {
            return false;
        }
        else {
            if (
                this.state.updateFilterTable !== nextState.updateFilterTable ||
                this.state.updateHistoryCalc !== nextState.updateHistoryCalc ||
                this.state.highlightTableRow !== nextState.highlightTableRow ||
                this.state.editPortfolioTable !== nextState.editPortfolioTable ||
                this.state.closeForm !== nextState.closeForm ||
                this.state.addToHistoricalTableBool !== nextProps.addToHistoricalTableBool
                || this.state.updatePortfolioTableData !== nextState.updatePortfolioTableData ||
                this.state.validInput || this.state.queryRes
                || nextState.selectedRecordValue !== this.state.selectedRecordValue) {
                return true;
            }
        }
        return false;
    }

    // **************************************************
    // Update Hash Map
    // **************************************************

    // Initialised when apply changes button is clicked
    initialiseHashMap(
        tableID,
        bollingerBandsNo,
        deviations,
        firstMovingAverageDays,
        secondMovingAverageDays,
        smoothing,
        rsiWeight,
        Volume) {

        this.props.initialiseHashMap(tableID,
            bollingerBandsNo,
            deviations,
            firstMovingAverageDays,
            secondMovingAverageDays,
            smoothing,
            rsiWeight,
            Volume);
    }

    // Updated periodically
    updateDataHashMap() {
        this.props.updateDataHashMap();
    }

    // Set at the very beggining
    updateSettingsHashMap(
        tableID,
        bollingerBandsNo,
        deviations,
        firstMovingAverageDays,
        secondMovingAverageDays,
        smoothing,
        rsiWeight,
        Volume) {

        this.props.updateSettingsHashMap(tableID,
            bollingerBandsNo,
            deviations,
            firstMovingAverageDays,
            secondMovingAverageDays,
            smoothing,
            rsiWeight,
            Volume);
    }

    /*static updateVariables(tableID) {
        this.prevCloseSum(tableID);
        this.setSMA();
        this.caclualteStandardDeviation();

        this.setUpperBands();
        this.middleBand();
        this.setLowerBands();

        this.calculateFirstMACD(tableID);
        this.calculateSecondMACD(tableID);

        this.calculateSignal();
        this.calculateRSI();
    }*/

    // **************************************************

    // **************************************************
    // History Calc 
    // **************************************************

    // Checked Options
    //...................................................

    setPerformanceStocksSettings(checked) {
        this.setState({ performanceStocksSettings: checked });
    }

    setMacdStocksSettings(checked) {
        this.setState({ macdStocksSettings: checked });
    }

    setBollingerBandSettings(checked) {
        this.setState({ bollingerBandSettings: checked });
    }

    //....................................................

    applyChanges() {
        this.setState({ updateHistoryCalc: true });
    }

    updateHistoryCalc() {
        // Initialise History Calculations
        const id = this.state.stockRecordID;


        /*
        Index | Bool

        array[0] = bollingerBandsNo
        array[1] = deviations 
        array[2] = firstMovingAverageDays 
        array[3] = secondMovingAverageDays 
        array[4] = smoothing 
        array[5] = rsiWeight 
        array[6] = volume 

        */

        // Checked options
        const performanceStocksSettings = this.state.performanceStocksSettings;
        for (let index = 0; index < performanceStocksSettings.length; index++) {
            const element = performanceStocksSettings[index];
            switch (element) {
                case 'High Momentum':

                    break;

                case 'Low Momentum':

                    break;

                case 'Growth Stocks':

                    break;
                case 'Shorted Stocks':

                    break;
            }
        }

        // Checked options
        const macdStocksSettings = this.state.macdStocksSettings;
        for (let index = 0; index < macdStocksSettings.length; index++) {
            const element = macdStocksSettings[index];
            switch (element) {
                case 'Golden Cross':

                    break;

                case 'MACD':

                    break;
            }
        }

        // Checked options
        const bollingerBandSettings = this.state.bollingerBandSettings;
        for (let index = 0; index < bollingerBandSettings.length; index++) {
            const element = bollingerBandSettings[index];
            switch (element) {
                case 'UpperBand':

                    break;

                case 'MiddleBand':

                    break;

                case 'LowerBand':

                    break;
            }
        }

        // Set regardless of settings
        this.initialiseHashMap(id, 2, 2, 25, 199, 0.2, 1, 250000);

        // Save to database


    }

    setMaxNumberOfPortfolioRows(length) {
        this.setState({ maxNumberOfPortfolioRows: length });
    }

    setUpdateFilterTable(update) {

        this.setState({ updateFilterTable: update });
    }


    // Fill the whole table (called on component did mount)
    addToFilterTable() {
        var t = [];
        let pointer;
        let start = 0;
        const end = this.state.maxNumberOfPortfolioRows;

        let count;
        for (count = start; count < end; count++) {
            this.initialiseHashMap(count, 2, 2, 25, 50, 0.2, 1, 250000);
        }

        for (pointer = start; pointer < end; pointer++) {
            const item = this.filterCache.get(pointer.toString());

            t.push(
                <tbody key={pointer}>
                    <tr>
                        <td id={pointer}>{item.signalMessage}</td>
                        <td id={pointer}>{item.signal}</td>
                        <td id={pointer}>{item.firstMACD}</td>
                        <td id={pointer}>{item.secondMACD}</td>
                        <td id={pointer}>{item.upperBand}</td>
                        <td id={pointer}>{item.middleBand}</td>
                        <td id={pointer}>{item.lowerBand}</td>
                        <td id={pointer}>{item.SMA}</td>
                        <td id={pointer}>{item.RSI}</td>
                        <td id={pointer}>{item.Volume}</td>
                    </tr>
                </tbody>
            );
        }

        this.setState({ filterTableStack: t });
        this.setState({ updateFilterTable: true });
    }

    // Update the historical table
    updateFilterTable() {
        let t =
            <div class="filter">
                <div>
                    <table class="filterTable" aria-labelledby="tabelLabel">
                        <thead></thead>
                        {this.state.filterTableStack}
                    </table>
                </div>
            </div>;
        // console.log('UPDATE ');
        this.setState({ filterTable: t });
        this.setState({ updateFilterTable: true });
    }



    // **************************************************

    render() {
        let filterTableHeader =

            <table class="filterTableHeader" aria-labelledby="tabelLabel"
                style={{ zIndex: '999', position: 'absolute', left: '675px' }}>
                <thead>
                    <tr>
                        <th>Signal <br /> Message </th>
                        <th>Signal <br /> Line</th>
                        <th>First <br /> MACD</th>
                        <th>Second <br /> MACD</th>
                        <th>Upper <br /> Band</th>
                        <th>Middle <br /> Band</th>
                        <th>Lower <br />Band</th>
                        <th>SMA </th>
                        <th>RSI</th>
                        <th>Volume</th>
                    </tr>
                </thead>
            </table>


        return (
            <div>


                <div class="filter">
                    {/* PORTFOLIO TABLE */}

                    <Box
                        style={{ position: 'absolute', top: '125px', left: '80px' }}
                        //     bg='rgb(30,30,30)'
                        boxShadow='sm'
                        textAlign='center'
                        height='45px'
                        width='48rem'
                        rounded="lg"
                        margin='auto'
                        color='white'
                    >
                        {filterTableHeader}


                        <Box
                            style={{
                                position: 'absolute',
                                overflowY: 'auto',
                                top: '45px'
                            }}
                            overflowX='hidden'
                            boxShadow='sm'
                            textAlign='center'
                            height='1110px'
                            width='48rem'
                            rounded="lg"
                            margin='auto'
                            color='white'
                        >

                            {this.state.filterTable}

                        </Box>
                    </Box>
                </div>

                <HistoricalTable {...this} />

            </div>
        );
    }
}

