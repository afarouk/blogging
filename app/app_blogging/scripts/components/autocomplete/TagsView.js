'use strict';

var template = require('ejs!./templates/tagsTpl.ejs'),
	AutocompleteView = require('./AutocompleteView'),
	TagsCollection = require('./../../models/BloggingTagsCollection'),
	TagsCollectionView = require('./TagsCollectionView');

var TagsView = Mn.LayoutView.extend({

	template: template,

	className: 'tags-container',

	regions: {
		inputRegion: '.js-input-region',
		tagsRegion: '.js-tags-region'
	},

	ui: {
		'go' : '.go-button',
		'discard' : '.discard-button',
		'collapsibleContent': '#tags-filter-expanded',
		'toggle': '.blogging_tags_close img'
	},

	events: {
		'click @ui.go': 'updateFilters',
		'click @ui.discard': 'discardChanges'
	},

	arrows: {
		down: 'images/arrow_down.png',
		up: 'images/arrow_up.png'
	},

	serializeData: function() {
		return {
			type: this.options.type
		};
	},

	onRender: function() {
		this.tagsAutocompleteView = new AutocompleteView(this.getTagsAutocompleteOptions());

		this.getRegion('inputRegion').show(this.tagsAutocompleteView);

		this.tagsCollection = new TagsCollection();

		this.tagsCollection.off('change add remove reset')
			.on('change add remove reset', _.bind(this.onChange, this));

		var tagsCollectionView = new TagsCollectionView({
			collection: this.tagsCollection,
			type: this.options.type
		});
		this.getRegion('tagsRegion').show(tagsCollectionView);
	},

	onChange: function(model, viev, action) {
		this.tagsAutocompleteView.triggerMethod('changeDataSet',action, model);
	},

	onShow: function() {
		this.toggleCollapsible();
		//change collapse/expande arrow
		this.ui.collapsibleContent.on('shown.bs.collapse', _.bind(function() {
			this.ui.toggle.attr('src', this.arrows.up);
		}, this));
		this.ui.collapsibleContent.on('hidden.bs.collapse', _.bind(function() {
			this.ui.toggle.attr('src', this.arrows.down);
		}, this));
	},

	toggleCollapsible: function() {
		//looks much better with timeout
		setTimeout(_.bind(function() {
			this.ui.collapsibleContent.collapse('toggle');
		}, this), 10);
	},

	getTagsAutocompleteOptions: function() {
		var tags = this.options.items;
		return {
			data: tags,
			valueKey: 'displayText',
			apiKey: 'domainId',
			limit: this.options.items.length,
			name: this.options.type,
			callback: _.bind(function(name, model){
				this.tagsCollection.add(model);
			}, this)
		};
	},

	discardChanges: function() {
		// this.tagsCollection.reset();
		$.when(this.ui.collapsibleContent.collapse('toggle')).then(setTimeout(_.bind(this.destroy, this), 300));
		// this.updateFilters();
	},

	updateFilters: function() {
		this.toggleCollapsible();
		if (typeof this.options.updateFilters === 'function') {
			this.options.updateFilters(
				this.tagsCollection.createQueryParams(this.options.type));
		}
	}

});

module.exports = TagsView;
