'use strict';

var App = require('../../app'),
    AppLayoutView = require('../AppLayoutView'),
    ContactLayoutView = require('./views/ContactLayoutView'),
    TextMessageView = require('../feed/TextMessageView'),
    loader = require('../../loader'),
    gateway = require('../../APIGateway/gateway');

module.exports = {
    showLayout: function() {
        App.regions = new AppLayoutView();
        this.contactLayoutView = new ContactLayoutView();
        App.regions.getRegion('centralRegion').show(this.contactLayoutView);

        this.contactLayoutView.listenTo(this.contactLayoutView, 'signin signup', _.bind(this.authenticate, this));
        this.contactLayoutView.listenTo(this.contactLayoutView, 'sendContactInfo', _.bind(this.sendContactInfo, this));
    },

    authenticate: function(auth) {
        App.trigger('authenticate', auth);
    },

    sendContactInfo: function(options) {
        loader.show('sending');
        gateway.sendRequest('sendContactInfo', {
            payload: options
        }).then(_.bind(function(resp) {
            loader.hide();
            var text = 'successfully sent your info';
            var successView = new TextMessageView({
                text: text
            });
            App.regions.getRegion('popupRegion').show(successView);
        }, this), _.bind(function(jqXHR) {
            loader.hide();
            var text = h().getErrorMessage(jqXHR, 'Unable to send information');
            var errorView = new TextMessageView({
                text: text
            });
            App.regions.getRegion('popupRegion').show(errorView);
        }, this));
    },
}
