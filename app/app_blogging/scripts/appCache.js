/*global define*/
    
'use strict';

var cache = {};

var getItem = function(key) {
    if ( typeof key !== 'string' ) {
        throw new Error('First parameter must be string');
    }
    return cache[key];
};

module.exports = _.extend( Backbone.Events, {

    set: function(key, value) {
        cache[key] = value;
        this.trigger('change:' + key, value);
    },

    get: function(key, callback) {
        var item = getItem(key);
        if ( !item && callback ) {
            callback();
            return;
        }
        return item;
    },

    fetch: function(key, value) {
        var item = getItem(key);
        if ( !item ) {
            this.set( key, value );
        }
        return this.get(key);
    },

    clear: function(){
        var key;
        for( key in cache ){
            cache[key] = null;
        }
    }

});
