
import * as cache from 'cache-base';

export default class PortfolioCache {
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

    static updateDataCallback;
    static updateTable = false;
    static tableID = null;

 
    // **************************************************
    // Getters and Setters
    // **************************************************

    static set(key, value) {
        this.cache_.set(key.toString(), value);
    }

    static get(key) {
        return this.cache_.get(key.toString());
    }

    /* Do not allow scrolling while Updating */
    static setDisableScroll(bool) {
        this.disableUpdate = bool;
    }

    // Set if a new row needs to be added to this table
    static setUpdate(updateTable, tableID) {
        this.updateTable = updateTable;
        this.tableID = tableID;
    }

    // Determines if a row is added
    static getUpdateTable() {
        return this.updateTable;
    }

    // Gets ID of the added row
    static getTableID() {
        return this.tableID;
    }
    // **************************************************

    static setUpdateData(callback) {
        this.updateDataCallback = callback;
    }

    static getUpdateData() {
        this.updateDataCallback();
    }



}