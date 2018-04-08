/*global define */

'use strict';

var config = require('../appConfig.js'),
    addressMap = require('../APIGateway/addressMap.js');

var resolveMethod = function(name){
    return addressMap.getAddressMap()[name][0];
};

var resolveAddress = function(name){
    return config.apiRoot + addressMap.getAddressMap()[name][1];
};

module.exports = {

    sendFile: function(name, options) {
        options = options || {};
        var url, method, formData, UID;

        try {
            url = resolveAddress(name);
            method = resolveMethod(name);
        } catch(e) {
            console.error('request "' + name + '" could not be mapped to any api call');
            return $.Deferred().reject('request "' + name + '" could not be mapped to any api call').promise();
        }

        UID = options.UID;
        delete options.UID;

        formData = new FormData();
        var image = options.image;
        delete options.image;

        formData.append('mediametadata', JSON.stringify(options));
        if (image) {
            formData.append('image', image, 'picFromCanvas.jpg');
        };

        return $.ajax({
            type: method,
            contentType: false,
            processData: false,
            data: formData,
            url: url + '?UID=' + UID,
            timeout: 10000
        });
    },


    //send poll with media
    sendMultipart: function(name, options) {
        options = options || {};
        var url, method, formData, UID;

        try {
            url = resolveAddress(name);
            method = resolveMethod(name);
        } catch(e) {
            console.error('request "' + name + '" could not be mapped to any api call');
            return $.Deferred().reject('request "' + name + '" could not be mapped to any api call').promise();
        }

        UID = options.UID;
        delete options.UID;

        formData = new FormData();

        var payload = options.payload;
        delete options.payload;

        if (payload) {
            formData.append('poll', JSON.stringify(payload));
        };

        var image = options.image;
        delete options.image;

        if (image) {
            formData.append('image', image, 'picFromCanvas.jpg');
        };
        return $.ajax({
            type: method,
            cache: false,
            contentType: false,
            processData: false,
            data: formData,
            url: url + '?UID=' + UID,
            timeout: 10000
        });
    },

    sendRequest: function(name, options) {
        options = options || {};
        var url, method, formData, UID;

        try {
            url = resolveAddress(name);
            method = resolveMethod(name);
        } catch(e) {
            console.error('request "' + name + '" could not be mapped to any api call');
            return $.Deferred().reject('request "' + name + '" could not be mapped to any api call').promise();
        }

        // This is for all the rest
        var payload = options.payload;
        delete options.payload;

        return $.ajax({
            type: method,
            url: (options ? url + '?' + $.param(options) : url),
            data: JSON.stringify(payload),
            contentType: 'application/json',
            processData: false,
            timeout: 10000
        });

    }

};
