'use strict';

var template = require('ejs!./templates/shareQuestion.ejs');

var ShareQuestionView = Mn.ItemView.extend({
    template: template,

    className: 'modal fade share-question',

    ui: {
        closeButton: '.close_button',
        close: '.close',
        smsButton: '.sms-button',
        emailButton: '.email-button'
    },

    events: {
        'click @ui.close': 'close',
        'click @ui.closeButton': 'close',
        'click @ui.smsButton': 'sendMobile',
        'click @ui.emailButton': 'sendEmail'
    },

    initialize: function() {
        this.shareUrl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?t=l&u=' + this.model.get('uuid');
    },

    serializeData: function() {
        return {
            displayText: this.model.get('displayText'),
            shareUrl: this.shareUrl
        };
    },

    onShow: function() {
        this.$el.modal();
    },

    sendMobile: function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.close('sendSMS');
    },

    sendEmail: function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.close('sendEmail');
    },

    close: function(param) {

        this.$el.modal('hide');
        this.$el.on('hidden.bs.modal', _.bind(function() {
            if (typeof param === 'string') {
                this.trigger('shareQuestion', {
                    param: param,
                    model: this.model,
                    shareUrl: this.shareUrl
                });
            };
            this.destroy();
        }, this));
    }
});

module.exports = ShareQuestionView;
