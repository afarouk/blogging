'use strict';

var template = require('ejs!./templates/answerCount.ejs');

var AnswerCountView = Mn.ItemView.extend({

	template: template,

	tagName: 'span',

	serializeData: function() {
		return {
			answers: this.options.answers
		};
	}
});

module.exports = AnswerCountView;
