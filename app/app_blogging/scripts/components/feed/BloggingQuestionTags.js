'use strict';

var template = require('ejs!./templates/bloggingQuestionTags.ejs');

var BloggingQuestionTags = Mn.ItemView.extend({

	template: template,

	className: 'blogging_question_tags',

	ui: {
		closeTags: '.blogging_question_tags_close'
	},

	events: {
		'click @ui.closeTags': 'closeTags'
	},

	serializeData: function() {
		return {
			tags: this.options.tags
		};
	},

	closeTags: function() {
		this.destroy();
	}
});

module.exports = BloggingQuestionTags;
