/*global define */

'use strict';

var gateway = require('../APIGateway/gateway'),
    appCache = require('../appCache'),
    Vent = require('../Vent'),
    User = require('../models/user');

var initUser = function(response) {
    return appCache.get('user').init(response.uid, response.userName)
        .then( function () {
            Vent.trigger('login_success');
            return response;
        });
};

var killUser = function(response) {
    appCache.get('user').kill();
    localStorage.removeItem('cmxUID');
    Vent.trigger('logout_success', 'loggedOut');
    return response;
};

module.exports = {

    getCurrentUser: function () {
        return appCache.fetch('user', new User());
    },

    hasCurrentUser: function() {
        if ( appCache.get('user') && appCache.get('user').getUID ) {
            return appCache.get('user').getUID() ? true : false;
        }
        return false;
    },

    loginUser: function (username, password) {
        return gateway.sendRequest('login', {
            payload: {
                userid: username,
                password: password
            }
        });
    },

    logout: function(UID){
        return gateway.sendRequest('logout',{
            UID: UID
        }).then(killUser);
    }

};
