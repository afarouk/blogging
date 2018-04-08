'use strict';

var itemTemplate = require('ejs!./templates/itemTpl.ejs');

var TagsItemView = Mn.ItemView.extend({
	template: itemTemplate,

	className: 'tag-item',

	ui: {
		tag: '.remove-tag'
	},

	events: {
		'click @ui.tag': 'removeTag'
	},

	serializeData: function() {

		return {
			tag: this.model.get('value'),
			hash: this.options.tagType === 'tags' ? '#' : ''
		};
	},

	removeTag: function() {
		this.trigger('removeTag');
	}
});

var TagsCollectionView = Mn.CollectionView.extend({
	childView: TagsItemView,

	childEvents: {
    	removeTag: function(tagView) {
    		this.collection.remove(tagView.model, {remove: true});
    	}
    },

	childViewOptions: function() {
      return {
        tagType: this.options.type
      };
    }
});

module.exports = TagsCollectionView;
