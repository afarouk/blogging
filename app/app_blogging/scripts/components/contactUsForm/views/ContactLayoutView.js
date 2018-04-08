'use strict';

var template = require('ejs!../templates/contactLayout.ejs');

var ContactLayoutView = Mn.LayoutView.extend({

    template: template,

    className: 'contact-form container-fluid',

    ui: {
        signin: '.signin-button',
        signup: '.signup-button',
        phoneInput: 'input[name=phone]',
        send: '.send-contact-info',
        senderName: 'input[name="name"]',
        replyToEmail: 'input[name="email"]',
        phoneNumber: 'input[name="phone"]',
        companyName: 'input[name="company"]',
        description: '.inquiry',
        senderNameError: '.senderName',
        replyToEmailError: '.replyToEmail',
        phoneNumberError: '.phoneNumber',
        companyNameError: '.companyName',
        descriptionError: '.description'
    },

    events: {
        'click @ui.signin': 'signin',
        'click @ui.signup': 'signup',
        'click @ui.send': 'sendContactInfo'
    },

    onShow: function() {
        $('.central-region').css('height', 'auto');
        // this.ui.phoneInput.mask('(000) 000-0000');
    },

    sendContactInfo: function() {
        var senderName = this.ui.senderName.val(),
            replyToEmail = this.ui.replyToEmail.val(),
            description = this.ui.description.val(),
            phoneNumber = this.ui.phoneNumber.val(),
            companyName = this.ui.companyName.val();
        var options = {
            senderName: senderName,
            replyToEmail: replyToEmail,
            description: description,
            phoneNumber: phoneNumber,
            companyName: companyName
        };
        if (!this.validateForm(options)) return;
        this.trigger('sendContactInfo', options);
    },

    validateForm: function(options) {
        this.isValid = true;
        for (var option in options) {
            console.log(option);
            if (this.ui[option].val() === '') {
                this.ui[option + 'Error'].show();
                this.isValid = false;
            };
        };
        this.ui.senderName.on('focus', _.bind(function() {
            this.ui.senderNameError.hide();
        }, this));
        this.ui.replyToEmail.on('focus', _.bind(function() {
            this.ui.replyToEmailError.hide();
        }, this));
        this.ui.phoneNumber.on('focus', _.bind(function() {
            this.ui.phoneNumberError.hide();
        }, this));
        this.ui.description.on('focus', _.bind(function() {
            this.ui.descriptionError.hide();
        }, this));
        this.ui.companyName.on('focus', _.bind(function() {
            this.ui.companyNameError.hide();
        }, this));
        return this.isValid;
    },

    signin: function() {
        this.trigger('signin', 'signin');
    },

    signup: function() {
        this.trigger('signup', 'signup');
    }

});

module.exports = ContactLayoutView;
