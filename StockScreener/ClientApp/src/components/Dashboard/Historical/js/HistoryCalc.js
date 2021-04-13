import * as HashMap from 'hashmap';
/**
* Calculations for Portfolio, includes a set of mathematical 
* functions that query a database for saved informaion
*/
export default class HistoryCalc {
    static profitLoss = 0;
    static profitLossPercentage = 0;
    static standardDeviation = 0;
    static simpleMovingAverage = 0;

    static day = 0; // Set by database reset by 5
    static shares;
    static expenditure = 0;
    static currentPrice;
    static prevCloseSum;
    static prevCloseArr = []; // fill to 200 (max)

    static firstMACD = 0;
    static secondMACD = 0;

    static signal = 0; // For macd line
    static relativeStrengthIndex = 0;

    static dataHashMap = new HashMap(); // Set in database
    static idHashMap = new HashMap();
    static settings = new HashMap();


    static upperBand = 0;
    static middleBand = 0;
    static lowerBand = 0;
    static SMA = 0;
    static signal = 0;
    static volume = 0;
    static RSI = 0;

    static updateHistoricalTable = false;
    static id = null;

    // **************************************************
    // User Set Variables
    // **************************************************
    static bollingerBandsNo = 0;
    static deviations = 0;
    static firstMovingAverageDays = 0; // For MACD
    static secondMovingAverageDays = 0; // For MACD
    static smoothing = 0.2;
    static rsiWeight = 0;
    static volume = 250000;


    static setHistory(_currentPrice, _shares, _expenditure) {
        this.currentPrice = _currentPrice;
        this.shares = _shares;
        this.expenditure = _expenditure;

        // Add to database and map
    }



    // **************************************************
    // Get and Set Variables for updating table
    // **************************************************
    
    static setUpdateHistoricalTable(bool, id) {
        this.updateHistoricalTable = bool;
        this.id = id;
    }

    static getUpdateHistoricalTable() {
        return this.updateHistoricalTable;
    }

    static getID() {
        return this.id;
    }

    // **************************************************


    // Initialised when the button is clicked
    static initialiseHashMap(
        tableID,
        bollingerBandsNo,
        deviations,
        firstMovingAverageDays,
        secondMovingAverageDays,
        smoothing,
        rsiWeight,
        volume) {

        if (!(this.settings.has(tableID) && this.dataHashMap.has(tableID))) {

            // Add to database
            let pointer = this.idHashMap.count();
            this.idHashMap.set(pointer, tableID);

            this.dataHashMap.set(
                tableID,
                {
                    upperBand: null, middleBand: null,
                    lowerBand: null, SMA: null, signal: null,
                    RSI: null
                }
            );

            this.settings.set(
                tableID,
                {
                    bollingerBandsNo: bollingerBandsNo, deviations: deviations,
                    firstMovingAverageDays: firstMovingAverageDays,
                    secondMovingAverageDays: secondMovingAverageDays,
                    smoothing: smoothing, rsiWeight: rsiWeight
                    , volume: volume
                }
            );
        }
    }

    // Updated periodically
    static updateDataHashMap() {

        for (let index = 0; index < this.idHashMap.count(); index++) {
            const tableID = this.idHashMap.get(index);
            this.updateVariables(tableID); // Update Variables 

            this.dataHashMap.set( // Perform Update
                tableID,
                {
                    upperBand: this.upperBand, middleBand: this.middleBand,
                    lowerBand: this.lowerBand, SMA: this.SMA, signal: this.signal,
                    RSI: this.RSI
                }
            );
        }
    }

    static updateSettingsHashMap(
        tableID,
        bollingerBandsNo,
        deviations,
        firstMovingAverageDays,
        secondMovingAverageDays,
        smoothing,
        rsiWeight,
        volume) {

        if (this.settings.has(tableID)) {

            this.settings.set(
                tableID,
                {
                    bollingerBandsNo: bollingerBandsNo, deviations: deviations,
                    firstMovingAverageDays: firstMovingAverageDays,
                    secondMovingAverageDays: secondMovingAverageDays,
                    smoothing: smoothing, rsiWeight: rsiWeight
                    , volume: volume
                }
            );
        }
    }

