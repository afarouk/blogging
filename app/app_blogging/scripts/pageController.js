'use strict';

var App = require('./app');

module.exports = {

    feed: function() {
        var centralPartController = require('./controllers/centralPartController');
        centralPartController.showLayout();
    },

    auth: function() {
        var authController = require('./components/auth/authController'),
            headerController = require('./controllers/headerController');
        headerController.showLayout();
        authController.showLayout();
    },

    contactus: function() {
        var contactUsController = require('./components/contactUsForm/contactUsController');
        contactUsController.showLayout();
    }
};
