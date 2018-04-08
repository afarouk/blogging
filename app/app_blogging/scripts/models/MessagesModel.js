'use strict';

var MessagesCollection = require('./MessagesCollection');

var MessagesModel = Backbone.Model.extend({

    defaults : {
		hasNext : false,
		hasPrevious : false,
		pageCount : 0
	},

    initialize: function() {
        this.messagesCollection = new MessagesCollection(this.attributes.comments);
    }
});

module.exports = MessagesModel;