    static get(tableID) {
        return this.dataHashMap.get(tableID);
    }

    static updateVariables(tableID) {
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

    }

    // Read previous closes from database
    static setPreviousCloses() {
        for (let index = 0; index < 200; index++) {
            this.prevCloseArr[index] = 0;   // += (get(i))
        }
    }

    // Previous close sum
    static setPreviousCloseSum(tableID) {
        this.bollingerBandsNo = this.settings.get(tableID).bollingerBandsNo; // check

        this.prevCloseSum += 0; // += (get(i))
        for (let index = 0; index < this.bollingerBandsNo; index++) {
            this.prevCloseSum += this.prevCloseArr[index]; // += (get(i))
        }
    }

    // Calculate simple moving average
    static setSMA() {
        this.simpleMovingAverage = this.prevCloseSum / this.bollingerBandsNo; // += (get(i))
    }

    // Calculate standard deviation
    static caclualteStandardDeviation() {
        let standardDeviation;
        for (let index = 0; index < this.bollingerBandsNo; index++) {
            standardDeviation += Math.pow(this.prevCloseArr[index] - this.simpleMovingAverage, 2); // += (get(i))
        }

        this.standardDeviation = Math.sqrt(standardDeviation / this.bollingerBandsNo);
    }

    // **************************************************
    // Bollinger Bands Functions
    // **************************************************

    static setUpperBands() {
        this.upperBand = this.simpleMovingAverage + (this.deviations * this.standardDeviation)
    }

    static setSimpleBands() {
        this.middleBand = this.simpleMovingAverage;
    }

    static setLowerBands() {
        this.lowerBand = this.simpleMovingAverage - (this.deviations * this.standardDeviation);
    }

    // **************************************************

    // **************************************************
    // MACD Functions
    // **************************************************

    static calculateFirstMACD(tableID) {
        this.firstMovingAverageDays = this.settings.get(tableID).firstMovingAverageDays; // check
        let firstMACD = 0;
        for (let index = 0; index < this.firstMovingAverageDays; index++) {
            firstMACD += this.prevCloseArr[index]; // += (get(i))
        }

        this.firstMACD = firstMACD / this.firstMovingAverageDays;
    }

    static calculateSecondMACD(tableID) {
        this.secondMovingAverageDays = this.settings.get(tableID).secondMovingAverageDays; // check
        let secondMACD = 0;
        for (let index = 0; index < this.secondMovingAverageDays; index++) {
            secondMACD += this.prevCloseArr[index]; // += (get(i))
        }

        this.secondMACD = secondMACD / this.secondMovingAverageDays;
    }

    // Whether or not it crosses the boundary

    static calculateSignal() {
        this.signal = this.firstMACD - this.secondMACD;
    }

    // **************************************************

    // **************************************************
    // RSI Functions
    // **************************************************
    static calculateRSI(tableID) {
        // Quarters of the year
        this.rsiWeight = this.settings.get(tableID).rsiWeight;
        const q1 = ((this.prevCloseArr[149] - this.prevCloseArr[199]) / this.prevCloseArr[199] * 100) * this.rsiWeight;
        const q2 = ((this.prevCloseArr[99] - this.prevCloseArr[149]) / this.prevCloseArr[149] * 100) * this.rsiWeight;
        const q3 = ((this.prevCloseArr[49] - this.prevCloseArr[99]) / this.prevCloseArr[99] * 100) * this.rsiWeight;
        const q4 = ((this.prevCloseArr[0] - this.prevCloseArr[49]) / this.prevCloseArr[49] * 100) * this.rsiWeight;

        this.relativeStrengthIndex = (q1 + q2 + q3 + q4);
    }

    // **************************************************


}