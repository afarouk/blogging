'use strict';

module.exports = {

    init: function() {
        $('<div/>', {
            class: 'loader wrapper'
        }).append(
        $('<div/>', {
            class: 'loader message col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4'
        })).appendTo('body');
        $('<div/>', {
            class: 'loader-img'
        }).appendTo('.loader.message');
        $('<p/>', {class: 'loader-text'}).appendTo('.loader.message');
    },

    show: function(text, flash) {
        this.init();
        $('.loader').show();
        if (!flash) {
            $('.loader-text').text('loading ' + text);
        } else if (flash === 'sending') {
            $('.loader-text').text(flash + ' ' + text);
        } else {
            $('.loader-img').hide();
            $('.loader.message').css('padding-top', '40px')
            $('.loader-text').text(text);
        }
    },

    showErrorMessage: function(err, msg) {
        if (err.status == 400) {
            this.showFlashMessage(err.responseJSON.error.message);
        } else {
            this.showFlashMessage(msg);
        }
    },

    showFlashMessage: function(msg, options){
        var self = this;
        var flash = true;
        this.hide();

        if( _(msg).isObject() ){
            options = msg;
            msg = null;
        } else {
            options = options || {};
        };

        var text = msg || options.msg || 'finished loading';

        this.show(text, flash);
        setTimeout(self.hide, 3000);
    },

    hide: function() {
        $('.loader').remove();
    }
}
