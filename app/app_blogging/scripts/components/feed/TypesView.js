'use strict';

var template = require('ejs!./templates/types.ejs');

var TypesView = Mn.ItemView.extend({

    template: template,

    className: 'types-container',

    ui: {
        'go' : '.go-button',
		'discard' : '.discard-button',
        'type': '.type_filter'
    },

    events: {
        'click @ui.discard': 'discard',
        'click @ui.go': 'updateFilters',
        'click @ui.type': 'onTypeSelected'
    },

    onShow: function() {
        if (this.typeSelected) {
            this.onTypeSelected(this.typeSelected);
        }
    },

    discard: function() {
        this.trigger('discard');
    },

    onTypeSelected: function(e) {
        this.ui.type.removeClass('active');
        var type;
        if (typeof e === 'string') {
            type = e;
        } else {
            type = $(e.currentTarget).addClass('active').find('a').attr('cmtyx-filter-type');
        }
        var options = {
            filterType: type
        };
        if (this.options.excludeAnswered === true) {
            options.excludeAnswered = true;
        }
        this.trigger('typeSelected', type);
        this.trigger('getQuestions', options);
    }
});

module.exports = TypesView;
