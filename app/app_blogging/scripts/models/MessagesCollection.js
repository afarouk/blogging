'use strict';

var MessageModel = require('./MessageModel');

var MessagesCollection = Backbone.Collection.extend({

	model: MessageModel

});

module.exports = MessagesCollection;
