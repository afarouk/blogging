'use strict';

var gateway = require('../../APIGateway/gateway'),
	template = require('ejs!./templates/filters.ejs'),
	TypesView = require('./TypesView'),
	TagsView = require('../autocomplete/TagsView');

var FiltersView = Mn.LayoutView.extend({

	template: template,

	regions: {
		tagsRegion: '.js-select-tags-region'
	},

	ui: {
		'filtersTabs': '#blogging_feed_tabs_items li'
	},

	events: {
		'click @ui.filtersTabs': 'onSelectFiltersTab'
	},

	initialize: function() {
		this.excludeAnswered = false;
		this.filter = '';
	},

	serializeData: function() {
		return {};
	},

	onShow: function() {
		window.community.sharedblogging === true ?
		this.onGetSharedQuestion() :
		this.onGetDefault();
	},

	onSelectFiltersTab: function(filter) {
		if (filter !== 'HIDEANSWERED') {
			this.typeFilter = false;
		}
		switch(filter) {
			case 'FOLLOWING':
				this.onGetFollowing();
				this.filter = 'FOLLOWING';
				break;
			case 'CATEGORIES':
				this.onGetCategories();
				this.filter = 'CATEGORIES';
				break;
			case 'TAGS':
				this.onGetTags();
				this.filter = 'TAGS';
				break;
			case 'MYQUESTIONS':
				this.onGetMyQuestions();
				this.filter = 'MYQUESTIONS';
				break;
			case 'TYPE':
				this.showTypes();
				this.filter = 'TYPE';
				break;
			case 'HIDEANSWERED':
				this.onShowHideAnswered();
				break;
			default:
				this.onGetDefault();
				this.filter = '';
				break;
		}
	},

	onGetSharedQuestion: function() {
		var options = {
			contestUUID: window.community.uuidURL
		};
		this.trigger('getQuestion', options);
	},

	onGetDefault: function() {
		this.getRegion('tagsRegion').$el.hide();
		/* check if we have a shared question we are loading */
		var options;
		if( (typeof window.community.type !== 'undefined' ) && (window.community.type === 'l')){
			options={
				filterType: '',
				contestUUID:window.community.uuidURL
			};
			/* remove the arguments in window.community so we don't do this a second time. */
			window.community.type="";
			window.community.uuidURL="";
		} else {
			options = { filterType: '' };
			if (this.excludeAnswered === true) {
				options.excludeAnswered = true;
			}
		}
		this.trigger('getQuestions', options);
	},

	onGetFollowing: function() {
		this.getRegion('tagsRegion').$el.hide();
		var options = {
			filterType: 'FOLLOWING'
		};
		if (this.excludeAnswered === true) {
			options.excludeAnswered = true;
		}
		this.trigger('getQuestions', options);
	},

	showTypes: function() {
		this.trigger('types:show', this.excludeAnswered);
	},

	onShowTypes: function(view) {
		this.tagsRegion.$el.slideDown();
		this.tagsRegion.show(view);
	},

	onGetMyQuestions: function() {
		this.getRegion('tagsRegion').$el.hide();
		var options = {
			filterType: 'AUTHOR'
		};
		if (this.excludeAnswered === true) {
			options.excludeAnswered = true;
		}
		this.trigger('getQuestions', options);
	},

	onGetTags: function() {
		this.trigger('getTags', _.bind(this.showTags, this));
	},

	onGetCategories: function() {
		this.trigger('getCategories', _.bind(this.showCategories, this));
	},

	showCategories: function(categories) {
		var categoriesView = new TagsView({
			type: 'categories',
			items: categories,
			updateFilters: _.bind(this.updateFilters, this)
		});
		this.getRegion('tagsRegion').$el.show();
		this.getRegion('tagsRegion').show(categoriesView);
	},

	showTags: function(tags) {
		var tagsView = new TagsView({
			type: 'tags',
			items: tags,
			updateFilters: _.bind(this.updateFilters, this)
		});
		this.getRegion('tagsRegion').$el.show();
		this.getRegion('tagsRegion').show(tagsView);
	},

	onShowHideAnswered: function() {
		this.excludeAnswered = $('#hide_answered').is(':checked');
		if (this.typeFilter) {
			this.trigger('showHideAnswered:toggle', this.typeFilter, this.excludeAnswered);
		} else {
			this.onSelectFiltersTab(this.filter);
		}
	},

	updateFilters: function(params) {
		if (this.excludeAnswered === true) {
			params.excludeAnswered = true;
		}
		this.trigger('getQuestions', params);
	},

	onHideTagsRegion: function() {
		this.tagsRegion.$el.slideUp();
	}
});

module.exports = FiltersView;
