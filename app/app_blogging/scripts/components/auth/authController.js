'use strict';

var App = require('../../app'),
    AppLayoutView = require('../AppLayoutView'),
    loader = require('../../loader'),
    Vent = require('../../Vent'),
    gateway = require('../../APIGateway/gateway'),
    h = require('../../globalHelpers'),
    sessionActions = require('../../actions/sessionActions'),
    userController = require('../../controllers/userController'),
    SignInView = require('./views/SignInView'),
    SignUpView = require('./views/SignUpView'),
    SignOutView = require('./views/SignOutView'),
    TextMessageView = require('../feed/TextMessageView');

module.exports = {

    showLayout: function() {
        this.user = sessionActions.getCurrentUser();
        App.on('authenticate', _.bind(this.authenticate, this));
        App.on('confirmSignout', _.bind(this.confirmSignout, this));
    },

    authenticate: function(auth) {
        switch (auth) {
            case 'signin':
                this.authView = new SignInView();
                this.authView.listenTo(this.authView, 'signup', _.bind(this.authenticate, this));
                break;
            case 'signup':
                this.authView = new SignUpView();
            default:
        };
        this.popup = this.authView;
        App.regions.getRegion('popupRegion').show(this.authView);
        this.authView.listenTo(this.authView, 'submitSignin', _.bind(this.submitSignin, this));
    },

    submitSignin: function() {
        loader.show('');
        sessionActions.startSession(this.popup.val().username, this.popup.val().password)
            .then(function(response) {
                loader.showFlashMessage( 'successfully signed in as ' + response.username );
                this.popup.close();
                App.trigger('login_success');
                this.navigateToFeed();
            }.bind(this), function(jqXHR) {
                if( jqXHR.status === 400 ) {
                    this.popup.showLoginError();
                    loader.hide();
                }else{
                    loader.showFlashMessage(h().getErrorMessage(jqXHR, 'Error signin in'));
                }
            }.bind(this));
        return false;
    },

    confirmSignout: function(view) {
        this.headerChangeView = view;
        this.signOutView = new SignOutView({
            text: 'Are you sure you want to sign out?',
            action: this.signout.bind(this)
        });
        App.regions.getRegion('popupRegion').show(this.signOutView);
        this.signOutView.listenTo(this.signOutView, 'signout', _.bind(this.signout, this));
    },

    signout: function() {
        loader.show('');
        userController.logout(this.user.getUID()).then(function() {
            App.trigger('signout');
            this.headerChangeView.signedOut();
            loader.showFlashMessage( 'signed out' );
            $('.main_content').addClass('hidden_info_panel');
            App.trigger('viewChange', 'contactus');
        }.bind(this), function(e){
            loader.showFlashMessage(h().getErrorMessage(e, config.defaultErrorMsg));
        });
    },

    navigateToFeed: function() {
        this.authView.$el.on('hidden.bs.modal', _.bind(function() {
            $('.main_content').removeClass('hidden_info_panel');
            App.trigger('viewChange', 'feed');
        }, this));
    }
};
