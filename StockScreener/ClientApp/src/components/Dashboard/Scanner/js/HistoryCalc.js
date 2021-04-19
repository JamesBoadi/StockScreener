import * as HashMap from 'hashmap';
import * as cache from 'cache-base';

/**
* A set of mathematical 
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

    // Retrieve historical data from file
    static previousCloses = new cache();

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



    // **************************************************
    // User Set Variables
    // **************************************************
    static bollingerBandsNo = 15;
    static deviations = 10;
    static firstMovingAverageDays = 25; // For MACD
    static secondMovingAverageDays = 50; // For MACD
    static smoothing = 0.2;
    static rsiWeight = 10;
    static Volume = 250000;

    // **************************************************
    // Get and Set Variables for updating table
    // **************************************************

    static getJSON() {
        const tableID = this.getID();
        this.setPreviousCloses(tableID); // Data in this function saved to database
        this.setPreviousCloseSum(tableID);
        this.setSMA();
        this.caclualteStandardDeviation(tableID);
        this.setUpperBands();
        this.setMiddleBands();
        this.setLowerBands();
        this.calculateFirstMACD(tableID);
        this.calculateSecondMACD(tableID);
        this.calculateRSI(tableID);
        this.calculateSignal();
        this.calculateSignalMessage();

        const json = {
            signalMessage: this.signalMessage.toString(),
            signal: this.signal.toPrecision(2),
            firstMACD: this.firstMACD.toPrecision(2),
            secondMACD: this.secondMACD.toPrecision(2),
            upperBand: this.upperBand.toPrecision(2), middleBand: this.middleBand.toPrecision(2),
            lowerBand: this.lowerBand.toPrecision(2), SMA: this.SMA.toPrecision(2),
            RSI: this.RSI.toPrecision(2), Volume: this.Volume.toString()
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

    static setID(id) {
        this.id = id;
    }

    static getID() {
        return this.id;
    }

    // **************************************************

    // **************************************************
    // Previous Closes
    // **************************************************

    // Read previous closes from database
    static setPreviousCloses(tableID) {
        let prevCloseArr = [];
        // Set 200 previoous in database
        for (let index = 0; index < 200; index++) {
            prevCloseArr[index] = Math.random() * 100;   // += (get(i))
        }

        this.previousCloses.set(tableID.toString(), prevCloseArr);
    }

    // Previous close sum
    static setPreviousCloseSum(tableID) {
        const prevCloseArr = this.previousCloses.get(tableID.toString());
        let prevCloseSum = 0;
        for (let index = 0; index < this.bollingerBandsNo; index++) {
            prevCloseSum += prevCloseArr[index]; // += (get(i))
        }
        this.prevCloseSum = prevCloseSum;
    }


    // **************************************************
    // SMA and Standard Deviation
    // **************************************************

    // Calculate simple moving average
    static setSMA() {
        this.simpleMovingAverage = parseFloat(this.prevCloseSum / this.bollingerBandsNo);
        this.SMA = this.simpleMovingAverage;
    }

    // Calculate standard deviation
    static caclualteStandardDeviation(tableID) {
        const prevCloseArr = this.previousCloses.get(tableID.toString());
        let standardDeviation = 0;
        for (let index = 0; index < this.bollingerBandsNo; index++) {
            standardDeviation += Math.pow(prevCloseArr[index] - this.simpleMovingAverage, 2);
        }

        this.standardDeviation = parseFloat(Math.sqrt(standardDeviation / this.bollingerBandsNo));

    }

    // **************************************************
    // Bollinger Bands Functions
    // **************************************************

    static setUpperBands() {
        this.upperBand = parseFloat(this.simpleMovingAverage + (this.deviations * this.standardDeviation));
    }

    static setMiddleBands() {
        this.middleBand = parseFloat(this.simpleMovingAverage);
    }

    static setLowerBands() {
        this.lowerBand = parseFloat(this.simpleMovingAverage - (this.deviations * this.standardDeviation));
    }

    // **************************************************

    // **************************************************
    // MACD Functions
    // **************************************************

    static calculateFirstMACD(tableID) {
        const prevCloseArr = this.previousCloses.get(tableID.toString());
        let firstMACD = 0;
        for (let index = 0; index < this.firstMovingAverageDays; index++) {
            firstMACD += prevCloseArr[index]; // += (get(i))
        }

        this.firstMACD = parseFloat(firstMACD / this.firstMovingAverageDays);
    }

    static calculateSecondMACD(tableID) {
        const prevCloseArr = this.previousCloses.get(tableID.toString());
        let secondMACD = 0;
        for (let index = 0; index < this.secondMovingAverageDays; index++) {
            secondMACD += prevCloseArr[index]; // += (get(i))
        }

        this.secondMACD = parseFloat(secondMACD / this.secondMovingAverageDays);
    }

    // Whether or not it crosses the boundary
    static calculateSignal() {
        this.signal = parseFloat(this.firstMACD - this.secondMACD);
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
        const prevCloseArr = this.previousCloses.get(tableID.toString());
        const q1 = ((prevCloseArr[149] - prevCloseArr[199]) / prevCloseArr[199] * 100) * this.rsiWeight;
        const q2 = ((prevCloseArr[99] - prevCloseArr[149]) / prevCloseArr[149] * 100) * this.rsiWeight;
        const q3 = ((prevCloseArr[49] - prevCloseArr[99]) / prevCloseArr[99] * 100) * this.rsiWeight;
        const q4 = ((prevCloseArr[0] - prevCloseArr[49]) / prevCloseArr[49] * 100) * this.rsiWeight;

        this.relativeStrengthIndex = (q1 + q2 + q3 + q4);
        this.RSI = parseFloat(this.relativeStrengthIndex);
    }

    // **************************************************



}