
import * as HashMap from 'hashmap';
/**
* Calculations for Portfolio, includes a set of mathematical 
* functions that query a database for saved informaion
*/
export default class PortfolioCalc {
    static expenditure = 0;
    static netGain = 0;
    static gross = 0;

    static data = new HashMap();

    // Called at initialise
    static setDataMap(key, price, shares, date) {
        this.data.set(key, { price: price, shares: shares, date: date });
        this.calculateExpenditure(key);
    }

    static deleteKeyDataMap(key) {
        this.data.delete(key);
    }

    static calculateExpenditure(id) {
        this.expenditure = this.data.get(id).price * this.data.get(id).shares;
    }

    static getPrice(id) {
        return this.data.get(id).price;
    }

    static getShares(id) {
        return this.data.get(id).shares;
    }

    static getDate(id) {
        return this.data.get(id).date;
    }

    static getExpenditure() {
        return this.expenditure;
    }

    static getNetGain() {
        return this.netGain;
    }

    static getGross() {
        return this.gross;
    }

    static calculateNetGain(id) {
        const expenditure = this.data.get(id).expenditure;
        const netGain = expenditure - (this.currentPrice * this.shares);
        this.netGain = netGain;
        return this.netGain;
    }

    // Return Gross and Id
    async getGross() {
        await fetch('getgross')
            .then(response => response.json())
            .then(response => {
                return JSON.parse(response);
            })
            .catch(error => {
                console.log("error " + error) // 404
                return undefined;
            }
        );
    }
    //  set Gross and Id
    async setGross(gross) {
        await fetch('setgross/'.concat(gross))
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

    // Called Once at EOD
    static async setGross() {
        const res = await this.getGross();
        if (res === null || res === undefined)
            return;
        
        const gross = res.Gross;
        const Id = res.Id;
        this.gross = gross + this.calculateNetGain(Id);

        const obj =
        {
            Id: Id,
            Gross: this.profit
        }

        this.setGross(JSON.stringify(obj));

    }


}