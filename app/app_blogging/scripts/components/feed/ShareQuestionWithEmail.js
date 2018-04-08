'use strict';

var template = require('ejs!./templates/shareQuestionWithEmail.ejs');

var ShareQuestionWithEmail = Mn.ItemView.extend({
    template: template,

    className: 'modal fade share-question-email',

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
    },

    share: function() {
        var email = this.ui.input.val(),
            contestUUID = this.options.model.get('uuid'),
            shareUrl = this.options.shareUrl;
        this.trigger('sendEmail', contestUUID, email, shareUrl, this);
    },

    close: function() {
        this.$el.modal('hide');
        this.$el.on('hidden.bs.modal', _.bind(function() {
            this.destroy();
        }, this));
    }
});

module.exports = ShareQuestionWithEmail;
