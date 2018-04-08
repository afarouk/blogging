'use strict';

var App = require('../app'),
    AppLayoutView = require('../components/AppLayoutView'),
    Vent = require('../Vent'),
    loader = require('../loader'),
    h = require('../globalHelpers'),
    config = require('../appConfig'),
    sessionActions = require('../actions/sessionActions'),
    userController = require('./userController'),
    HeaderView = require('../components/header/HeaderView');

module.exports = {

    showLayout: function() {
        this.user = sessionActions.getCurrentUser();
        this.headerView = new HeaderView({
            user: this.user
        });
        this.headerView.listenTo(this.headerView, 'authentificate', _.bind(function() {
            App.trigger('authenticate', 'signin');
        }, this));
        this.headerView.listenTo(this.headerView, 'confirmSignout', _.bind(this.confirmSignout, this));
        App.on('login_success', _.bind(this.headerView.signedIn, this));
    },

    confirmSignout: function(view) {
        App.trigger('confirmSignout', view);
    }
}
