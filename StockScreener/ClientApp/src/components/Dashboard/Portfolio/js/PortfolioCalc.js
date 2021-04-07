/**
* Calculations for Portfolio, includes a set of mathematical 
* functions that query a database for saved informaion
*/
export default class PortfolioCalc {
    static profitLoss = 0;
    static profitLossPercentage = 0;

    static price;
    static shares;
    static expenditure = 0;
    static currentPrice; 
    static prevClose;

    static setPortfolio(_price, _shares, _expenditure) {
        this.price = _price;
        this.shares = _shares;
        this.expenditure = _expenditure;

        // Add to database and map
    }

    // Set once
    static setNetGain() {
        const hours = new Date().getHours() + 8;

        if (hours === 9) {
            const start_netGainSet = false;  // Value from database
            if (start_netGainSet) {
                const profit = (this.currentPrice - this.price) * this.shares;

                // save(  ) Save to database
            }
        }
    }

    static calculateProfitLoss() {
        //const prevProfitLoss = 0; // Value from database
        const profit = (this.prevClose - this.currentPrice) * this.shares;

        // Set profit
        this.profitLoss = profit + this.profit;
    }

    static calculateProfitLossPercentage() {
        //const prevProfitLoss = 0; // Value from database
        const percentage = (this.prevClose - this.currentPrice) / this.currentPrice;

        // Set profit
        this.profitLossPercentage = percentage;
    }

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