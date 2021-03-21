import * as cache from 'cache-base';

const cache_ = new cache();

export default class Cache {

    static set(key, value) {
        cache_.set(key.toString(), value);
    }

    static get(key) {
        return cache_.get(key.toString());
    }

    static cache()
    {
        return cache_;
    }
}