import * as cache from 'cache-base';



export default class ScannerCache {
    static cache_ = new cache();
    static cacheOp_ = new cache();
    static endMod = 47;
    static multiplier = 50; // The number of rows displayed per Render
    static max = 50; // The maximum number times the multiplier
    static end = 0; // 
    static resetScrollPosition = false;
    static priceDetection = false;
    static update_hideStocks = false;
    static disableUpdate = false;

    static cacheNotNull = false;

    static item =
        {
            StockCode: "",
            TimeStamp: "",
            CurrentPrice: "",
            PrevOpen: "",
            Close: "",
            High: "",
            Low: "",
            Signal: "",
            ChangeArray: [0, 0, 0, 0, 0, 0],
            Volume: "",
            ChangeP: "",
            Change: ""
        }

    static set(key, value) {
        this.cache_.set(key.toString(), value);
    }

    static setUpdateHideStocks(bool) {
        this.update_hideStocks = bool;
    }

    static getUpdateHideStocks() {
        return this.update_hideStocks;
    }

    static setResetScrollPosition(bool) {
        this.resetScrollPosition = bool;
    }

    static getResetScrollPosition() {
        return this.resetScrollPosition;
    }

    /* Do not allow scrolling while Updating */
    static setDisableScroll(bool) {
        this.disableUpdate = bool;
    }

    static getDisableScroll() {
        return this.disableUpdate;
    }

    static get(key) {
        return this.cache_.get(key.toString());
    }

    static getOp(key) {
        return this.cacheOp_.get(key.toString());
    }

    
    static setFill(value) {
        this.cacheNotNull = value;
    }

    static getFill() {
        return this.cacheNotNull;
    }



    static getMultiplier() {
        return this.multiplier;
    }

    static cache() {
        return this.cache_;
    }

    static size() {
        return this.cache_.size;
    }

    static cacheOpSize() {
        return this.cacheOp_.size;
    }

    static getEndMod() {
        return this.endMod;
    }

    static getMax() {
        return this.max;
    }

    static getEnd() {
        return this.end;
    }

    static setPriceDetection(enable) {
        this.priceDetection = enable;
    }

    static getPriceDetection() {
        return this.priceDetection;
    }

    static getPreviousPrice(key) {
        return (this.get(key).CurrentPrice + this.get(key).Change);
    }

    static getCurrentPrice(key) {
        return this.get(key).CurrentPrice;
    }

    static hideBearishStocks() {
        this.cacheOp_.clear();
        let pointer = -1;
        let size = 0;

        this.disableUpdate = true;

        for (let index = 0; index < 897; index++) {
            const item = this.get(index);
            //  console.log("Bullish Stocks 1 " + item.CurrentPrice);
            // Filter Stocks

            // > 0 Bullish or Bearish
            if (item.ChangeArray[0] > 0) {
                ++pointer;
                let key = pointer.toString();
                this.cacheOp_.set(key, item);

                size++;
            }
        }

        // Disable Detection test
        if (pointer === -1) {
            this.priceDetection = false;
            this.max = 0;
            this.endMod = 0;
            return;
        }

        let count = size;
        // Calculate endMod
        if (size < 50) {
            this.endMod = 0;
            // Fill Cache with empty columns
            this.max = 0;
            this.end = size; // Set the end

            //console.log("less than 50 " + max);
        } else {
            this.endMod = parseInt(size % 50);
            this.max = parseInt((size - this.endMod) / 50);
            this.multiplier = this.endMod;

            // Fill Cache with empty columns
            let max = parseInt(((this.max * 50) + 50) - this.endMod);
            //console.log("more than 50 " + max);
            while (count < max) {
                count++;
                let key = count.toString();
                this.cacheOp_.set(key, this.item);
            }
        }

        /* console.log("SIZE " + size);
         console.log("MAX " + this.max);
         console.log("ENDMOD " + this.endMod);*/
        this.priceDetection = true;
        this.update_hideStocks = true;
    }

    static hideBullishStocks() {
        this.cacheOp_.clear();
        let pointer = -1;
        let size = 0;

        this.disableUpdate = true;

        for (let index = 0; index < 897; index++) {
            const item = this.get(index);
            //  console.log("Bullish Stocks 1 " + item.CurrentPrice);
            // Filter Stocks

             // > 0 Bullish or Bearish
            if (item.ChangeArray[0] < 0) {
                ++pointer;
                let key = pointer.toString();
                this.cacheOp_.set(key, item);
                size++;
            }
        }

        // Disable Detection test
        if (pointer === -1) {
            this.priceDetection = false;
            this.max = 0;
            this.endMod = 0;
            return;
        }

        let count = size;
        // Calculate endMod
        if (size < 50) {
            this.endMod = 0;
            // Fill Cache with empty columns
            this.max = 0;
            this.end = size; // Set the end
        } else {
            this.endMod = parseInt(size % 50);
            this.max = parseInt((size - this.endMod) / 50);
            this.multiplier = this.endMod;

            // Fill Cache with empty columns
            let max = parseInt(((this.max * 50) + 50) - this.endMod);
            //console.log("more than 50 " + max);
            while (count < max) {
                count++;
                let key = count.toString();
                this.cacheOp_.set(key, this.item);
            }
        }

        /* console.log("SIZE " + size);
         console.log("MAX " + this.max);
         console.log("ENDMOD " + this.endMod);*/

        this.priceDetection = true;
        this.update_hideStocks = true;
    }



}