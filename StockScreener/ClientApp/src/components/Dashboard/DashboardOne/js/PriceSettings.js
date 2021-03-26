import * as HashMap from 'hashmap';

/* Set Start Prices and Target Prices */
export default class PriceSettings {
    static startPrice = 0;
    static targetPrice = 0;

    static priceDetectionEnabled = false;
    static hideBullishStocks = false;  
    static hideBearishStocks = false;  
    
    static map = new HashMap();

    // Enable local storage of states / Database 

    static sethideBullishStocks(_var) {
        this.hideBullishStocks = _var;
    }

    static sethideBearishStocks(_var) {
        this.hideBearishStocks = _var;
    }
    
    static setGlobalStartPrice(_startPrice) {
        this.startPrice = _startPrice;
    }

    static setGlobalTargetPrice(_targetPrice) {
        this.targetPrice = _targetPrice;
    }

    static setPriceDetectionEnabled(_priceDetectionEnabled) {
        this.priceDetectionEnabled = _priceDetectionEnabled;
    }

    static getPriceDetectionEnabled() {
        return this.priceDetectionEnabled;
    }

    static getStartPrice() {
        return this.startPrice;
    }

    static getTargetPrice() {
        return this.targetPrice;
    }

    static getHideBullishStocks() {
        return this.hideBullishStocks;
    }
    
    static getHideBearishStocks() {
        return this.hideBearishStocks;
    }

    static getLocalStartPrice(clickedAlertTableRowID) {
        return this.map.get(clickedAlertTableRowID).LocalStartPrice;
    }

    static getLocalTargetPrice(clickedAlertTableRowID) {
        return this.map.get(clickedAlertTableRowID).LocalTargetPrice;
    }

    // Set local prices using global prices without overriding prices already set
    static setLocalPrices(startPrice, targetPrice, clickedAlertTableRowID) {
        const data =
        {
            LocalStartPrice: startPrice,
            LocalTargetPrice: targetPrice,
            Override: "YES" 
        }

        for (let key = 0; key < 897; key++) {
            if (key === clickedAlertTableRowID) {
                this.map.set(key, data);
                break;
            }
        }
    }

    // Override local prices using global prices
    overrideLocalPrices(startPrice, targetPrice) {
    /*    const data =
        {
            LocalStartPrice: startPrice,
            LocalTargetPrice: targetPrice,
            Override: "NO" // If set by user, price will be overriden
        }

        for (let key = 0; key < 897; key++) {
            this.map.set(key, data);
        } */
    }

    // Update stock hashmap
    updateStockDashBoardMap() {
      /*    const data =
        {
            LocalStartPrice: this.startPriceRef.current.value,
            LocalTargetPrice: this.targetPriceRef.current.value
        }

        // Update HashMap
      const clickedAlertTableRowID = this.state.clickedAlertTableRowID;
        this.map.set(clickedAlertTableRowID, data);*/
    }


}