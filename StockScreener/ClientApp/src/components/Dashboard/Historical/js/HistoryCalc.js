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
    static firstMACD = 0;
    static secondMACD = 0;
    static signal = 0; // For macd line
    static relativeStrengthIndex = 0;


    static idHashMap = new HashMap();
    static settings = new HashMap();

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

    // Retrieve historical data from file
    static prevCloseArr = []; // fill to 200 (max) 

    // **************************************************
    // User Set Variables
    // **************************************************
    static bollingerBandsNo = 2;
    static deviations = 2;
    static firstMovingAverageDays = 25; // For MACD
    static secondMovingAverageDays = 50; // For MACD
    static smoothing = 0.2;
    static rsiWeight = 1;
    static Volume = 250000;

    // **************************************************
    // Get and Set Variables for updating table
    // **************************************************

    static getJSON() {
        const json = {
            signalMessage: this.signalMessage,
            signal: this.signal,
            firstMACD: this.firstMACD,
            secondMACD: this.secondMACD,
            upperBand: this.upperBand, middleBand: this.middleBand,
            lowerBand: this.lowerBand, SMA: this.SMA,
            RSI: this.RSI, Volume: this.Volume
        }
        return json;
    }

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

    // **************************************************
    // Previous Closes
    // **************************************************

    // Read previous closes from database
    static setPreviousCloses() {
        for (let index = 0; index < 200; index++) {
            this.prevCloseArr[index] = 1;   // += (get(i))
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

    // **************************************************
    // SMA and Standard Deviation
    // **************************************************


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

    static calculateFirstMACD(firstMovingAverageDays) {
        // this.firstMovingAverageDays = this.settings.get(tableID).firstMovingAverageDays; // check

        let firstMACD = 0;
        this.firstMovingAverageDays = firstMovingAverageDays;
        for (let index = 0; index < this.firstMovingAverageDays; index++) {
            firstMACD += this.prevCloseArr[index]; // += (get(i))
        }

        this.firstMACD = firstMACD / this.firstMovingAverageDays;
    }

    static calculateSecondMACD(secondMovingAverageDays) {
        //   this.secondMovingAverageDays = this.settings.get(tableID).secondMovingAverageDays; // check
        let secondMACD = 0;
        this.secondMovingAverageDays = secondMovingAverageDays;
        for (let index = 0; index < this.secondMovingAverageDays; index++) {
            secondMACD += this.prevCloseArr[index]; // += (get(i))
        }

        this.secondMACD = secondMACD / this.secondMovingAverageDays;
    }

    // Whether or not it crosses the boundary

    static calculateSignal() {
        this.signal = this.firstMACD - this.secondMACD;
    }


    static calculateSignalMessage() {
        if (this.relativeStrengthIndex >= 70)
            this.signalMessage = "High momentum";
        else if (this.relativeStrengthIndex >= 31 && this.relativeStrengthIndex <= 69) {
            this.signalMessage = "Growth Stock";
        }
        else if (this.relativeStrengthIndex <= 30) {
            this.signalMessage = "Low momentum";
        }
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