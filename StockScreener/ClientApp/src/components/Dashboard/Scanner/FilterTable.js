import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import HistoryCalc from './js/HistoryCalc';
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


        // Update Hash Map
        this.setFilterCache = this.setFilterCache.bind(this);
        this.updateSettingsHashMap = this.updateSettingsHashMap.bind(this);

        // Update Table
        
        this.init = this.init.bind(this);
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
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.state.updateFilterCache) {
            this.init();
           
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.state.updateFilterCache !== nextProps.state.updateFilterCache) {
            return true;
        }
        return false;
    }


    // **************************************************
    // Update Filter Cache
    // **************************************************

    init() {
        let start = this.props.state.filterCacheStart;
        for (var count = start; count <= this.props.state.filterCacheEnd; count++) {
            this.setFilterCache(count);
        }
        
        console.log('Calling Update Filter Cache ');
        this.props.setUpdateFilterCache(false);
    }

    setFilterCache(
        tableID) {
        // Update Data
        this.updateVariables(tableID);
    }

    // Utility for setting cache
    updateFilterCache(tableID, json) {
        this.props.setFilterCache(
            tableID,
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

    render() {
        return (null);
    }
}

