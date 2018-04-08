'use strict';

var template = require('ejs!./templates/answerItem.ejs');

var AnswerItemView = Mn.ItemView.extend({

    template: template,

    tagName: 'li',

    serializeData: function() {
        return {
            choice: this.options
        };
    }
});

module.exports = AnswerItemView;
