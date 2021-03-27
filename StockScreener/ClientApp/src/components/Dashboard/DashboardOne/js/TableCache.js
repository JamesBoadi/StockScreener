import * as cache from 'cache-base';



export default class TableCache {


    static cache_ = new cache();
    static cacheOp_ = new cache();
    static endMod = 47;
    static multiplier = 50; // The number of rows displayed per Render
    static max = 50; // The maximum number times the multiplier
    static end = 0; // 
    static resetScrollPosition = false;
    static priceDetection = false;
    static update_hideStocks = false;

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

    static get(key) {
        return this.cache_.get(key.toString());
    }

    static getOp(key) {
        return this.cacheOp_.get(key.toString());
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

    // Call Periodically (using hidebull or hidebearish) in dashnav class
    static hideBearishStocks() {
        this.cacheOp_.clear();
        console.log("CALLED " + this.size());
        let pointer = -1;
        let count = 0;
        for (let index = 0; index <  this.cache_.size; index++) {
            const item =  this.cache_.get(index.toString());
            // Filter Stocks
            if (item.ChangeArray[0] < 0) {
                this.cacheOp_.set(++pointer, item);
                count++;
            }
        }
        // Disable Detection
        if (pointer === -1) {
            this.priceDetection = false;
            return;
        }

        // Calculate endMod
        if ( this.cacheOp_.size < 50) {
            this.endMod = 0;
            // Fill Cache with empty columns
            let max = parseInt(50 -  this.cacheOp_.size);
            this.end = max; // Set the end
            while (count < max) {
                this.cacheOp_.set(count++, this.item);
            }
        } else {
            this.endMod = parseInt( this.cacheOp_.size % 50);
            this.max = parseInt(( this.cacheOp_.size - this.endMod) / 50);
            this.multiplier = this.endMod;
            // Fill Cache with empty columns
            let max = parseInt(((this.max * 50) + 50) -  this.cacheOp_.size);
            while (count < max) {
                this.cacheOp_.set(count++, this.item);
            }
        }

        this.priceDetection = true;
    }

    static hideBullishStocks() {
        
        this.cacheOp_.clear();
        let pointer = -1;
        let size = 0;

        console.log("CALLED " + this.size());
        for (let index = 0; index <  897; index++) {
            const item = this.get(index);
          //  console.log("Bullish Stocks 1 " + item.CurrentPrice);
            // Filter Stocks

            if (item.ChangeArray[0] > 0) {
                ++pointer;
                let key = pointer.toString();
                this.cacheOp_.set(key, item);
               
                size++;
            }
        }

        // Disable Detection
        if (pointer === -1) {
            this.priceDetection = false;
            return;
        }

        console.log("Bullish Stocks TOTAL " + size);
        let count = size;
        // Calculate endMod
        if (size < 50) {
            this.endMod = 0;
            // Fill Cache with empty columns
            let max = parseInt(50 - size);
            this.end = max; // Set the end
            while (count <= max) {
                count++;
                let key = count.toString();
                this.cacheOp_.set(key, this.item);
            }
            console.log("less than 50 " + max);
        } else {
            this.endMod = parseInt(size % 50);
            this.max = parseInt((size - this.endMod) / 50);
            this.multiplier = this.endMod;
            // Fill Cache with empty columns
            let max = parseInt(((this.max * 50) + 50) - size);
            console.log("more than 50 " + max);
            while (count <= max) {
                count++;
                let key = count.toString();
                this.cacheOp_.set(key, this.item);
            }
        }

        this.priceDetection = true;
        this.update_hideStocks = true;
    }



}