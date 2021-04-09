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
    static prevClose;
    static prevCloseArr = []; // fill to 200 (max)

    static firstMACD = 0;
    static secondMACD = 0;

    static signal = 0; // For macd line
    static relativeStrengthIndex = 0;

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

    // Read previous closes from database
    static setPreviousCloses() {
        this.prevClose += 0; // += (get(i))
        for (let index = 0; index < this.bollingerBandsNo; index++) {
            this.prevCloseArr[index] = 0;  // += (get(i))
        }
    }

    // Calculate simple moving average
    static setSMA() {
        this.simpleMovingAverage = this.prevClose / this.bollingerBandsNo; // += (get(i))
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

    static getUpperBands() {
        return this.simpleMovingAverage + (this.deviations * this.standardDeviation)
    }

    static getSimpleBands() {
        return this.simpleMovingAverage;
    }

    static getLowerBands() {
        return this.simpleMovingAverage - (this.deviations * this.standardDeviation);
    }

    // **************************************************

    // **************************************************
    // MACD Functions
    // **************************************************

    static calculateFirstMACD() {
        let firstMACD = 0;
        for (let index = 0; index < this.firstMovingAverageDays; index++) {
            firstMACD += this.prevCloseArr[index]; // += (get(i))
        }

        this.firstMACD = firstMACD / this.firstMovingAverageDays;
    }


    static calculateSecondMACD() {
        let secondMACD = 0;
        for (let index = 0; index < this.secondMovingAverageDays; index++) {
            secondMACD += this.prevCloseArr[index]; // += (get(i))
        }

        this.secondMACD = secondMACD / this.secondMovingAverageDays;
    }

    // Whether or not it crosses the boundary

    static calculateSignal() {
        return this.firstMACD - this.secondMACD;
    }

    // **************************************************

    // **************************************************
    // RSI Functions
    // **************************************************
    static calculateRSI() {
        // Quarters of the year
        const q1 = ((this.prevCloseArr[149] - this.prevCloseArr[199]) / this.prevCloseArr[199] * 100) * this.rsiWeight;
        const q2 = ((this.prevCloseArr[99] - this.prevCloseArr[149]) / this.prevCloseArr[149] * 100) * this.rsiWeight;
        const q3 = ((this.prevCloseArr[49] - this.prevCloseArr[99]) / this.prevCloseArr[99] * 100) * this.rsiWeight;
        const q4 = ((this.prevCloseArr[0] - this.prevCloseArr[49]) / this.prevCloseArr[49] * 100) * this.rsiWeight;

        this.relativeStrengthIndex = (q1 + q2 + q3 + q4);
    }

    // **************************************************





    static getProfitLoss() {
        return this.profitLoss;
    }

    static getProfitLossPercentage() {
        return this.profitLossPercentage;
    }

    static getExpenditure() {
        return this.expenditure;
    }

}