'use strict';

var BloggingQuestionModel = require('./BloggingQuestionModel');

var BloggingQuestionCollectionModel = Backbone.Collection.extend({

    model: BloggingQuestionModel,

    initialize: function(attributes, options) {
        console.log("bloggingQuestionCollectionModel instantiated");
    }
});

module.exports = BloggingQuestionCollectionModel;
