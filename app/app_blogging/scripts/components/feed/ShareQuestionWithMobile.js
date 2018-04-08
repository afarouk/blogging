'use strict';

var template = require('ejs!./templates/shareQuestionWithMobile.ejs');

var ShareQuestionWithMobile = Mn.ItemView.extend({
    template: template,

    className: 'modal fade share-question-mobile',

    ui: {
        close: '.close',
        closeButton: '.close_button',
        input: 'input',
        shareButton: '.confirmation_button'
    },

    events: {
        'click @ui.close': 'close',
        'click @ui.closeButton': 'close',
        'click @ui.shareButton': 'share'
    },

    onShow: function() {
        this.$el.modal();
        // this.ui.input.mask('(000) 000-0000');
    },

    share: function() {
        var phone = this.ui.input.val(),
            contestUUID = this.options.model.get('uuid'),
            shareUrl = this.options.shareUrl;
        this.trigger('sendMobile', contestUUID, phone, shareUrl, this);
    },

    close: function() {
        this.$el.modal('hide');
        this.$el.on('hidden.bs.modal', _.bind(function() {
            this.destroy();
        }, this));
    }
});

module.exports = ShareQuestionWithMobile;
