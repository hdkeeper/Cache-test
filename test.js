'use strict';
const sizeof = require('object-sizeof');

class Cache {
    constructor(maxSize) {
        this.maxSize = maxSize;
        this.data = {};
        this.size = sizeof(this);
    }

    get(key) {
        let entry = this.data[key];
        if (!entry) {
            return;
        }
        // Update access time
        entry.t = Date.now();
        return entry.v;
    }

    put(key, value) {
        let newEntry = {v: value, t: Date.now()};
        let newEntrySize = sizeof(newEntry) + sizeof(key);
        if (this.size + newEntrySize > this.maxSize) {
            this.cleanup( this.maxSize - newEntrySize);
        }

        this.data[key] = newEntry;
        this.size = sizeof(this);
    }

    cleanup(targetSize) {
        while (this.size > targetSize) {
            // Find last accessed entry
            let lastT = Date.now(), lastKey = null;
            for (let key in this.data) {
                let entry = this.data[key];
                if (entry.t < lastT) {
                    lastT = entry.t;
                    lastKey = key;
                }
            }

            if (lastKey) {
                // Delete this entry
                delete this.data[lastKey];
                this.size = sizeof(this);
            }

        }
    }

}; // class Cache



let c = new Cache(1024);
c.put('a', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
c.put('b', 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');
c.put('c', 'ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc');
c.put('d', 'ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd');
c.put('e', 'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
c.put('f', 'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
console.log(c);

console.log( c.get('a'));
console.log(c);

c.put('g', 'ggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg');
console.log(c);
