'use strict';

var template = require('ejs!../templates/signIn.ejs'),
    loader = require('../../../loader'),
    Vent = require('../../../Vent'),
    sessionActions = require('../../../actions/sessionActions'),
    h = require('../../../globalHelpers'),
    SignUpView = require('./SignUpView');

var SignInView = Mn.ItemView.extend({
    template: template,

    className: 'modal fade signin',

    ui: {
        username: 'input[name="username"]',
        password: 'input[name="password"]',
        submit: '.submit_button',
        signup: '.signup_button',
        close: '.close_button',
        recoveryPassword: '.recovery_password'
    },

    events: {
        'click @ui.submit': 'submitForm',
        'click @ui.signup': 'openSignupView',
        'click @ui.recoveryPassword': 'recoveryPassword',
        'click @ui.close': 'close'
    },

    initialize: function(options) {
        this.parent = options.parent;
        this.$el.attr({
            'tabindex': '-1',
            'role': 'dialog'
        });
    },

    onShow: function() {
        this.$el.modal();
    },

    openSignupView: function(e) {
        this.close();
        this.$el.on('hidden.bs.modal', function () {
            this.trigger('signup', 'signup');
        }.bind(this));
    },

    submitForm: function() {
        this.trigger('submitSignin');
    },

    showLoginError: function() {
        this.$el.find('.login_error').show();
    },

    hideLoginError: function() {
        this.$el.find('.login_error').hide();
    },

    val: function () {
        return {
            username: this.ui.username.val(),
            password: this.ui.password.val()
        };
    },

    recoveryPassword: function() {
        this.trigger('passwordRecovery');
    },

    close: function() {
        this.$el.modal('hide');
    }
});

module.exports = SignInView;
