import * as cache from 'cache-base';


let cache_ = new cache();
let cacheOp_ = new cache();

export default class TableCache {

    static endMod = 47;
    static multiplier = 50; // The number of rows displayed per Render
    static max = 50; // The maximum number times the multiplier
    static end = 0; // 
    static resetScrollPosition = false;
    static priceDetection = false;

    static set(key, value) {
        cache_.set(key.toString(), value);
    }

    static setResetScrollPosition(bool) {
        this.resetScrollPosition = bool;
    }

    static getResetScrollPosition() {
        return this.resetScrollPosition;
    }

    static get(key) {
        return cache_.get(key.toString());
    }


    static getMultiplier() {
        return this.multiplier;
    }

    static cache() {
        return cache_;
    }

    static size() {
        return cache_.size;
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
        cacheOp_.clear();
        let pointer = -1;
        for (let index = 0; index < cache_.size; index++) {
            const item = cache_.get(index.toString());
            // Filter Stocks
            if (item.ChangeArray[0] < 0) {
                cacheOp_.set(++pointer, item);
            }
        }

        // Disable Detection
        if (pointer === -1) {
            this.priceDetection = false;
            return;
        }
        else
            this.priceDetection = true;

        // Calculate endMod
        if (cacheOp_.size < 50) {
            this.endMod = 0;
            //   this.end = cacheOp_.size;
        } else {
            this.endMod = parseInt(cacheOp_.size % 50);
            this.max = parseInt((cacheOp_.size - this.endMod) / 50);
            this.multiplier = this.endMod;
        }

        return cacheOp_;
    }



}