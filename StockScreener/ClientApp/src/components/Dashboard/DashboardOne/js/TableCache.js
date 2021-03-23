import * as cache from 'cache-base';


let cache_ = new cache();

export default class TableCache {
    

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