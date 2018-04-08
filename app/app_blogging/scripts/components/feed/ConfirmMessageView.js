'use strict';

var template = require('ejs!./templates/confirmMessage.ejs');

var TextMessageView = Mn.ItemView.extend({
    template: template,

    className: 'modal fade text',

    ui: {
        yesButton: '.yes_button',
        noButton: '.no_button',
        close: '.close_button'
    },

    events: {
        'click @ui.yesButton': 'confirm',
        'click @ui.noButton': 'close',
        'click @ui.close': 'close'
    },

    initialize: function() {
        this.yesCallback = this.options.yesCallback || function () {};
        this.noCallback = this.options.noCallback || function () {};
    },

    serializeData: function() {
        return {
            text: this.options.text
        };
    },

    onShow: function() {
        this.$el.modal();
    },

    close: function() {
        this.$el.modal('hide');
        this.$el.on('hidden.bs.modal', _.bind(function() {
            this.noCallback();
        }, this));
    },

    confirm: function() {
        this.$el.modal('hide');
        this.$el.on('hidden.bs.modal', _.bind(function() {
            this.yesCallback();
        }, this));
    }

});

module.exports = TextMessageView;
