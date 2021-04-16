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
            signalMessage: this.signalMessage.toString(),
            signal: this.signal.toString(),
            firstMACD: this.firstMACD.toString(),
            secondMACD: this.secondMACD.toString(),
            upperBand: this.upperBand.toString(), middleBand: this.middleBand.toString(),
            lowerBand: this.lowerBand.toString(), SMA: this.SMA.toString(),
            RSI: this.RSI.toString(), Volume: this.Volume.toString()
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
    static setPreviousCloses(tableID) {
        let prevCloseArr = [];
        for (let index = 0; index < 200; index++) {
            prevCloseArr[index] = 1;   // += (get(i))
        }

        this.previousCloses.set(tableID.toString(), prevCloseArr);
    }

    // Previous close sum
    static setPreviousCloseSum(tableID) {
        const prevCloseArr = this.previousCloses.get(tableID.toString());

        for (let index = 0; index < this.bollingerBandsNo; index++) {
            this.prevCloseSum += prevCloseArr[index]; // += (get(i))
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
    static caclualteStandardDeviation(tableID) {
        const prevCloseArr = this.previousCloses.get(tableID.toString());
        let standardDeviation;
        for (let index = 0; index < this.bollingerBandsNo; index++) {
            standardDeviation += Math.pow(prevCloseArr[index] - this.simpleMovingAverage, 2); // += (get(i))
        }

        this.standardDeviation = Math.sqrt(standardDeviation / this.bollingerBandsNo);
    }

    // **************************************************
    // Bollinger Bands Functions
    // **************************************************

    static setUpperBands() {
        this.upperBand = this.simpleMovingAverage + (this.deviations * this.standardDeviation)
    }

    static setMiddleBands() {
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
        const prevCloseArr = this.previousCloses.get(tableID.toString());
        let firstMACD = 0;
        for (let index = 0; index < this.firstMovingAverageDays; index++) {
            firstMACD += prevCloseArr[index]; // += (get(i))
        }

        this.firstMACD = firstMACD / this.firstMovingAverageDays;
    }

    static calculateSecondMACD(tableID) {
        const prevCloseArr = this.previousCloses.get(tableID.toString());
        let secondMACD = 0;
        for (let index = 0; index < this.secondMovingAverageDays; index++) {
            secondMACD += prevCloseArr[index]; // += (get(i))
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
        const prevCloseArr = this.previousCloses.get(tableID.toString());
        const q1 = ((prevCloseArr[149] - prevCloseArr[199]) / prevCloseArr[199] * 100) * this.rsiWeight;
        const q2 = ((prevCloseArr[99] - prevCloseArr[149]) / prevCloseArr[149] * 100) * this.rsiWeight;
        const q3 = ((prevCloseArr[49] - prevCloseArr[99]) / prevCloseArr[99] * 100) * this.rsiWeight;
        const q4 = ((prevCloseArr[0] - prevCloseArr[49]) / prevCloseArr[49] * 100) * this.rsiWeight;

        this.relativeStrengthIndex = (q1 + q2 + q3 + q4);
    }

    // **************************************************



}