import * as cache from 'cache-base';

let cache_ = new cache();

/**
 * Cache for storing data to trigger alerts 
 */
export default class DashboardTwoAlertCache {
    

    static set(key, value) {
        cache_.set(key.toString(), value);
    }

    static get(key) {

        return cache_.get(key.toString());
    }

    static cache() {
        return cache_;
    }

    static size() {
        return cache_.size;
    }

}