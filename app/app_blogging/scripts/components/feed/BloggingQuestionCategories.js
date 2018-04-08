'use strict';

var template = require('ejs!./templates/bloggingQuestionCategories.ejs');

var BloggingQuestionCategories = Mn.ItemView.extend({

	template: template,

	className: 'blogging_question_categories',

	ui: {
		closeCategories: '.blogging_question_categories_close'
	},

	events: {
		'click @ui.closeCategories': 'closeCategories'
	},

	serializeData: function() {
		return {
			categories: this.options.categories
		};
	},

	closeCategories: function() {
		this.destroy();
	}
});

module.exports = BloggingQuestionCategories;
