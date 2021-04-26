
import * as map from 'collections/map';
/**
* Calculations for Portfolio, includes a set of mathematical 
* functions that query a database for saved informaion
*/
export default class PortfolioCalc {
    static expenditure = 0;
    static netGain = 0;
    static gross = 0;
    static map = new map();
    // Called at initialise
    static setDataMap(key, price, shares, date) {
        let obj = { price: price, shares: shares, date: date };
        if (this.map.has(key)) {
            this.map.delete(key);
            this.map.set(key, obj);
        }

        this.map.set(key, obj);
    }

    static deleteKeyDataMap(key) {
        if (this.map.has(key))
            this.map.delete(key);
    }

    static getPrice(id) {
        const val = this.map.get(id);
        const price = val.price;
        return price;
    }

    static getShares(id) {
        const val = this.map.get(id);
        const shares = val.shares;
        return shares;
    }

    static getDate(id) {
        const val = this.map.get(id);
        const date = val.date;
        return date;
    }

    static getExpenditure(id) {
        return this.getPrice(id) * this.getShares(id);
    }

    static getNetGain(id) {
        // this.calculateNetGain(id);
        return 0;   //this.netGain;
    }

    static getGross(id) {
        // gross= await this.getGross()
        return 0; // gross
    }

    static calculateNetGain(id) {
        const val = this.map.get(id);
        const expenditure = val.expenditure;
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