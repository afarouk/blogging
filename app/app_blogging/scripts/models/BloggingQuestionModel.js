'use strict';

var BloggingQuestionModel = Backbone.Model.extend({

    defaults : {
        title:'na',
        isAnswered : false,
        isLiked : false,
        currentAnswerChecked : 0,
        options : null,
        anotatation : null,
        expandResults:false,
        showInformation:false,
        answers:['This is answer 1','This is answer 2','None of the above'],
        highlighted:false
    },

    initialize : function(attributes, options) {
        console.log("bloggingQuestionModel instantiated");
        /* pull up the answered state */
        this.isAnswered=attributes['answerStatus']['enumText']==='ANSWERED';
        this.isLiked = attributes['likeStatus']['enumText']==='LIKE';
        this.currentAnswerChecked=attributes['currentChoiceByUser'];
        this.highlighted=attributes['displayStyle']==='HIGHLIGHT';
        console.log('Question '+this.isAnswered);
    },

    changedAttribute: function() {
        console.log('changed');
    }
});

module.exports = BloggingQuestionModel;
