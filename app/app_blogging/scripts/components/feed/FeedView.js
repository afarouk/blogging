'use strict';

var bloggingQuestionView = require('./BloggingQuestionView'),
    bloggingController = require('../../controllers/bloggingController'),
    loader = require('../../loader');

var feedView = Mn.CollectionView.extend({

    childView: bloggingQuestionView,

    childEvents: {
        'collapseDetails': 'collapseDetails',
        'collapseMessages': 'collapseMessages',
        'answerQuestion' : 'onAnswerQuestion',
        'checkIfUserLogged': 'onCheckIfUserLogged',
        'sharePopup:show': 'openSharePopup',
        'addLikeDislike': 'addLikeDislike',
        'showTextMessage': 'showTextMessage',
        'getMessages': 'getMessages',
        'postComment': 'postComment',
        'refreshPanels': 'refreshPanels',
        'showNextMessages': 'showNextMessages'
    },

    childViewOptions: function() {
		return { user: this.options.user };
	},

    initialize : function() {
        this.params = this.model.get('params');
        this.listenTo(this.model, "change", this.modelEventHandler);
    },

    onShow: function() {
        this.bindScroll();
    },

    onRender: function() {
        loader.hide();
    },

    modelEventHandler : function() {
        console.log(" Model event received");
        this.render();
    },

    bindScroll: function() {
        this.$el.bind('scroll', _.bind(this.calculateScroll, this));
    },

    calculateScroll: function(e) {
        if (!this.model.get('previousId')) {
            return;
        };
        var windowHeight = $(window).height();
        var lastQuestionTop = this.$el.find('#'+this.model.get('previousId')).offset().top;
        if (lastQuestionTop < windowHeight) {
            this.params.nextId = this.model.get('previousId');
            this.params.count = 5;
            if (!this.params.nextId) return;
            this.trigger('getPreviousQuestions', this.params);
            this.$el.unbind('scroll');
        };
    },

    collapseDetails: function(view) {
        if (this.viewWithExpandedDetails) {
            this.viewWithExpandedDetails.triggerMethod('collapseDetailsInChild');
        }
        this.viewWithExpandedDetails = view;
    },

    collapseMessages: function(view) {
        if (this.viewWithExpandedMessages) {
            this.viewWithExpandedMessages.triggerMethod('hideMessages')
        }
        this.viewWithExpandedMessages = view;
    },

    onAnswerQuestion: function(view, choiceId, uuid, isCorrect) {
        this.trigger('answerQuestion', choiceId, uuid, isCorrect, view);
    },

    onCheckIfUserLogged: function(view, callback) {
        this.trigger('checkIfUserLogged', callback);
    },

    openSharePopup: function(view, questionModel) {
        this.trigger('sharePopup:show', questionModel);
    },

    addLikeDislike: function(view, options) {
        this.trigger('addLikeDislike', options, view);
    },

    showTextMessage: function(view, text) {
        this.trigger('showTextMessage', text);
    },

    getMessages: function(view) {
        this.trigger('getMessages', view);
    },

    showNextMessages: function(view, options) {
        this.trigger('showNextMessages', options, view);
    },

    postComment: function(view, options) {
        this.trigger('postComment', view, options);
    },

    refreshPanels: function() {
        this.trigger('refreshPanels');
    },

    rerenderChild: function(model) {

    }

});

module.exports = feedView;
