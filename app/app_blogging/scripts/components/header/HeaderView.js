'use strict';

var HeaderView = Mn.LayoutView.extend({

    el: '.header_element',

    ui: {
        signin: '.signin_button',
        signout: '.signout-button'
    },

    events: {
        'click @ui.signin': 'signin',
        'click @ui.signout': 'confirmSignout'
    },

    initialize: function(options) {
        if (options.user && options.user.UID!=='') {
            this.user = options.user;
            this.signedIn();
        }
    },

    confirmSignout: function () {
        this.trigger('confirmSignout', this);
    },

    signedIn: function() {
        $('.signin_button span').text(this.user.userName);
        $('.signin_button').attr('data-toggle', 'dropdown');
        $('.signin_button img').attr('src', 'images/Sign_out.png');
        $('.signout-button').text('Sign out');
    },

    signedOut: function() {
        $('.signin_button span').text('Sign in');
        $('.signin_button').attr('data-toggle', '');
        $('.signin_button img').attr('src', 'images/Sign_in.png');
        $('.signout-button').text('Sign in');
    },

    signin: function(triggerEvent) {
        if (typeof this.options.user !== 'undefined' && this.options.user.UID !== '') return;
        this.trigger('authentificate', 'signin');
    }
});

module.exports = HeaderView;
