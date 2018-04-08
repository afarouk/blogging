/*global define*/

'use strict';

var appConfig = require('../appConfig.js'),
    h = require('../globalHelpers.js');

var UserModel = function(UID, userName) {
   
    this.UID = UID || '';
    this.userName = userName ||'';
    this.community = null;

};

UserModel.prototype = {

    initiate: function(UID, username) {
        this.UID = UID;
        this.userName = username;
    },

    kill: function(){
        this.setUID('');
        this.community = null;
    },

    getUserName: function() {
        return this.userName;
    },

    setUserName: function(name) {
        this.userName = name;
    },

    getUID: function(){
        return this.UID;
    },

    setUID: function(UID){
        this.UID = UID;
    },

    getCommunity: function(UID) {
        var self = this;
        $.ajax({
            url: config.apiRoot + '/authentication/getUserAndCommunity',
            data: {
                UID: UID
            },
            dataType: 'json'
        }).done(function(response){
            self.community = response.community;
        }).error(h().logApiError);
    },

    isMemberOf: function(sa,sl) {
        if(!this.community){
            return false;
        }

        var member = $.grep(this.community, function(item){
            return item.type === 'MEMBER';
        });

        var sasls = member[0].sasls || [];

        for (var i = sasls.length - 1; i >= 0; i--) {
            if( sasls[i].sa == sa && sasls[i].sl == sl ){
                return true;
            }
        }

        return false;
    },

    hasFavorite: function(sa,sl) {
        return this.favorites.get('' + sa + sl + '') ? true : false;
    }

};

module.exports = UserModel;
