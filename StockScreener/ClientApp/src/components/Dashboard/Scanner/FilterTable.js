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
import {
    Button,
} from 'antd';

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

        this.date = new Date();

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
      

        // Update Hash Map
        this.initialiseHashMap = this.initialiseHashMap.bind(this);
        this.updateSettingsHashMap = this.updateSettingsHashMap.bind(this);

        // Update Table
        this.updateFilterTable = this.updateFilterTable.bind(this);
        this.addToFilterTable = this.addToFilterTable.bind(this);
        this.setUpdateFilterCache = this.setUpdateFilterCache.bind(this);
        this.setMaxNumberOfPortfolioRows = this.setMaxNumberOfPortfolioRows.bind(this);
        this.setFilterCache = this.setFilterCache.bind(this);
        this.updateFilterCache = this.updateFilterCache.bind(this);
        this.updateVariables = this.updateVariables.bind(this);

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
            updateFilterCache: false,
            called: false,

            name: [],
            newName: []
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

        /* window.onload(() => {
              this.updateData = setInterval(() => {
                  if (this.date.getHours() + 8 >= 9) {
                     
                      clearInterval(this.interval);
                  }
              }, 60000);
          }*/

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.updateFilterCache) {
            this.setFilterCache();
            this.setState({ updateFilterCache: false });
        }
        if (this.state.updateFilterTable || prevState.updateFilterTable) {
            this.addToFilterTable();
            this.updateFilterTable();

            this.setState({ updateFilterTable: false });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!nextProps.state.updateCache) {
            return false;
        }
        else {
            if (
                this.state.updateFilterCache !== nextState.updateFilterCache ||
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
    // Initalise Cache
    // **************************************************

    // Initialised when the page is loaded
    initialiseHashMap(
        tableID) {

        // Update Data
        this.updateVariables(tableID);

        // User settings (to be added)
        /*    this.settings.set(
                tableID,
                {
                    bollingerBandsNo: bollingerBandsNo, deviations: deviations,
                    firstMovingAverageDays: firstMovingAverageDays,
                    secondMovingAverageDays: secondMovingAverageDays,
                    smoothing: smoothing, rsiWeight: rsiWeight
                    , Volume: Volume
                }
            );*/
    }

    // **************************************************

    // **************************************************
    // Update Filter Cache
    // **************************************************

    setMaxNumberOfPortfolioRows(length, name) {
        this.setState({ maxNumberOfPortfolioRows: length });
        this.setState({ name: name });
    }

    setUpdateFilterCache(update) {
        this.setState({ updateFilterCache: update });
    }

    // Called Once
    setFilterCache() {
        let count;
        for (count = 0; count < this.state.maxNumberOfPortfolioRows; count++) {
            this.initialiseHashMap(count);
        }

        console.log('  count  ' + this.state.maxNumberOfPortfolioRows)

        this.setState({ updateFilterTable: true });
    }


    // Utility for setting cache
    updateFilterCache(tableID, json) {
        this.filterCache.set(
            tableID.toString(),
            {
                signalMessage: json.signalMessage,
                signal: json.signal,
                firstMACD: json.firstMACD,
                secondMACD: json.secondMACD,
                upperBand: json.upperBand, middleBand: json.middleBand,
                lowerBand: json.lowerBand, SMA: json.SMA,
                RSI: json.RSI, Volume: json.Volume
            }
        );
    }

    // Update variables and set 
    updateVariables(tableID) {
        HistoryCalc.setID(tableID);
        // Set variables
        const json = HistoryCalc.getJSON();
        this.updateFilterCache(tableID, json);
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


    // Fill the whole table (called on component did mount)
    addToFilterTable() {
        var t = [];
        let pointer;
        let start = 0;
        const end = this.state.maxNumberOfPortfolioRows;
        const name = this.state.name;
      
        for (pointer = start; pointer < end; pointer++) {
            const item = this.filterCache.get(pointer.toString());

            t.push(
                <tbody key={pointer}>
                    <tr>
                        <td id={pointer}>{name[pointer]}</td>
                        <td id={pointer}>{item.signalMessage}</td>
                        <td id={pointer}>{item.signalMessage}</td>
                        <td id={pointer}>{item.signal}</td>
                        <td id={pointer}>{item.firstMACD}</td>
                        <td id={pointer}>{item.secondMACD}</td>
                        <td id={pointer}>{item.upperBand}</td>
                        <td id={pointer}>{item.middleBand}</td>
                        <td id={pointer}>{item.lowerBand}</td>
                        <td id={pointer}>{item.SMA}</td>
                        <td id={pointer}>{item.RSI}</td>
                      
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


        this.setState({ filterTable: t });
        this.setState({ updateFilterTable: true });
        this.forceUpdate();
    }



    // **************************************************

    render() {
        let filterTableHeader =

            <table class="filterTableHeader" aria-labelledby="tabelLabel"
                style={{ zIndex: '999', position: 'absolute', left: '675px' }}>
                <thead>
                    <tr>
                        <th>Stock <br /> Name </th>
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

                <div class="wrap" style={{ width: '48rem' }}>
                    <div class="cell-wrap left">
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
                                zIndex='999'
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
                                    zIndex='999'
                                >
                                </Box>

                                {this.state.filterTable}
                            </Box>
                        </div>

                    </div>

                </div>

                <HistoricalTable {...this} />

            </div>
        );
    }
}

