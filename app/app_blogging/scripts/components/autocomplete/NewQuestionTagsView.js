'use strict';

var template = require('ejs!./templates/newQuestionTagsTpl.ejs'),
	AutocompleteView = require('./AutocompleteView'),
	TagsCollection = require('./../../models/bloggingTagsCollection'),
	TagsCollectionView = require('./TagsCollectionView');

var TagsView = Mn.LayoutView.extend({

	template: template,

	regions: {
		inputRegion: '.js-input-region',
		tagsRegion: '.js-tags-region'
	},

	ui: {

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
			.on('change add remove reset', _.bind(this.updateFilters, this));

		var tagsCollectionView = new TagsCollectionView({
			collection: this.tagsCollection,
			type: this.options.type
		});
		this.getRegion('tagsRegion').show(tagsCollectionView);
	},

	onShow: function() {
		this.preselectItems();
	},

	preselectItems: function() {
		var items = this.options.items;
		if (this.options.preselected) {
			_.each(this.options.preselected, _.bind(function(preselected){
				var item = _.findWhere(items, {displayText: preselected});
				if (item) {
					item.value = item.displayText;
					this.tagsCollection.add(new Backbone.Model(item));
				} else if (this.options.type === 'tags') {
					item = {
						value: preselected,
						displayText: preselected,
						domainId: 29 // temporary for testing
					}
					this.tagsCollection.add(new Backbone.Model(item));
				}
			}, this));
		}
	},

	getTagsAutocompleteOptions: function() {
		var tags = this.options.items;
		return {
			data: tags,
			valueKey: 'displayText',
			allowNew: this.options.allowNew,
			allowEmpty: this.options.allowEmpty,
			apiKey: 'domainId',
			limit: this.options.items.length,
			name: this.options.type,
			additionalParam: 'newQuestion',
			callback: _.bind(function(name, model){
				this.tagsCollection.add(model);
				if (model.get('domainId') === '#newId') {
					//new tag creation handler
				}
			}, this)
		};
	},

	// remove all tags (reset)
	onTagsReset: function(e) {
		var model,
			actions = {
				add: false,
				merge: false,
				remove: false,
				reset: true
			};

		while (model = this.tagsCollection.first()) {
		  model.destroy();
		}
		this.tagsAutocompleteView.triggerMethod('changeDataSet',actions, null);
	},

	updateFilters: function(model, view, actions) {
		this.tagsAutocompleteView.triggerMethod('changeDataSet',actions, model);
		if (typeof this.options.updateFilters === 'function') {
			this.options.updateFilters(this.tagsCollection.getTagsArray());
		}
	}

});

module.exports = TagsView;
